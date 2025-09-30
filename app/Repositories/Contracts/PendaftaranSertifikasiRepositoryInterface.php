<?php

namespace App\Repositories\Contracts;

use App\Models\PendaftaranSertifikasi;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface PendaftaranSertifikasiRepositoryInterface
{
    /**
     * Get all pendaftaran sertifikasi with pagination
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator;

    /**
     * Get pendaftaran sertifikasi by user ID
     */
    public function getByUserId(int $userId): Collection;

    /**
     * Get pendaftaran sertifikasi by sertifikasi ID
     */
    public function getBySertifikasiId(int $sertifikasiId): Collection;

    /**
     * Get pendaftaran sertifikasi by batch ID
     */
    public function getByBatchId(int $batchId): Collection;

    /**
     * Find pendaftaran sertifikasi by ID
     */
    public function findById(int $id): ?PendaftaranSertifikasi;

    /**
     * Create new pendaftaran sertifikasi
     */
    public function create(array $data): PendaftaranSertifikasi;

    /**
     * Update pendaftaran sertifikasi
     */
    public function update(int $id, array $data): bool;

    /**
     * Delete pendaftaran sertifikasi
     */
    public function delete(int $id): bool;

    /**
     * Get pendaftaran with relations
     */
    public function getWithRelations(int $id): ?PendaftaranSertifikasi;

    /**
     * Check if user already registered for specific sertifikasi and batch
     */
    public function isUserAlreadyRegistered(int $userId, int $sertifikasiId, int $batchId): bool;

    /**
     * Get pendaftaran by status
     */
    public function getByStatus(string $status): Collection;

    /**
     * Update status
     */
    public function updateStatus(int $id, string $status, ?string $catatanAdmin = null): bool;
}