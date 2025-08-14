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
    public function __construct(private readonly VideoService $service) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search','status','featured','sort_by','sort_direction']);
        $videos = $this->service->list($filters, 10);
        return Inertia::render('admin/manajemen-video', ['videos' => $videos, 'filters' => $filters]);
    }

    public function create()
    {
        return Inertia::render('admin/form-video');
    }

    public function store(StoreVideoRequest $request)
    {
        $data = $request->validated();
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
