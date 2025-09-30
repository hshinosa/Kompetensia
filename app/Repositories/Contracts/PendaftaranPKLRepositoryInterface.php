<?php

namespace App\Repositories\Contracts;

use App\Models\PendaftaranPKL;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface PendaftaranPKLRepositoryInterface
{
    /**
     * Get all pendaftaran PKL with pagination
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator;

    /**
     * Get pendaftaran PKL by user ID
     */
    public function getByUserId(int $userId): Collection;

    /**
     * Get pendaftaran PKL by posisi PKL ID
     */
    public function getByPosisiPKLId(int $posisiPklId): Collection;

    /**
     * Find pendaftaran PKL by ID
     */
    public function findById(int $id): ?PendaftaranPKL;

    /**
     * Create new pendaftaran PKL
     */
    public function create(array $data): PendaftaranPKL;

    /**
     * Update pendaftaran PKL
     */
    public function update(int $id, array $data): bool;

    /**
     * Delete pendaftaran PKL
     */
    public function delete(int $id): bool;

    /**
     * Get pendaftaran with relations
     */
    public function getWithRelations(int $id): ?PendaftaranPKL;

    /**
     * Check if user already registered for specific posisi PKL
     */
    public function isUserAlreadyRegistered(int $userId, int $posisiPklId): bool;

    /**
     * Get pendaftaran by status
     */
    public function getByStatus(string $status): Collection;

    /**
     * Update status
     */
    public function updateStatus(int $id, string $status, ?string $catatanAdmin = null): bool;

    /**
     * Get pendaftaran by institusi
     */
    public function getByInstitusi(string $institusi): Collection;

    /**
     * Get active pendaftaran (status: Disetujui)
     */
    public function getActivePendaftaran(): Collection;
}