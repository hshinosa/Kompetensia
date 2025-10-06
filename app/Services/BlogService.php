<?php

namespace App\Services;

use App\Repositories\Contracts\BlogRepositoryInterface;
use App\Models\Blog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BlogService
{
    public function __construct(private readonly BlogRepositoryInterface $repo) {}

    public function list(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        return $this->repo->paginate($filters, $perPage);
    }

    public function detail(int $id): Blog
    {
        return $this->repo->find($id);
    }

    public function getBySlug(string $slug): ?Blog
    {
        return $this->repo->findBySlug($slug);
    }

    public function create(array $data): Blog
    {
        return $this->repo->create($data);
    }

    public function update(Blog $blog, array $data): Blog
    {
        return $this->repo->update($blog, $data);
    }

    public function delete(Blog $blog): void
    {
        $this->repo->delete($blog);
    }

    /**
     * Get statistics for all blogs (regardless of pagination)
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
