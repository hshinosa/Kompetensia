<?php

namespace App\Services;

use App\Repositories\Contracts\SertifikasiRepositoryInterface;
use App\Models\Sertifikasi;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class SertifikasiService
{
    public function __construct(private readonly SertifikasiRepositoryInterface $repo) {}

    public function list(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        return $this->repo->paginate($filters, $perPage);
    }

    public function detail(int $id): Sertifikasi
    {
        return $this->repo->findWithRelations($id);
    }

    public function create(array $data): Sertifikasi
    {
        return DB::transaction(fn () => $this->repo->createWithRelations($data));
    }

    public function update(Sertifikasi $sertifikasi, array $data): Sertifikasi
    {
        return DB::transaction(fn () => $this->repo->updateWithRelations($sertifikasi, $data));
    }

    public function delete(Sertifikasi $sertifikasi): void
    {
        DB::transaction(fn () => $this->repo->delete($sertifikasi));
    }
}
