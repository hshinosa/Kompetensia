<?php

namespace App\Repositories;

use App\Models\PendaftaranSertifikasi;
use App\Repositories\Contracts\PendaftaranSertifikasiRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class PendaftaranSertifikasiRepository implements PendaftaranSertifikasiRepositoryInterface
{
    /**
     * @var PendaftaranSertifikasi
     */
    protected $model;

    public function __construct(PendaftaranSertifikasi $model)
    {
        $this->model = $model;
    }

    /**
     * Get all pendaftaran sertifikasi with pagination
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->with(['user', 'sertifikasi', 'batchSertifikasi'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get pendaftaran sertifikasi by user ID
     */
    public function getByUserId(int $userId): Collection
    {
        return $this->model
            ->with(['sertifikasi', 'batch'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get pendaftaran sertifikasi by sertifikasi ID
     */
    public function getBySertifikasiId(int $sertifikasiId): Collection
    {
        return $this->model
            ->with(['user', 'batch'])
            ->where('sertifikasi_id', $sertifikasiId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get pendaftaran sertifikasi by batch ID
     */
    public function getByBatchId(int $batchId): Collection
    {
        return $this->model
            ->with(['user', 'sertifikasi'])
            ->where('batch_id', $batchId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Find pendaftaran sertifikasi by ID
     */
    public function findById(int $id): ?PendaftaranSertifikasi
    {
        return $this->model->find($id);
    }

    /**
     * Create new pendaftaran sertifikasi
     */
    public function create(array $data): PendaftaranSertifikasi
    {
        return $this->model->create($data);
    }

    /**
     * Update pendaftaran sertifikasi
     */
    public function update(int $id, array $data): bool
    {
        $pendaftaran = $this->findById($id);
        if (!$pendaftaran) {
            return false;
        }

        return $pendaftaran->update($data);
    }

    /**
     * Delete pendaftaran sertifikasi
     */
    public function delete(int $id): bool
    {
        $pendaftaran = $this->findById($id);
        if (!$pendaftaran) {
            return false;
        }

        return $pendaftaran->delete();
    }

    /**
     * Get pendaftaran with relations
     */
    public function getWithRelations(int $id): ?PendaftaranSertifikasi
    {
        return $this->model
            ->with(['user', 'sertifikasi', 'batch', 'penilaian'])
            ->find($id);
    }

    /**
     * Check if user already registered for specific sertifikasi and batch
     */
    public function isUserAlreadyRegistered(int $userId, int $sertifikasiId, int $batchId): bool
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('sertifikasi_id', $sertifikasiId)
            ->where('batch_id', $batchId)
            ->whereIn('status', ['Pengajuan', 'Disetujui'])
            ->exists();
    }

    /**
     * Get pendaftaran by status
     */
    public function getByStatus(string $status): Collection
    {
        return $this->model
            ->with(['user', 'sertifikasi', 'batch'])
            ->where('status', $status)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Update status
     */
    public function updateStatus(int $id, string $status, ?string $catatanAdmin = null): bool
    {
        $updateData = [
            'status' => $status,
            'tanggal_diproses' => now(),
        ];

        if ($catatanAdmin !== null) {
            $updateData['catatan_admin'] = $catatanAdmin;
        }

        return $this->update($id, $updateData);
    }
}