<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Asesor;
use App\Http\Requests\Admin\StoreAsesorRequest;
use App\Http\Requests\Admin\UpdateAsesorRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;

class AsesorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Asesor::with(['creator', 'updater']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama_asesor', 'like', '%' . $search . '%')
                  ->orWhere('jabatan_asesor', 'like', '%' . $search . '%')
                  ->orWhere('instansi_asesor', 'like', '%' . $search . '%');
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 5);
        $asesors = $query->latest()->paginate($perPage)->appends($request->query());

        // Transform data untuk frontend
        $asesors->through(function ($asesor) {
            return [
                'id' => $asesor->id,
                'nama_asesor' => $asesor->nama_asesor,
                'jabatan_asesor' => $asesor->jabatan_asesor,
                'instansi_asesor' => $asesor->instansi_asesor,
                'foto_asesor_url' => $asesor->foto_asesor_url,
                'status' => $asesor->status,
                'created_at' => $asesor->created_at->format('d/m/Y'),
                'sertifikasi_count' => $asesor->sertifikasi()->count()
            ];
        });

        return Inertia::render('admin/asesor/index', [
            'asesors' => $asesors,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/asesor/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAsesorRequest $request)
    {
        $validatedData = $request->validated();

        // Handle foto upload
        if ($request->hasFile('foto_asesor')) {
            $file = $request->file('foto_asesor');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('asesor', $filename, 'public');
            $validatedData['foto_asesor'] = $path;
        }

        $validatedData['created_by'] = auth()->id();

        $asesor = Asesor::create($validatedData);

        return redirect()
            ->route('admin.asesor.show', $asesor)
            ->with('success', 'Asesor berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Asesor $asesor)
    {
        $asesor->load(['sertifikasi', 'creator', 'updater']);
        
        // Transform data untuk frontend
        $asesorData = [
            'id' => $asesor->id,
            'nama_asesor' => $asesor->nama_asesor,
            'jabatan_asesor' => $asesor->jabatan_asesor,
            'instansi_asesor' => $asesor->instansi_asesor,
            'foto_asesor_url' => $asesor->foto_asesor_url,
            'status' => $asesor->status,
            'created_at' => $asesor->created_at->format('d/m/Y H:i'),
            'updated_at' => $asesor->updated_at->format('d/m/Y H:i'),
            'creator' => $asesor->creator ? $asesor->creator->name : null,
            'updater' => $asesor->updater ? $asesor->updater->name : null,
            'sertifikasi_count' => $asesor->sertifikasi->count(),
            'sertifikasi' => $asesor->sertifikasi->map(function($s) {
                return [
                    'id' => $s->id,
                    'nama_sertifikasi' => $s->nama_sertifikasi,
                    'jenis_sertifikasi' => $s->jenis_sertifikasi,
                    'status' => $s->status,
                    'created_at' => $s->created_at->format('d/m/Y')
                ];
            })
        ];
        
        return Inertia::render('admin/asesor/show', [
            'asesor' => $asesorData
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Asesor $asesor)
    {
        return Inertia::render('admin/asesor/edit', [
            'asesor' => $asesor
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAsesorRequest $request, Asesor $asesor)
    {
        $validated = $request->validated();

        if ($request->hasFile('foto_asesor')) {
            // Delete old photo if exists
            if ($asesor->foto_asesor) {
                \Storage::disk('public')->delete($asesor->foto_asesor);
            }
            $validated['foto_asesor'] = $request->file('foto_asesor')->store('asesor', 'public');
        }

        $validated['updated_by'] = auth()->id();

        $asesor->update($validated);

        return redirect()->route('admin.asesor.index')
            ->with('success', 'Asesor berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Asesor $asesor)
    {
        // Check if asesor has sertifikasi
        if ($asesor->sertifikasi()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Tidak dapat menghapus asesor yang masih memiliki sertifikasi');
        }

        // Delete photo if exists
        if ($asesor->foto_asesor) {
            \Storage::disk('public')->delete($asesor->foto_asesor);
        }

        $asesor->delete();

        return redirect()->route('admin.asesor.index')
            ->with('success', 'Asesor berhasil dihapus');
    }

    /**
     * API endpoint untuk search asesor (autocomplete)
     */
    public function search(Request $request): JsonResponse
    {
        $query = Asesor::where('status', 'Aktif');

        if ($request->has('q')) {
            $search = $request->q;
            $query->where(function($q) use ($search) {
                $q->where('nama_asesor', 'like', '%' . $search . '%')
                  ->orWhere('jabatan_asesor', 'like', '%' . $search . '%')
                  ->orWhere('instansi_asesor', 'like', '%' . $search . '%');
            });
        }

        $asesors = $query->select('id', 'nama_asesor', 'jabatan_asesor', 'instansi_asesor', 'foto_asesor')
            ->limit(10)
            ->get()
            ->map(function($asesor) {
                return [
                    'id' => $asesor->id,
                    'name' => $asesor->nama_asesor,
                    'label' => $asesor->nama_asesor . ' - ' . $asesor->jabatan_asesor . ' (' . $asesor->instansi_asesor . ')',
                    'jabatan' => $asesor->jabatan_asesor,
                    'instansi' => $asesor->instansi_asesor,
                    'foto_asesor_url' => $asesor->foto_asesor ? asset('storage/' . $asesor->foto_asesor) : null
                ];
            });

        return response()->json($asesors);
    }
}
