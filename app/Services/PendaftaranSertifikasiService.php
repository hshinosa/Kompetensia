<?php

namespace App\Services;

use App\Models\PendaftaranSertifikasi;
use App\Models\User;
use App\Repositories\Contracts\PendaftaranSertifikasiRepositoryInterface;
use App\Repositories\Contracts\SertifikasiRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Exception;

class PendaftaranSertifikasiService
{
    protected $pendaftaranRepository;
    protected $sertifikasiRepository;

    public function __construct(
        PendaftaranSertifikasiRepositoryInterface $pendaftaranRepository,
        SertifikasiRepositoryInterface $sertifikasiRepository
    ) {
        $this->pendaftaranRepository = $pendaftaranRepository;
        $this->sertifikasiRepository = $sertifikasiRepository;
    }

    /**
     * Get all pendaftaran with pagination
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->pendaftaranRepository->getAllPaginated($perPage);
    }

    /**
     * Get pendaftaran by user
     */
    public function getByUser(User $user): Collection
    {
        return $this->pendaftaranRepository->getByUserId($user->id);
    }

    /**
     * Create new pendaftaran sertifikasi
     */
    public function createPendaftaran(array $data, User $user): PendaftaranSertifikasi
    {
        DB::beginTransaction();
        
        try {
            // Check if user already registered for this sertifikasi and batch
            if ($this->pendaftaranRepository->isUserAlreadyRegistered(
                $user->id, 
                $data['sertifikasi_id'], 
                $data['batch_id']
            )) {
                throw new Exception('Anda sudah terdaftar untuk sertifikasi dan batch ini.');
            }

            // Validate sertifikasi exists and is active
            $sertifikasi = $this->sertifikasiRepository->findById($data['sertifikasi_id']);
            if (!$sertifikasi || $sertifikasi->status !== 'Aktif') {
                throw new Exception('Sertifikasi tidak tersedia atau tidak aktif.');
            }

            // Process berkas persyaratan if exists
            if (isset($data['berkas_persyaratan']) && is_array($data['berkas_persyaratan'])) {
                $data['berkas_persyaratan'] = $this->processBerkasPersyaratan($data['berkas_persyaratan']);
            }

            // Prepare pendaftaran data
            $pendaftaranData = [
                'user_id' => $user->id,
                'sertifikasi_id' => $data['sertifikasi_id'],
                'batch_id' => $data['batch_id'],
                'status' => 'Pengajuan',
                'tanggal_pendaftaran' => now()->toDateString(),
                'nama_lengkap' => $data['nama_lengkap'],
                'email' => $data['email'],
                'no_telp' => $data['no_telp'],
                'motivasi' => $data['motivasi'] ?? null,
                'berkas_persyaratan' => $data['berkas_persyaratan'] ?? null,
            ];

            $pendaftaran = $this->pendaftaranRepository->create($pendaftaranData);

            DB::commit();
            
            return $pendaftaran;
            
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update pendaftaran status
     */
    public function updateStatus(int $id, string $status, ?string $catatanAdmin = null): bool
    {
        $validStatuses = ['Pengajuan', 'Disetujui', 'Ditolak', 'Dibatalkan'];
        
        if (!in_array($status, $validStatuses)) {
            throw new Exception('Status tidak valid.');
        }

        return $this->pendaftaranRepository->updateStatus($id, $status, $catatanAdmin);
    }

    /**
     * Get pendaftaran by status
     */
    public function getByStatus(string $status): Collection
    {
        return $this->pendaftaranRepository->getByStatus($status);
    }

    /**
     * Get pendaftaran detail with relations
     */
    public function getDetailById(int $id): ?PendaftaranSertifikasi
    {
        return $this->pendaftaranRepository->getWithRelations($id);
    }

    /**
     * Cancel pendaftaran
     */
    public function cancelPendaftaran(int $id, User $user): bool
    {
        $pendaftaran = $this->pendaftaranRepository->findById($id);
        
        if (!$pendaftaran) {
            throw new Exception('Pendaftaran tidak ditemukan.');
        }

        if ($pendaftaran->user_id !== $user->id) {
            throw new Exception('Anda tidak memiliki akses untuk membatalkan pendaftaran ini.');
        }

        if ($pendaftaran->status !== 'Pengajuan') {
            throw new Exception('Pendaftaran yang sudah diproses tidak dapat dibatalkan.');
        }

        return $this->pendaftaranRepository->updateStatus($id, 'Dibatalkan');
    }

    /**
     * Process berkas persyaratan files
     */
    private function processBerkasPersyaratan(array $files): array
    {
        $uploadedFiles = [];
        
        foreach ($files as $key => $file) {
            if ($file instanceof UploadedFile) {
                $path = $file->store('berkas-sertifikasi', 'public');
                $uploadedFiles[$key] = [
                    'original_name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'uploaded_at' => now()->toISOString(),
                ];
            }
        }
        
        return $uploadedFiles;
    }

    /**
     * Get statistics for dashboard
     */
    public function getStatistics(): array
    {
        return [
            'total_pendaftaran' => $this->pendaftaranRepository->getAllPaginated(1)->total(),
            'pending_approval' => $this->pendaftaranRepository->getByStatus('Pengajuan')->count(),
            'approved' => $this->pendaftaranRepository->getByStatus('Disetujui')->count(),
            'rejected' => $this->pendaftaranRepository->getByStatus('Ditolak')->count(),
        ];
    }
}