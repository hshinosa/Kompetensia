<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\StoreSertifikasiRequest;
use App\Http\Requests\Admin\UpdateSertifikasiRequest;
use App\Models\Sertifikasi;
use App\Services\SertifikasiService;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SertifikasiController extends Controller
{
    public function __construct(private readonly SertifikasiService $service) {}

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->get('search'),
            'jenis' => $request->get('jenis'),
            'status' => $request->get('status')
        ];
        $sertifikasi = $this->service->list($filters, 10);
        return Inertia::render('Admin/Sertifikasi/Index', [
            'filters' => $filters,
            'sertifikasi' => $sertifikasi
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Sertifikasi/Create');
    }

    public function store(StoreSertifikasiRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());
        return redirect()->route('admin.sertifikasi.index')->with('success', 'Sertifikasi berhasil dibuat');
    }

    public function show(int $id)
    {
        $sertifikasi = $this->service->detail($id);
        return Inertia::render('Admin/Sertifikasi/Show', [
            'sertifikasi' => $sertifikasi
        ]);
    }

    public function edit(Sertifikasi $sertifikasi)
    {
        $detail = $this->service->detail($sertifikasi->id);
        return Inertia::render('Admin/Sertifikasi/Edit', [
            'sertifikasi' => $detail
        ]);
    }

    public function update(UpdateSertifikasiRequest $request, Sertifikasi $sertifikasi): RedirectResponse
    {
        $this->service->update($sertifikasi, $request->validated());
        return redirect()->route('admin.sertifikasi.index')->with('success', 'Sertifikasi diperbarui');
    }

    public function destroy(Sertifikasi $sertifikasi): RedirectResponse
    {
        $this->service->delete($sertifikasi);
        return redirect()->route('admin.sertifikasi.index')->with('success', 'Sertifikasi dihapus');
    }
}
