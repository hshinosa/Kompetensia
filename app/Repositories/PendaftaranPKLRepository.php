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
     * Check if user has any active PKL registration
     * Active means: status is Pengajuan, Menunggu, or Disetujui (but not yet passed/lulus)
     * If PKL has penilaian status 'Diterima' (Lulus), it's NOT active anymore - user can register new PKL
     */
    public function hasActiveRegistration(int $userId): ?PendaftaranPKL
    {
        // First check for Pengajuan or Menunggu status (always blocks new registration)
        $pendingRegistration = $this->model
            ->where('user_id', $userId)
            ->whereIn('status', ['Pengajuan', 'Menunggu'])
            ->first();

        if ($pendingRegistration) {
            return $pendingRegistration;
        }

        // Get all Disetujui registrations and check them one by one
        $approvedRegistrations = $this->model
            ->with('penilaian') // Load penilaian relation
            ->where('user_id', $userId)
            ->where('status', 'Disetujui')
            ->get();

        foreach ($approvedRegistrations as $registration) {
            // If has penilaian and status is 'Diterima' (Lulus), skip - user can register new PKL
            if ($registration->penilaian && $registration->penilaian->status_penilaian === 'Diterima') {
                continue; // This PKL is completed successfully, not blocking
            }

            // If has penilaian but NOT 'Diterima', block
            if ($registration->penilaian && $registration->penilaian->status_penilaian !== 'Diterima') {
                return $registration; // Still active, block new registration
            }

            // If no penilaian, check date
            if (!$registration->penilaian) {
                // If date not set or still in future, block
                if (!$registration->tanggal_selesai || $registration->tanggal_selesai >= now()->toDateString()) {
                    return $registration; // Still active, block new registration
                }
            }
        }

        return null; // No active registration found, user can register
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