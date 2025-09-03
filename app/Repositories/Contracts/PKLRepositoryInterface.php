<?php

namespace App\Repositories\Contracts;

use App\Models\PosisiPKL;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PKLRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator;
    public function find(int $id): PosisiPKL;
    public function create(array $data): PosisiPKL;
    public function update(PosisiPKL $posisiPkl, array $data): PosisiPKL;
    public function delete(PosisiPKL $posisiPkl): void;
}
