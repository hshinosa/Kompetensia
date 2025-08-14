<?php

namespace App\Repositories;

use App\Models\Blog;
use App\Repositories\Contracts\BlogRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogRepository implements BlogRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = Blog::query();
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('nama_artikel', 'like', "%$search%")
                  ->orWhere('deskripsi', 'like', "%$search%")
                  ->orWhere('penulis', 'like', "%$search%");
            });
        }
        if (!empty($filters['jenis_konten'])) { $query->where('jenis_konten', $filters['jenis_konten']); }
        if (!empty($filters['status'])) { $query->where('status', $filters['status']); }
        if (isset($filters['featured'])) { $query->where('featured', (bool)$filters['featured']); }
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortBy, $sortDirection);
        return $query->paginate($perPage);
    }

    public function find(int $id): Blog
    {
        return Blog::findOrFail($id);
    }

    public function create(array $data): Blog
    {
        $data = $this->prepareSlug($data);
        if (isset($data['thumbnail']) && $data['thumbnail']) {
            $data['thumbnail'] = $data['thumbnail']->store('blog/thumbnails', 'public');
        }
        $data['featured'] = !empty($data['featured']);
        return Blog::create($data);
    }

    public function update(Blog $blog, array $data): Blog
    {
        $data = $this->prepareSlug($data, $blog);
        if (isset($data['thumbnail']) && $data['thumbnail']) {
            if ($blog->thumbnail) { Storage::disk('public')->delete($blog->thumbnail); }
            $data['thumbnail'] = $data['thumbnail']->store('blog/thumbnails', 'public');
        }
        if (isset($data['featured'])) { $data['featured'] = (bool)$data['featured']; }
        $blog->update($data);
        return $blog;
    }

    public function delete(Blog $blog): void
    {
        if ($blog->thumbnail) { Storage::disk('public')->delete($blog->thumbnail); }
        $blog->delete();
    }

    private function prepareSlug(array $data, ?Blog $existing = null): array
    {
        if (isset($data['nama_artikel'])) {
            $desired = Str::slug($data['nama_artikel']);
            $slug = $desired;
            $counter = 1;
            while (Blog::where('slug', $slug)->when($existing, fn($q) => $q->where('id', '!=', $existing->id))->exists()) {
                $slug = $desired.'-'.$counter++;
            }
            $data['slug'] = $slug;
        }
        return $data;
    }
}
