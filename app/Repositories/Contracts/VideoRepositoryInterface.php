<?php

namespace App\Repositories\Contracts;

use App\Models\Video;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface VideoRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator;
    public function find(int $id): Video;
    public function findBySlug(string $slug): ?Video;
    public function create(array $data): Video;
    public function update(Video $video, array $data): Video;
    public function delete(Video $video): void;
    public function count(): int;
    public function countByStatus(string $status): int;
}
