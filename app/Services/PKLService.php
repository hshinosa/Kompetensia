<?php

namespace App\Services;

use App\Repositories\Contracts\PKLRepositoryInterface;
use App\Models\PosisiPKL;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PKLService
{
    public function __construct(private readonly PKLRepositoryInterface $repo) {}

    public function list(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        return $this->repo->paginate($filters, $perPage);
    }

    public function detail(int $id): PosisiPKL
    {
        return $this->repo->find($id);
    }

    public function create(array $data): PosisiPKL
    {
        return $this->repo->create($data);
    }

    public function update(PosisiPKL $posisiPkl, array $data): PosisiPKL
    {
        return $this->repo->update($posisiPkl, $data);
    }

    public function delete(PosisiPKL $posisiPkl): void
    {
        $this->repo->delete($posisiPkl);
    }
}
