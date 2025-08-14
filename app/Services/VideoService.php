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
}
