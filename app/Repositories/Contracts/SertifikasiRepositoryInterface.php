<?php

namespace App\Repositories\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Sertifikasi;

interface SertifikasiRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator;
    public function findWithRelations(int $id): Sertifikasi;
    public function createWithRelations(array $data): Sertifikasi;
    public function updateWithRelations(Sertifikasi $sertifikasi, array $data): Sertifikasi;
    public function delete(Sertifikasi $sertifikasi): void;
}
