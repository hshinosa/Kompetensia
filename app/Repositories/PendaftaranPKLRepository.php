<?php

namespace App\Repositories;

use App\Models\PendaftaranPKL;
use App\Repositories\Contracts\PendaftaranPKLRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class PendaftaranPKLRepository implements PendaftaranPKLRepositoryInterface
{
    /**
     * @var PendaftaranPKL
     */
    protected $model;

    public function __construct(PendaftaranPKL $model)
    {
        $this->model = $model;
    }

    /**
     * Get all pendaftaran PKL with pagination
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->with(['user', 'posisiPKL'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get pendaftaran PKL by user ID
     */
    public function getByUserId(int $userId): Collection
    {
        return $this->model
            ->with(['posisiPKL'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get pendaftaran PKL by posisi PKL ID
     */
    public function getByPosisiPKLId(int $posisiPklId): Collection
    {
        return $this->model
            ->with(['user'])
            ->where('posisi_pkl_id', $posisiPklId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Find pendaftaran PKL by ID
     */
    public function findById(int $id): ?PendaftaranPKL
    {
        return $this->model->find($id);
    }

    /**
     * Create new pendaftaran PKL
     */
    public function create(array $data): PendaftaranPKL
    {
        return $this->model->create($data);
    }

    /**
     * Update pendaftaran PKL
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
     * Delete pendaftaran PKL
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
    public function getWithRelations(int $id): ?PendaftaranPKL
    {
        return $this->model
            ->with(['user', 'posisiPKL', 'penilaian'])
            ->find($id);
    }

    /**
     * Check if user already registered for specific posisi PKL
     */
    public function isUserAlreadyRegistered(int $userId, int $posisiPklId): bool
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('posisi_pkl_id', $posisiPklId)
            ->whereIn('status', ['Pengajuan', 'Disetujui'])
            ->exists();
    }

    /**
     * Get pendaftaran by status
     */
    public function getByStatus(string $status): Collection
    {
        return $this->model
            ->with(['user', 'posisiPKL'])
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

    /**
     * Get pendaftaran by institusi
     */
    public function getByInstitusi(string $institusi): Collection
    {
        return $this->model
            ->with(['user', 'posisiPKL'])
            ->where('institusi_asal', 'like', '%' . $institusi . '%')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get active pendaftaran (status: Disetujui)
     */
    public function getActivePendaftaran(): Collection
    {
        return $this->model
            ->with(['user', 'posisiPKL'])
            ->where('status', 'Disetujui')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}