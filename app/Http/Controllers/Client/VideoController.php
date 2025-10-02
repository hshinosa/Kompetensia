<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Services\VideoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VideoController extends Controller
{
    protected $videoService;

    public function __construct(VideoService $videoService)
    {
        $this->videoService = $videoService;
    }

    /**
     * Display a listing of published videos for the client.
     */
    public function index(): Response
    {
        try {
            // Get published videos with pagination
            $videosPaginated = $this->videoService->list(['status' => 'Publish'], 8);
            
            // Get featured videos
            $featured = $this->videoService->list(['status' => 'Publish', 'featured' => true], 3);
            
            return Inertia::render('client/video/Index', [
                'videos' => [
                    'data' => $videosPaginated->items(),
                    'links' => $videosPaginated->linkCollection()->toArray(),
                    'meta' => [
                        'current_page' => $videosPaginated->currentPage(),
                        'from' => $videosPaginated->firstItem(),
                        'last_page' => $videosPaginated->lastPage(),
                        'per_page' => $videosPaginated->perPage(),
                        'to' => $videosPaginated->lastItem(),
                        'total' => $videosPaginated->total(),
                    ]
                ],
                'featured' => $featured->items()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading videos: ' . $e->getMessage());
            return Inertia::render('client/video/Index', [
                'videos' => [
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
     * Show the specified video.
     */
    public function show(string $slug): Response
    {
        try {
            $video = $this->videoService->getBySlug($slug);
            
            if (!$video || $video->status !== 'Publish') {
                abort(404);
            }
            
            // Increment views
            $video->increment('views');
            
            // Get related videos
            $relatedVideos = $this->videoService->list([
                'status' => 'Publish',
                'exclude_id' => $video->id
            ], 4);
            
            return Inertia::render('client/video/Show', [
                'video' => $video,
                'relatedVideos' => $relatedVideos->items()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading video: ' . $e->getMessage());
            abort(404);
        }
    }
}