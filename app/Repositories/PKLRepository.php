<?php

namespace App\Repositories;

use App\Models\PosisiPKL;
use App\Repositories\Contracts\PKLRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PKLRepository implements PKLRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = PosisiPKL::query();
        if (!empty($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('nama_posisi', 'like', '%'.$filters['search'].'%')
                  ->orWhere('kategori', 'like', '%'.$filters['search'].'%');
            });
        }
        if (!empty($filters['status'])) { $query->where('status', $filters['status']); }
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortBy, $sortDirection);
        return $query->paginate($perPage);
    }

    public function find(int $id): PosisiPKL
    {
        return PosisiPKL::findOrFail($id);
    }

    public function create(array $data): PosisiPKL
    {
        $data['jumlah_pendaftar'] = $data['jumlah_pendaftar'] ?? 10;
        return PosisiPKL::create($data);
    }

    public function update(PosisiPKL $posisiPkl, array $data): PosisiPKL
    {
        $posisiPkl->update($data);
        return $posisiPkl;
    }

    public function delete(PosisiPKL $posisiPkl): void
    {
        $posisiPkl->delete();
    }
}
