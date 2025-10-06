<?php

namespace App\Repositories;

use App\Models\Video;
use App\Repositories\Contracts\VideoRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class VideoRepository implements VideoRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = Video::query();
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('nama_video', 'like', "%$search%")
                  ->orWhere('deskripsi', 'like', "%$search%")
                  ->orWhere('uploader', 'like', "%$search%");
            });
        }
        if (!empty($filters['status'])) { $query->where('status', $filters['status']); }
        if (isset($filters['featured'])) { $query->where('featured', (bool)$filters['featured']); }
        if (!empty($filters['exclude_id'])) { $query->where('id', '!=', $filters['exclude_id']); }
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortBy, $sortDirection);
        return $query->paginate($perPage);
    }

    public function find(int $id): Video
    {
        return Video::findOrFail($id);
    }

    public function findBySlug(string $slug): ?Video
    {
        return Video::where('slug', $slug)->first();
    }

    public function create(array $data): Video
    {
        if (isset($data['thumbnail']) && $data['thumbnail']) {
            $data['thumbnail'] = $data['thumbnail']->store('video/thumbnails', 'public');
        }
        $data['featured'] = !empty($data['featured']);
        $data['views'] = $data['views'] ?? 0;
        return Video::create($data);
    }

    public function update(Video $video, array $data): Video
    {
        if (isset($data['thumbnail']) && $data['thumbnail']) {
            if ($video->thumbnail) { Storage::disk('public')->delete($video->thumbnail); }
            $data['thumbnail'] = $data['thumbnail']->store('video/thumbnails', 'public');
        }
        if (isset($data['featured'])) { $data['featured'] = (bool)$data['featured']; }
        $video->update($data);
        return $video;
    }

    public function delete(Video $video): void
    {
        if ($video->thumbnail) { Storage::disk('public')->delete($video->thumbnail); }
        $video->delete();
    }

    public function count(): int
    {
        return Video::count();
    }

    public function countByStatus(string $status): int
    {
        return Video::where('status', $status)->count();
    }
}
