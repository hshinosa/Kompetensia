<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreVideoRequest;
use App\Http\Requests\Admin\UpdateVideoRequest;
use App\Services\VideoService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    /**
     * @param VideoService $service
     * Constructor to inject VideoService
     */
    public function __construct(private readonly VideoService $service) {}

    /**
     * Display a listing of videos with filters and pagination
     */
    public function index(Request $request)
    {
    // Collect filters and pagination parameters
    $filters = $request->only(['search','status','featured','sort_by','sort_direction']);
    $perPage = (int)($request->get('per_page') ?? 10);
    $filters['per_page'] = $perPage;
    $videos = $this->service->list($filters, $perPage);
        return Inertia::render('admin/manajemen-video', ['videos' => $videos, 'filters' => $filters]);
    }

    /**
     * Show the form for creating a new video
     */
    public function create()
    {
        return Inertia::render('admin/form-video');
    }

    /**
     * Store a newly created video in storage
     * @param  \App\Http\Requests\Admin\StoreVideoRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     * @return \Illuminate\Http\Response
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreVideoRequest $request)
    {
    $data = $request->validated();
    // Automatically set uploader to authenticated user's name
    $data['uploader'] = auth()->user()->name;
        if ($request->hasFile('thumbnail')) { $data['thumbnail'] = $request->file('thumbnail'); }
        $data['views'] = 0;
        $this->service->create($data);
        return redirect()->route('admin.manajemen-video')->with('success', 'Video berhasil dibuat');
    }

    public function show($id)
    {
        return response()->json($this->service->detail($id));
    }

    public function edit($id)
    {
        $video = $this->service->detail($id);
        return Inertia::render('admin/form-video', ['video' => $video, 'isEdit' => true]);
    }

    public function update(UpdateVideoRequest $request, $id)
    {
        $video = $this->service->detail($id);
    $data = $request->validated();
    // Automatically update uploader to authenticated user's name
    $data['uploader'] = auth()->user()->name;
        if ($request->hasFile('thumbnail')) { $data['thumbnail'] = $request->file('thumbnail'); }
        $this->service->update($video, $data);
        return redirect()->route('admin.manajemen-video')->with('success', 'Video berhasil diperbarui');
    }

    public function destroy($id)
    {
        $video = $this->service->detail($id);
        $this->service->delete($video);
        return redirect()->route('admin.manajemen-video')->with('success', 'Video berhasil dihapus');
    }

    public function apiIndex(Request $request)
    {
        $filters = $request->only(['search','status','featured','sort_by','sort_direction','per_page']);
        $perPage = (int)($filters['per_page'] ?? 10);
        $videos = $this->service->list($filters, $perPage);
        return response()->json($videos);
    }

    public function apiStore(StoreVideoRequest $request)
    {
        $data = $request->validated();
        $data['views'] = 0;
        $video = $this->service->create($data);
        return response()->json(['message' => 'Video berhasil dibuat', 'data' => $video], 201);
    }

    public function apiUpdate(UpdateVideoRequest $request, $id)
    {
        $video = $this->service->detail($id);
        $data = $request->validated();
        $video = $this->service->update($video, $data);
        return response()->json(['message' => 'Video berhasil diperbarui', 'data' => $video]);
    }

    public function apiDestroy($id)
    {
        $video = $this->service->detail($id);
        $this->service->delete($video);
        return response()->json(['message' => 'Video berhasil dihapus']);
    }
}
