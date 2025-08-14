<?php

namespace App\Repositories;

use App\Models\PKL;
use App\Repositories\Contracts\PKLRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PKLRepository implements PKLRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = PKL::withCount('pendaftaran');
        if (!empty($filters['search'])) { $query->where('nama_program', 'like', '%'.$filters['search'].'%'); }
        if (!empty($filters['status'])) { $query->where('status', $filters['status']); }
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortBy, $sortDirection);
        return $query->paginate($perPage);
    }

    public function find(int $id): PKL
    {
        return PKL::findOrFail($id);
    }

    public function create(array $data): PKL
    {
        $data['peserta_terdaftar'] = $data['peserta_terdaftar'] ?? 0;
        return PKL::create($data);
    }

    public function update(PKL $pkl, array $data): PKL
    {
        $pkl->update($data);
        return $pkl;
    }

    public function delete(PKL $pkl): void
    {
        $pkl->delete();
    }
}
