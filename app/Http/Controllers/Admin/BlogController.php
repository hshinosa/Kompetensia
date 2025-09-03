<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBlogRequest;
use App\Http\Requests\Admin\UpdateBlogRequest;
use App\Services\BlogService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    private const MSG_CREATED = 'Artikel berhasil dibuat';
    private const MSG_UPDATED = 'Artikel berhasil diperbarui';
    private const MSG_DELETED = 'Artikel berhasil dihapus';
    public function __construct(private readonly BlogService $service) {}

    public function index(Request $request)
    {
    // Collect filters and pagination parameters
    $filters = $request->only(['search','jenis_konten','status','featured','sort_by','sort_direction']);
    $perPage = (int)($request->get('per_page') ?? 10);
    $filters['per_page'] = $perPage;
    $blogs = $this->service->list($filters, $perPage);
        return Inertia::render('admin/manajemen-blog', ['blogs' => $blogs, 'filters' => $filters]);
    }

    public function create()
    {
        return Inertia::render('admin/form-blog');
    }

    public function store(StoreBlogRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('thumbnail')) { $data['thumbnail'] = $request->file('thumbnail'); }
        $blog = $this->service->create($data);
        if ($request->wantsJson()) {
            return response()->json(['message' => self::MSG_CREATED, 'data' => $blog], 201);
        }
        return redirect()->route('admin.manajemen-blog')->with('success', self::MSG_CREATED);
    }

    public function show($id)
    {
        return response()->json($this->service->detail($id));
    }

    public function edit($id)
    {
        $blog = $this->service->detail($id);
        return Inertia::render('admin/form-blog', ['blog' => $blog, 'isEdit' => true]);
    }

    public function update(UpdateBlogRequest $request, $id)
    {
        $blog = $this->service->detail($id);
        $data = $request->validated();
        if ($request->hasFile('thumbnail')) { $data['thumbnail'] = $request->file('thumbnail'); }
        $blog = $this->service->update($blog, $data);
        if ($request->wantsJson()) {
            return response()->json(['message' => self::MSG_UPDATED, 'data' => $blog]);
        }
        return redirect()->route('admin.manajemen-blog')->with('success', self::MSG_UPDATED);
    }

    public function destroy($id)
    {
        $blog = $this->service->detail($id);
        $this->service->delete($blog);
        if (request()->wantsJson()) {
            return response()->json(['message' => self::MSG_DELETED]);
        }
        return redirect()->route('admin.manajemen-blog')->with('success', self::MSG_DELETED);
    }

    public function apiIndex(Request $request)
    {
        $filters = $request->only(['search','jenis_konten','status','featured','sort_by','sort_direction','per_page']);
        $perPage = (int)($filters['per_page'] ?? 10);
        $blogs = $this->service->list($filters, $perPage);
        return response()->json($blogs);
    }

    public function apiStore(StoreBlogRequest $request)
    {
        $data = $request->validated();
        $blog = $this->service->create($data);
        return response()->json(['message' => 'Artikel berhasil dibuat', 'data' => $blog], 201);
    }

    public function apiUpdate(UpdateBlogRequest $request, $id)
    {
        $blog = $this->service->detail($id);
        $data = $request->validated();
        $blog = $this->service->update($blog, $data);
        return response()->json(['message' => 'Artikel berhasil diperbarui', 'data' => $blog]);
    }

    public function apiDestroy($id)
    {
        $blog = $this->service->detail($id);
        $this->service->delete($blog);
        return response()->json(['message' => 'Artikel berhasil dihapus']);
    }
}
