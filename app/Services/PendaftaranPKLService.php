<?php

namespace App\Services;

use App\Models\PendaftaranPKL;
use App\Models\User;
use App\Repositories\Contracts\PendaftaranPKLRepositoryInterface;
use App\Repositories\Contracts\PKLRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Exception;

class PendaftaranPKLService
{
    protected $pendaftaranRepository;
    protected $pklRepository;

    public function __construct(
        PendaftaranPKLRepositoryInterface $pendaftaranRepository,
        PKLRepositoryInterface $pklRepository
    ) {
        $this->pendaftaranRepository = $pendaftaranRepository;
        $this->pklRepository = $pklRepository;
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
     * Get active registration for user (if any)
     */
    public function getActiveRegistration(int $userId): ?PendaftaranPKL
    {
        return $this->pendaftaranRepository->hasActiveRegistration($userId);
    }

    /**
     * Create new pendaftaran PKL
     */
    public function createPendaftaran(array $data, User $user): PendaftaranPKL
    {
        DB::beginTransaction();
        
        try {
            // === COMPREHENSIVE LOGGING FOR PKL REGISTRATION ===
            \Log::info('=== STARTING PKL REGISTRATION CREATION ===', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'user_name' => $user->nama_lengkap ?? $user->nama,
                'timestamp' => now()->toDateTimeString()
            ]);
            
            // Log berkas (files) data specifically - MAIN FOCUS
            \Log::info('BERKAS DATA RECEIVED FROM FRONTEND:', [
                'cv_file_path' => $data['cv_file_path'] ?? 'NOT_PROVIDED',
                'cv_file_name' => $data['cv_file_name'] ?? 'NOT_PROVIDED', 
                'portfolio_file_path' => $data['portfolio_file_path'] ?? 'NOT_PROVIDED',
                'portfolio_file_name' => $data['portfolio_file_name'] ?? 'NOT_PROVIDED',
                'has_cv_data' => !empty($data['cv_file_path']),
                'has_portfolio_data' => !empty($data['portfolio_file_path']),
                'cv_file_length' => !empty($data['cv_file_path']) ? strlen($data['cv_file_path']) : 0,
                'portfolio_file_length' => !empty($data['portfolio_file_path']) ? strlen($data['portfolio_file_path']) : 0
            ]);
            
            // Log complete incoming data structure
            \Log::info('COMPLETE INCOMING DATA ANALYSIS:', [
                'total_fields' => count($data),
                'data_keys' => array_keys($data),
                'berkas_specific_fields' => array_filter($data, function($key) {
                    return strpos($key, 'file') !== false;
                }, ARRAY_FILTER_USE_KEY),
                'sample_data' => array_slice($data, 0, 5, true) // First 5 fields as sample
            ]);

            // Get posisi_pkl_id
            $posisiPklId = $data['posisi_pkl_id'] ?? null;
            
            \Log::info('POSISI PKL ID DETERMINATION:', [
                'posisi_pkl_id_from_field' => $posisiPklId,
                'data_keys' => array_keys($data)
            ]);
            
            if (!$posisiPklId) {
                throw new Exception('Posisi PKL ID tidak ditemukan dalam data pendaftaran.');
            }
            
            // Check if user has any active PKL registration
            $activeRegistration = $this->pendaftaranRepository->hasActiveRegistration($user->id);
            
            if ($activeRegistration) {
                $penilaianStatus = $activeRegistration->penilaian ? $activeRegistration->penilaian->status_penilaian : null;
                
                \Log::info('PKL Registration: User has active registration', [
                    'user_id' => $user->id,
                    'existing_registration_id' => $activeRegistration->id,
                    'existing_status' => $activeRegistration->status,
                    'existing_posisi' => $activeRegistration->posisiPKL->nama_posisi ?? 'Unknown',
                    'tanggal_selesai' => $activeRegistration->tanggal_selesai,
                    'penilaian_status' => $penilaianStatus,
                    'has_passed' => $penilaianStatus === 'Diterima'
                ]);
                
                // Build user-friendly error message based on status
                if ($activeRegistration->status === 'Pengajuan') {
                    throw new Exception('Anda sudah memiliki pendaftaran PKL yang sedang menunggu persetujuan. Silakan tunggu hingga pendaftaran Anda disetujui atau ditolak sebelum mendaftar PKL lain.');
                } elseif ($activeRegistration->status === 'Disetujui') {
                    // Check penilaian status first
                    if ($penilaianStatus && $penilaianStatus !== 'Diterima') {
                        throw new Exception("Anda sedang menjalani PKL di posisi \"{$activeRegistration->posisiPKL->nama_posisi}\". Anda hanya dapat mendaftar PKL baru setelah dinyatakan LULUS oleh asesor.");
                    } elseif (!$penilaianStatus) {
                        // No penilaian yet, check date
                        $endDate = $activeRegistration->tanggal_selesai 
                            ? \Carbon\Carbon::parse($activeRegistration->tanggal_selesai)->format('d M Y')
                            : 'belum ditentukan';
                        throw new Exception("Anda sedang menjalani PKL di posisi \"{$activeRegistration->posisiPKL->nama_posisi}\" hingga {$endDate}. Anda hanya dapat mendaftar PKL baru setelah dinyatakan LULUS oleh asesor atau PKL saat ini selesai.");
                    }
                } else {
                    throw new Exception('Anda sudah memiliki pendaftaran PKL aktif. Silakan selesaikan atau tunggu proses pendaftaran yang sedang berjalan sebelum mendaftar PKL baru.');
                }
            }

            // Validate posisi PKL exists and is active
            $posisiPKL = $this->pklRepository->find($posisiPklId);
            if (!$posisiPKL || $posisiPKL->status !== 'Aktif') {
                throw new Exception('Posisi PKL tidak tersedia atau tidak aktif.');
            }

            // Process berkas persyaratan if exists
            if (isset($data['berkas_persyaratan']) && is_array($data['berkas_persyaratan'])) {
                $data['berkas_persyaratan'] = $this->processBerkasPersyaratan($data['berkas_persyaratan']);
            }

            // Berkas fields - LOG MAPPING PROCESS
            \Log::info('MAPPING BERKAS DATA TO PENDAFTARAN:', [
                'incoming_cv_path' => $data['cv_file_path'] ?? 'NULL',
                'incoming_cv_name' => $data['cv_file_name'] ?? 'NULL',
                'incoming_portfolio_path' => $data['portfolio_file_path'] ?? 'NULL', 
                'incoming_portfolio_name' => $data['portfolio_file_name'] ?? 'NULL'
            ]);
            
            $pendaftaranData = [
                'user_id' => $user->id,
                'posisi_pkl_id' => $posisiPklId, // Use the posisi_pkl_id from bidang_yang_disukai
                'status' => 'Pengajuan',
                'tanggal_pendaftaran' => now()->toDateString(),
                
                // Data Diri Fields
                'nama_lengkap' => $data['nama_lengkap'] ?? null,
                'tempat_lahir' => $data['tempat_lahir'] ?? null,
                'tanggal_lahir' => $data['tanggal_lahir'] ?? null,
                'email_pendaftar' => $data['email_pendaftar'] ?? null,
                'nomor_handphone' => $data['nomor_handphone'] ?? null,
                'alamat' => $data['alamat'] ?? null,
                'instagram' => $data['instagram'] ?? null,
                'tiktok' => $data['tiktok'] ?? null,
                'memiliki_laptop' => $data['memiliki_laptop'] ?? null,
                'memiliki_kamera_dslr' => $data['memiliki_kamera_dslr'] ?? null,
                'transportasi_operasional' => $data['transportasi_operasional'] ?? null,
                
                // Background Pendidikan Fields
                'institusi_asal' => $data['institusi_asal'] ?? null,
                'asal_sekolah' => $data['asal_sekolah'] ?? null,
                'program_studi' => $data['program_studi'] ?? null,
                'jurusan' => $data['jurusan'] ?? null,
                'kelas' => $data['kelas'] ?? null,
                'semester' => $data['semester'] ?? null,
                'awal_pkl' => $data['awal_pkl'] ?? null,
                'akhir_pkl' => $data['akhir_pkl'] ?? null,
                
                // Skill & Minat Fields
                'kemampuan_ditingkatkan' => $data['kemampuan_ditingkatkan'] ?? null,
                'skill_kelebihan' => $data['skill_kelebihan'] ?? null,
                'pernah_membuat_video' => $data['pernah_membuat_video'] ?? null,
                
                // Kebijakan & Finalisasi Fields
                'sudah_melihat_profil' => $data['sudah_melihat_profil'] ?? null,
                'tingkat_motivasi' => $data['tingkat_motivasi'] ?? null,
                'nilai_diri' => $data['nilai_diri'] ?? null,
                'apakah_merokok' => $data['apakah_merokok'] ?? null,
                'bersedia_ditempatkan' => $data['bersedia_ditempatkan'] ?? null,
                'bersedia_masuk_2_kali' => $data['bersedia_masuk_2_kali'] ?? null,
                
                // Optional fields
                'tanggal_mulai' => $data['tanggal_mulai'] ?? null,
                'tanggal_selesai' => $data['tanggal_selesai'] ?? null,
                'motivasi' => $data['motivasi'] ?? null,
                'berkas_persyaratan' => $data['berkas_persyaratan'] ?? null,
                
                // Berkas fields - CRITICAL FOR FILE TRACKING
                'cv_file_path' => $data['cv_file_path'] ?? null,
                'cv_file_name' => $data['cv_file_name'] ?? null,
                'portfolio_file_path' => $data['portfolio_file_path'] ?? null,
                'portfolio_file_name' => $data['portfolio_file_name'] ?? null,
            ];
            
            // Log berkas mapping result
            \Log::info('BERKAS MAPPING RESULT:', [
                'mapped_cv_path' => $pendaftaranData['cv_file_path'],
                'mapped_cv_name' => $pendaftaranData['cv_file_name'],
                'mapped_portfolio_path' => $pendaftaranData['portfolio_file_path'],
                'mapped_portfolio_name' => $pendaftaranData['portfolio_file_name'],
                'cv_path_is_null' => is_null($pendaftaranData['cv_file_path']),
                'portfolio_path_is_null' => is_null($pendaftaranData['portfolio_file_path'])
            ]);
            
            // Log file existence check before saving
            if ($pendaftaranData['cv_file_path']) {
                $cvFullPath = storage_path('app/public/' . $pendaftaranData['cv_file_path']);
                \Log::info('CV FILE EXISTENCE CHECK:', [
                    'cv_file_path' => $pendaftaranData['cv_file_path'],
                    'full_path' => $cvFullPath,
                    'file_exists' => file_exists($cvFullPath),
                    'file_size' => file_exists($cvFullPath) ? filesize($cvFullPath) : 'N/A'
                ]);
            }
            
            if ($pendaftaranData['portfolio_file_path']) {
                $portfolioFullPath = storage_path('app/public/' . $pendaftaranData['portfolio_file_path']);
                \Log::info('PORTFOLIO FILE EXISTENCE CHECK:', [
                    'portfolio_file_path' => $pendaftaranData['portfolio_file_path'],
                    'full_path' => $portfolioFullPath,
                    'file_exists' => file_exists($portfolioFullPath),
                    'file_size' => file_exists($portfolioFullPath) ? filesize($portfolioFullPath) : 'N/A'
                ]);
            }
            
            \Log::info('FINAL DATA BEING SENT TO REPOSITORY:', [
                'berkas_data_summary' => [
                    'cv_file_path' => $pendaftaranData['cv_file_path'],
                    'cv_file_name' => $pendaftaranData['cv_file_name'],
                    'portfolio_file_path' => $pendaftaranData['portfolio_file_path'],
                    'portfolio_file_name' => $pendaftaranData['portfolio_file_name']
                ],
                'total_fields_to_save' => count($pendaftaranData)
            ]);

            $pendaftaran = $this->pendaftaranRepository->create($pendaftaranData);

            // === DETAILED LOGGING FOR WHAT WAS ACTUALLY SAVED ===
            \Log::info('=== PKL REGISTRATION SUCCESSFULLY CREATED ===', [
                'pendaftaran_id' => $pendaftaran->id,
                'user_id' => $pendaftaran->user_id,
                'posisi_pkl_id' => $pendaftaran->posisi_pkl_id,
                'status' => $pendaftaran->status,
                'created_at' => $pendaftaran->created_at
            ]);
            
            // Log berkas data that was saved - MAIN FOCUS
            \Log::info('BERKAS DATA SAVED TO DATABASE - VERIFICATION:', [
                'pendaftaran_id' => $pendaftaran->id,
                'saved_cv_file_path' => $pendaftaran->cv_file_path,
                'saved_cv_file_name' => $pendaftaran->cv_file_name,
                'saved_portfolio_file_path' => $pendaftaran->portfolio_file_path,
                'saved_portfolio_file_name' => $pendaftaran->portfolio_file_name,
                'cv_data_present' => !empty($pendaftaran->cv_file_path),
                'portfolio_data_present' => !empty($pendaftaran->portfolio_file_path)
            ]);
            
            // Final file existence verification
            \Log::info('FINAL FILE EXISTENCE VERIFICATION:', [
                'cv_file_exists' => $pendaftaran->cv_file_path ? (file_exists(storage_path('app/public/' . $pendaftaran->cv_file_path)) ? 'YES' : 'NO') : 'N/A',
                'portfolio_file_exists' => $pendaftaran->portfolio_file_path ? (file_exists(storage_path('app/public/' . $pendaftaran->portfolio_file_path)) ? 'YES' : 'NO') : 'N/A',
                'cv_file_full_path' => $pendaftaran->cv_file_path ? storage_path('app/public/' . $pendaftaran->cv_file_path) : 'N/A',
                'portfolio_file_full_path' => $pendaftaran->portfolio_file_path ? storage_path('app/public/' . $pendaftaran->portfolio_file_path) : 'N/A'
            ]);

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
    public function getDetailById(int $id): ?PendaftaranPKL
    {
        return $this->pendaftaranRepository->getWithRelations($id);
    }

    /**
     * Get pendaftaran by ID (alias for getDetailById for backward compatibility)
     */
    public function getPendaftaranById(int $id): ?PendaftaranPKL
    {
        return $this->getDetailById($id);
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
     * Get active pendaftaran
     */
    public function getActivePendaftaran(): Collection
    {
        return $this->pendaftaranRepository->getActivePendaftaran();
    }

    /**
     * Get pendaftaran by institusi
     */
    public function getByInstitusi(string $institusi): Collection
    {
        return $this->pendaftaranRepository->getByInstitusi($institusi);
    }

    /**
     * Process berkas persyaratan files
     */
    private function processBerkasPersyaratan(array $files): array
    {
        $uploadedFiles = [];
        
        foreach ($files as $key => $file) {
            if ($file instanceof UploadedFile) {
                $path = $file->store('berkas-pkl', 'public');
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
            'active_pkl' => $this->pendaftaranRepository->getActivePendaftaran()->count(),
        ];
    }
}