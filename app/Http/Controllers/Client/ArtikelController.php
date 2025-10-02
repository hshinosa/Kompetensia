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
    public function index(Request $request): Response
    {
        try {
            // Build filters
            $filters = ['status' => 'Publish'];
            if ($request->has('jenis_konten') && $request->jenis_konten !== 'Semua') {
                $filters['jenis_konten'] = $request->jenis_konten;
            }
            
            // Get published blogs with pagination
            $blogsPaginated = $this->blogService->list($filters, 8);
            
            // Get featured articles
            $featured = $this->blogService->list(['status' => 'Publish', 'featured' => true], 3);
            
            return Inertia::render('client/artikel/Index', [
                'articles' => [
                    'data' => $blogsPaginated->items(),
                    'links' => $blogsPaginated->linkCollection()->toArray(),
                    'meta' => [
                        'current_page' => $blogsPaginated->currentPage(),
                        'from' => $blogsPaginated->firstItem(),
                        'last_page' => $blogsPaginated->lastPage(),
                        'per_page' => $blogsPaginated->perPage(),
                        'to' => $blogsPaginated->lastItem(),
                        'total' => $blogsPaginated->total(),
                    ]
                ],
                'featured' => $featured->items(),
                'filters' => [
                    'jenis_konten' => $request->get('jenis_konten', 'Semua')
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading articles: ' . $e->getMessage());
            return Inertia::render('client/artikel/Index', [
                'articles' => [
                    'data' => [],
                    'links' => [],
                    'meta' => [
                        'current_page' => 1,
                        'from' => null,
                        'last_page' => 1,
                        'per_page' => 8,
                        'to' => null,
                        'total' => 0,
                    ]
                ],
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