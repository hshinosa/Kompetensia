<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Services\BlogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArtikelController extends Controller
{
    protected $blogService;

    public function __construct(BlogService $blogService)
    {
        $this->blogService = $blogService;
    }

    /**
     * Display a listing of published articles for the client.
     */
    public function index(): Response
    {
        try {
            // Get published blogs with pagination
            $blogsPaginated = $this->blogService->list(['status' => 'Publish'], 12);
            
            // Get featured articles
            $featured = $this->blogService->list(['status' => 'Publish', 'featured' => true], 3);
            
            return Inertia::render('client/artikel/Index', [
                'articles' => $blogsPaginated,
                'featured' => $featured->items()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading articles: ' . $e->getMessage());
            return Inertia::render('client/artikel/Index', [
                'articles' => collect([]),
                'featured' => []
            ]);
        }
    }

    /**
     * Show the specified article.
     */
    public function show(string $slug): Response
    {
        try {
            $blog = $this->blogService->getBySlug($slug);
            
            if (!$blog || $blog->status !== 'Publish') {
                abort(404);
            }
            
            // Increment views
            $blog->increment('views');
            
            // Get related articles
            $relatedArticles = $this->blogService->list([
                'status' => 'Publish',
                'jenis_konten' => $blog->jenis_konten,
                'exclude_id' => $blog->id
            ], 4);
            
            return Inertia::render('client/artikel/Show', [
                'article' => $blog,
                'relatedArticles' => $relatedArticles->items()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading article: ' . $e->getMessage());
            abort(404);
        }
    }
}