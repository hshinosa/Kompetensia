<?php

namespace App\Services;

use App\Repositories\Contracts\VideoRepositoryInterface;
use App\Models\Video;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class VideoService
{
    public function __construct(private readonly VideoRepositoryInterface $repo) {}

    public function list(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        return $this->repo->paginate($filters, $perPage);
    }

    public function detail(int $id): Video
    {
        return $this->repo->find($id);
    }

    public function getBySlug(string $slug): ?Video
    {
        return $this->repo->findBySlug($slug);
    }

    public function create(array $data): Video
    {
        return $this->repo->create($data);
    }

    public function update(Video $video, array $data): Video
    {
        return $this->repo->update($video, $data);
    }

    public function delete(Video $video): void
    {
        $this->repo->delete($video);
    }

    /**
     * Get statistics for all videos (regardless of pagination)
     */
    public function getStats(): array
    {
        $total = $this->repo->count();
        $publishCount = $this->repo->countByStatus('Publish');
        $draftCount = $this->repo->countByStatus('Draft');

        return [
            'total' => $total,
            'publish' => $publishCount,
            'draft' => $draftCount,
        ];
    }
}
