<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sertifikasi;
use App\Models\ModulSertifikasi;
use App\Models\BatchSertifikasi;
use App\Http\Requests\Admin\StoreSertifikasiRequest;
use App\Http\Requests\Admin\UpdateSertifikasiRequest;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

class SertifikasiController extends Controller
{
    private function storeSertifikasiFile(UploadedFile $file, string $slug, string $baseName): string
    {
        $ext = $file->getClientOriginalExtension() ?: $file->guessExtension() ?: 'jpg';
        $directory = "sertifikasi/{$slug}";
        // storeAs will create directory if missing
        $file->storeAs($directory, $baseName.'.'.$ext, 'public');
        return $directory.'/'.$baseName.'.'.$ext;
    }
    public function index(\Illuminate\Http\Request $request)
    {
        $perPage = $request->integer('per_page', 10);
        $query = Sertifikasi::query();
        
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search){
                $q->where('nama_sertifikasi','like','%'.$search.'%')
                  ->orWhere('nama_asesor','like','%'.$search.'%');
            });
        }
        if ($request->filled('jenis')) { $query->where('jenis_sertifikasi', $request->get('jenis')); }
        if ($request->filled('status')) { $query->where('status', $request->get('status')); }
        
        $sertifikasi = $query->latest()->paginate($perPage)->appends($request->all())
            ->through(function ($s) {
                return [
                    'id' => $s->id,
                    'namaSertifikasi' => $s->nama_sertifikasi,
                    'jenisSertifikasi' => $s->jenis_sertifikasi,
                    'status' => $s->status === 'Aktif' ? 'Aktif' : 'Draf',
                    'thumbnail' => $s->thumbnail_url,
                    'assessor' => $s->nama_asesor,
                    'tipe_sertifikat' => is_string($s->tipe_sertifikat) ? $s->tipe_sertifikat : 'Sertifikat Kompetensi',
                    'totalBatch' => 0, // Sementara hardcode 0
                    'jadwalSertifikasi' => 'Belum dijadwalkan', // Sementara hardcode
                ];
            });
            
        return Inertia::render('admin/sertifikasi-kompetensi', [
            'sertifikasi' => $sertifikasi,
            'filters' => [
                'search' => $request->get('search'),
                'jenis' => $request->get('jenis'),
                'status' => $request->get('status'),
                'per_page' => $perPage,
            ],
        ]);
    }

    public function show($id)
    {
        // Correct eager loading: cannot reference scope in relation name
        $sertifikasi = Sertifikasi::with([
            'modul' => function($q){ $q->ordered(); },
            'batch'
        ])->findOrFail($id);

        // Transform to rich detail structure similar to chlorine-portal design
        $detail = [
            'id' => $sertifikasi->id,
            'nama_sertifikasi' => $sertifikasi->nama_sertifikasi,
            'jenis_sertifikasi' => $sertifikasi->jenis_sertifikasi,
            'deskripsi' => $sertifikasi->deskripsi,
            'nama_asesor' => $sertifikasi->nama_asesor,
            'jabatan_asesor' => $sertifikasi->jabatan_asesor,
            'instansi_asesor' => $sertifikasi->instansi_asesor,
            'tipe_sertifikat' => $sertifikasi->tipe_sertifikat,
            'thumbnail_url' => $sertifikasi->thumbnail_url,
            'foto_asesor_url' => $sertifikasi->foto_asesor_url,
            'modul' => $sertifikasi->modul->map(function($m){
                return [
                    'id' => $m->id,
                    'judul' => $m->judul,
                    'deskripsi' => $m->deskripsi,
                    'poin_pembelajaran' => $m->poin_pembelajaran ?? []
                ];
            })->values(),
            'batch' => $sertifikasi->batch->map(function($b){
                return [
                    'id' => $b->id,
                    'nama_batch' => $b->nama_batch,
                    'tanggal_mulai' => optional($b->tanggal_mulai)->format('Y-m-d'),
                    'tanggal_selesai' => optional($b->tanggal_selesai)->format('Y-m-d'),
                    'status' => $b->status,
                    'jumlah_pendaftar' => $b->jumlah_pendaftar,
                ];
            })->values(),
            'created_at' => optional($sertifikasi->created_at)->toDateString(),
            'updated_at' => optional($sertifikasi->updated_at)->toDateString(),
            'status' => $sertifikasi->status,
        ];
        return Inertia::render('admin/detail-sertifikasi', ['sertifikasi' => $detail]);
    }

    public function create()
    {
        return Inertia::render('admin/form-sertifikasi');
    }

    public function store(StoreSertifikasiRequest $request)
    {
        $validated = $request->validated();
        $slug = Str::slug($validated['nama_sertifikasi']);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $this->storeSertifikasiFile($request->file('thumbnail'), $slug, 'thumbnail');
        }
        if ($request->hasFile('foto_asesor')) {
            $validated['foto_asesor'] = $this->storeSertifikasiFile($request->file('foto_asesor'), $slug, 'foto-asesor');
        }
        $validated['created_by'] = auth()->id();
        $validated['status'] = 'Aktif';
        $sertifikasi = Sertifikasi::create($validated);

        foreach ($validated['modul'] as $index => $modulData) {
            $sertifikasi->modul()->create([
                'judul' => $modulData['judul'],
                'deskripsi' => $modulData['deskripsi'],
                'poin_pembelajaran' => $modulData['poin_pembelajaran'] ?? [],
                'urutan' => $index
            ]);
        }
        foreach ($validated['batch'] as $batchData) {
            $sertifikasi->batch()->create([
                'nama_batch' => $batchData['nama_batch'],
                'tanggal_mulai' => $batchData['tanggal_mulai'],
                'tanggal_selesai' => $batchData['tanggal_selesai'],
                'status' => $batchData['status'] ?? 'Draf',
                // kuota dihapus dari requirement
                'jumlah_pendaftar' => $batchData['jumlah_pendaftar'] ?? 0,
            ]);
        }
        return redirect()->route('admin.sertifikasi-kompetensi')->with('success', 'Sertifikasi berhasil dibuat');
    }

    public function edit($id)
    {
        $sertifikasi = Sertifikasi::with([
            'modul' => function($q){ $q->ordered(); },
            'batch'
        ])->findOrFail($id);

        // Adapt data shape for the React form (expects modul.order aliasing urutan)
        $formData = [
            'id' => $sertifikasi->id,
            'nama_sertifikasi' => $sertifikasi->nama_sertifikasi,
            'jenis_sertifikasi' => $sertifikasi->jenis_sertifikasi,
            'deskripsi' => $sertifikasi->deskripsi,
            'nama_asesor' => $sertifikasi->nama_asesor,
            'jabatan_asesor' => $sertifikasi->jabatan_asesor,
            'instansi_asesor' => $sertifikasi->instansi_asesor,
            'pengalaman_asesor' => $sertifikasi->pengalaman_asesor,
            'tipe_sertifikat' => $sertifikasi->tipe_sertifikat,
            'thumbnail_url' => $sertifikasi->thumbnail_url,
            'foto_asesor_url' => $sertifikasi->foto_asesor_url,
            'modul' => $sertifikasi->modul->map(function($m){
                return [
                    'id' => $m->id,
                    'judul' => $m->judul,
                    'deskripsi' => $m->deskripsi,
                    'order' => $m->urutan,
                ];
            })->values(),
            'batch' => $sertifikasi->batch->map(function($b){
                return [
                    'id' => $b->id,
                    'nama_batch' => $b->nama_batch,
                    'tanggal_mulai' => optional($b->tanggal_mulai)->format('Y-m-d'),
                    'tanggal_selesai' => optional($b->tanggal_selesai)->format('Y-m-d'),
                    'status' => $b->status,
                ];
            })->values(),
        ];
        return Inertia::render('admin/form-sertifikasi', ['sertifikasi' => $formData, 'isEdit' => true]);
    }

    public function update(UpdateSertifikasiRequest $request, $id)
    {
        $sertifikasi = Sertifikasi::findOrFail($id);
        $validated = $request->validated();
        $slug = Str::slug($validated['nama_sertifikasi']);
        if ($request->hasFile('thumbnail')) {
            if ($sertifikasi->thumbnail) { Storage::disk('public')->delete($sertifikasi->thumbnail); }
            $validated['thumbnail'] = $this->storeSertifikasiFile($request->file('thumbnail'), $slug, 'thumbnail');
        }
        if ($request->hasFile('foto_asesor')) {
            if ($sertifikasi->foto_asesor) { Storage::disk('public')->delete($sertifikasi->foto_asesor); }
            $validated['foto_asesor'] = $this->storeSertifikasiFile($request->file('foto_asesor'), $slug, 'foto-asesor');
        }
        $validated['updated_by'] = auth()->id();
        $sertifikasi->update($validated);
        $sertifikasi->modul()->delete();
        foreach ($validated['modul'] as $index => $modulData) {
            $sertifikasi->modul()->create([
                'judul' => $modulData['judul'],
                'deskripsi' => $modulData['deskripsi'],
                'poin_pembelajaran' => $modulData['poin_pembelajaran'] ?? [],
                'urutan' => $index
            ]);
        }
        $sertifikasi->batch()->delete();
        foreach ($validated['batch'] as $batchData) {
            $sertifikasi->batch()->create([
                'nama_batch' => $batchData['nama_batch'],
                'tanggal_mulai' => $batchData['tanggal_mulai'],
                'tanggal_selesai' => $batchData['tanggal_selesai'],
                'status' => $batchData['status'] ?? 'Draf',
                'jumlah_pendaftar' => $batchData['jumlah_pendaftar'] ?? 0,
            ]);
        }
        return redirect()->route('admin.sertifikasi-kompetensi')->with('success', 'Sertifikasi berhasil diperbarui');
    }

    public function destroy($id)
    {
        $sertifikasi = Sertifikasi::findOrFail($id);
        if ($sertifikasi->thumbnail) { Storage::disk('public')->delete($sertifikasi->thumbnail); }
        if ($sertifikasi->foto_asesor) { Storage::disk('public')->delete($sertifikasi->foto_asesor); }
        $sertifikasi->delete();
        return redirect()->route('admin.sertifikasi-kompetensi')->with('success', 'Sertifikasi berhasil dihapus');
    }

    public function apiIndex(Request $request)
    {
        $query = Sertifikasi::with(['modul', 'batch']);
        if ($request->has('search')) { $query->where('nama_sertifikasi', 'like', '%' . $request->search . '%'); }
        if ($request->has('jenis')) { $query->where('jenis_sertifikasi', $request->jenis); }
        if ($request->has('status')) { $query->where('status', $request->status); }
        return response()->json($query->paginate($request->get('per_page', 10)));
    }

    public function apiShow($id)
    {
        $sertifikasi = Sertifikasi::with([
            'modul' => function($q){ $q->ordered(); },
            'batch'
        ])->findOrFail($id);
        return response()->json($sertifikasi);
    }
}
