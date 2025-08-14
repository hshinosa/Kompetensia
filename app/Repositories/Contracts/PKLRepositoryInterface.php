<?php

namespace App\Repositories\Contracts;

use App\Models\PKL;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PKLRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator;
    public function find(int $id): PKL;
    public function create(array $data): PKL;
    public function update(PKL $pkl, array $data): PKL;
    public function delete(PKL $pkl): void;
}
