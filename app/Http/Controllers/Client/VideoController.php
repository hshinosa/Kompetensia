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
            $videosPaginated = $this->videoService->list(['status' => 'Publish'], 12);
            
            // Get featured videos
            $featured = $this->videoService->list(['status' => 'Publish', 'featured' => true], 3);
            
            return Inertia::render('client/video/Index', [
                'videos' => $videosPaginated,
                'featured' => $featured->items()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading videos: ' . $e->getMessage());
            return Inertia::render('client/video/Index', [
                'videos' => collect([]),
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