<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sertifikasi;
use App\Models\Asesor;
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
        $query = Sertifikasi::with(['asesor', 'batch']);
        
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search){
                $q->where('nama_sertifikasi','like','%'.$search.'%')
                  ->orWhereHas('asesor', function($asesorQuery) use ($search) {
                      $asesorQuery->where('nama_asesor', 'like', '%'.$search.'%');
                  });
            });
        }
        if ($request->filled('jenis')) { $query->where('jenis_sertifikasi', $request->get('jenis')); }
        if ($request->filled('status')) { $query->where('status', $request->get('status')); }
        
        $sertifikasi = $query->latest()->paginate($perPage)->appends($request->all())
            ->through(function ($s) {
                // Hitung total batch aktif
                $totalBatch = $s->batch->where('status', 'Aktif')->count();
                
                // Format tipe sertifikat yang benar
                $tipeSertifikat = [];
                if (is_array($s->tipe_sertifikat)) {
                    $tipeSertifikat = $s->tipe_sertifikat;
                } elseif (is_string($s->tipe_sertifikat) && !empty($s->tipe_sertifikat)) {
                    // Coba parse JSON jika string
                    $decoded = json_decode($s->tipe_sertifikat, true);
                    if (is_array($decoded)) {
                        $tipeSertifikat = $decoded;
                    } else {
                        $tipeSertifikat = [$s->tipe_sertifikat];
                    }
                }
                
                // Default tipe sertifikat jika kosong
                if (empty($tipeSertifikat)) {
                    $tipeSertifikat = ['Sertifikat Kompetensi'];
                }
                
                return [
                    'id' => $s->id,
                    'namaSertifikasi' => $s->nama_sertifikasi,
                    'jenisSertifikasi' => $s->jenis_sertifikasi,
                    'status' => $s->status === 'Aktif' ? 'Aktif' : 'Draf',
                    'thumbnail' => $s->thumbnail_url,
                    'assessor' => $s->asesor ? $s->asesor->nama_asesor : 'Belum dipilih',
                    'tipe_sertifikat' => is_array($tipeSertifikat) ? implode(', ', $tipeSertifikat) : implode(', ', ['Sertifikat Kompetensi']),
                    'totalBatch' => $totalBatch,
                    'jadwalSertifikasi' => $totalBatch > 0 ? "{$totalBatch} batch aktif" : 'Belum dijadwalkan',
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
        // Load sertifikasi with asesor relation
        $sertifikasi = Sertifikasi::with([
            'modul' => function($q){ $q->ordered(); },
            'batch',
            'asesor'
        ])->findOrFail($id);

        // Transform to rich detail structure similar to chlorine-portal design
        $detail = [
            'id' => $sertifikasi->id,
            'nama_sertifikasi' => $sertifikasi->nama_sertifikasi,
            'jenis_sertifikasi' => $sertifikasi->jenis_sertifikasi,
            'deskripsi' => $sertifikasi->deskripsi,
            'asesor' => $sertifikasi->asesor ? [
                'id' => $sertifikasi->asesor->id,
                'nama_asesor' => $sertifikasi->asesor->nama_asesor,
                'jabatan' => $sertifikasi->asesor->jabatan,
                'instansi' => $sertifikasi->asesor->instansi,
                'bio' => $sertifikasi->asesor->bio,
                'foto' => $sertifikasi->asesor->foto ? asset('storage/' . $sertifikasi->asesor->foto) : null,
            ] : null,
            'tipe_sertifikat' => $sertifikasi->tipe_sertifikat,
            'thumbnail_url' => $sertifikasi->thumbnail_url,
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
        // Pass active asesors for dropdown/autocomplete
        $asesors = Asesor::where('status', 'Aktif')
            ->select('id', 'nama_asesor', 'jabatan', 'instansi')
            ->get()
            ->map(function($asesor) {
                return [
                    'id' => $asesor->id,
                    'name' => $asesor->nama_asesor,
                    'label' => $asesor->nama_asesor . ' - ' . $asesor->jabatan . ' (' . $asesor->instansi . ')',
                    'jabatan' => $asesor->jabatan,
                    'instansi' => $asesor->instansi
                ];
            });

        return Inertia::render('admin/form-sertifikasi', [
            'asesors' => $asesors
        ]);
    }

    public function store(StoreSertifikasiRequest $request)
    {
        $validated = $request->validated();
        $slug = Str::slug($validated['nama_sertifikasi']);

        // Handle asesor - jika buat baru atau pilih existing
        if (!empty($validated['nama_asesor'])) {
            // Buat asesor baru
            $asesorData = [
                'nama_asesor' => $validated['nama_asesor'],
                'jabatan' => $validated['jabatan'] ?? '',
                'instansi' => $validated['instansi'] ?? '',
                'status' => 'Aktif'
            ];
            
            if ($request->hasFile('foto_asesor')) {
                $asesorData['foto'] = $this->storeSertifikasiFile($request->file('foto_asesor'), $slug, 'foto-asesor');
            }
            
            $asesor = \App\Models\Asesor::create($asesorData);
            $validated['asesor_id'] = $asesor->id;
        } elseif ($request->hasFile('foto_asesor') && $validated['asesor_id']) {
            // Update foto asesor yang sudah ada
            $asesor = \App\Models\Asesor::find($validated['asesor_id']);
            if ($asesor) {
                // Delete old photo if exists
                if ($asesor->foto_asesor && Storage::disk('public')->exists($asesor->foto_asesor)) {
                    Storage::disk('public')->delete($asesor->foto_asesor);
                }
                
                // Upload new photo
                $fotoPath = $this->storeSertifikasiFile($request->file('foto_asesor'), $slug, 'foto-asesor');
                $asesor->update(['foto_asesor' => $fotoPath]);
            }
        }

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $this->storeSertifikasiFile($request->file('thumbnail'), $slug, 'thumbnail');
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
                'jumlah_pendaftar' => $batchData['jumlah_pendaftar'] ?? 0,
            ]);
        }
        return redirect()->route('admin.sertifikasi-kompetensi')->with('success', 'Sertifikasi berhasil dibuat');
    }

    public function edit($id)
    {
        $sertifikasi = Sertifikasi::with([
            'modul' => function($q){ $q->ordered(); },
            'batch',
            'asesor'
        ])->findOrFail($id);

        // Pass active asesors for dropdown/autocomplete
        $asesors = Asesor::where('status', 'Aktif')
            ->select('id', 'nama_asesor', 'jabatan', 'instansi')
            ->get()
            ->map(function($asesor) {
                return [
                    'id' => $asesor->id,
                    'name' => $asesor->nama_asesor,
                    'label' => $asesor->nama_asesor . ' - ' . $asesor->jabatan . ' (' . $asesor->instansi . ')',
                    'jabatan' => $asesor->jabatan,
                    'instansi' => $asesor->instansi
                ];
            });

        // Adapt data shape for the React form (expects modul.order aliasing urutan)
        $formData = [
            'id' => $sertifikasi->id,
            'nama_sertifikasi' => $sertifikasi->nama_sertifikasi,
            'jenis_sertifikasi' => $sertifikasi->jenis_sertifikasi,
            'deskripsi' => $sertifikasi->deskripsi,
            'asesor_id' => $sertifikasi->asesor_id,
            'selectedAsesor' => $sertifikasi->asesor ? [
                'id' => $sertifikasi->asesor->id,
                'name' => $sertifikasi->asesor->nama_asesor,
                'label' => $sertifikasi->asesor->nama_asesor . ' - ' . $sertifikasi->asesor->jabatan . ' (' . $sertifikasi->asesor->instansi . ')',
                'jabatan' => $sertifikasi->asesor->jabatan,
                'instansi' => $sertifikasi->asesor->instansi
            ] : null,
            'tipe_sertifikat' => $sertifikasi->tipe_sertifikat,
            'thumbnail_url' => $sertifikasi->thumbnail_url,
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
        
        return Inertia::render('admin/form-sertifikasi', [
            'sertifikasi' => $formData, 
            'isEdit' => true,
            'asesors' => $asesors
        ]);
    }

    public function update(UpdateSertifikasiRequest $request, $id)
    {
        $sertifikasi = Sertifikasi::findOrFail($id);
        $validated = $request->validated();
        $slug = Str::slug($validated['nama_sertifikasi']);
        
        // Handle asesor - jika buat baru atau pilih existing
        if (!empty($validated['nama_asesor'])) {
            // Buat asesor baru
            $asesorData = [
                'nama_asesor' => $validated['nama_asesor'],
                'jabatan' => $validated['jabatan'] ?? '',
                'instansi' => $validated['instansi'] ?? '',
                'status' => 'Aktif'
            ];
            
            if ($request->hasFile('foto_asesor')) {
                $asesorData['foto'] = $this->storeSertifikasiFile($request->file('foto_asesor'), $slug, 'foto-asesor');
            }
            
            $asesor = \App\Models\Asesor::create($asesorData);
            $validated['asesor_id'] = $asesor->id;
        } elseif ($request->hasFile('foto_asesor') && $validated['asesor_id']) {
            // Update foto asesor yang sudah ada
            $asesor = \App\Models\Asesor::find($validated['asesor_id']);
            if ($asesor) {
                // Delete old photo if exists
                if ($asesor->foto_asesor && Storage::disk('public')->exists($asesor->foto_asesor)) {
                    Storage::disk('public')->delete($asesor->foto_asesor);
                }
                
                // Upload new photo
                $fotoPath = $this->storeSertifikasiFile($request->file('foto_asesor'), $slug, 'foto-asesor');
                $asesor->update(['foto_asesor' => $fotoPath]);
            }
        }
        
        if ($request->hasFile('thumbnail')) {
            if ($sertifikasi->thumbnail) { Storage::disk('public')->delete($sertifikasi->thumbnail); }
            $validated['thumbnail'] = $this->storeSertifikasiFile($request->file('thumbnail'), $slug, 'thumbnail');
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
        return response()->json($query->paginate($request->get('per_page', 5)));
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
