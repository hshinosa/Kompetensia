<?php

namespace App\Services;

use App\Repositories\Contracts\PKLRepositoryInterface;
use App\Models\PKL;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PKLService
{
    public function __construct(private readonly PKLRepositoryInterface $repo) {}

    public function list(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        return $this->repo->paginate($filters, $perPage);
    }

    public function detail(int $id): PKL
    {
        return $this->repo->find($id);
    }

    public function create(array $data): PKL
    {
        return $this->repo->create($data);
    }

    public function update(PKL $pkl, array $data): PKL
    {
        return $this->repo->update($pkl, $data);
    }

    public function delete(PKL $pkl): void
    {
        $this->repo->delete($pkl);
    }
}
