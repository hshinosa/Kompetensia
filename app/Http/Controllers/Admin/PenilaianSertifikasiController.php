<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePenilaianSertifikasiRequest;
use App\Http\Requests\Admin\BatchStorePenilaianSertifikasiRequest;
use App\Services\PenilaianSertifikasiService;
use App\Models\PendaftaranSertifikasi;
use App\Models\BatchSertifikasi;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PenilaianSertifikasiController extends Controller
{
    public function __construct(private readonly PenilaianSertifikasiService $service) {}

    public function index(Request $request)
    {
        $query = \App\Models\Sertifikasi::with([
            'asesor', // Add asesor relationship
            'batch' => function($q) {
                $q->withCount(['pendaftaran' => function($query) {
                    $query->where('status', 'Disetujui'); // Only count approved registrations
                }]);
            }
        ]);
        
        if($request->filled('search')){
            $search = $request->string('search');
            $query->where(function($q) use ($search){
                $q->where('nama_sertifikasi','like','%'.$search.'%')
                  ->orWhereHas('asesor', function($subQuery) use ($search) {
                      $subQuery->where('nama_asesor','like','%'.$search.'%');
                  });
            });
        }
        if($request->filled('jenis')){ $query->where('jenis_sertifikasi',$request->jenis); }
        
        $paginator = $query->latest()->paginate($request->integer('per_page',5))->appends($request->all());
        $focusBatchId = $request->integer('batch');
        $mapped = $paginator->through(function($s) use ($focusBatchId){
            return [
                'id' => $s->id,
                'namaSertifikasi' => $s->nama_sertifikasi,
                'assessor' => $s->asesor?->nama_asesor, // Use asesor relationship
                'penyelenggara' => $s->jenis_sertifikasi,
                'batches' => $s->batch->when($focusBatchId, fn($c) => $c->where('id', $focusBatchId))->map(fn($b) => [
                    'id' => $b->id,
                    'namaBatch' => $b->nama_batch ?? 'Batch '.$b->id,
                    'jumlahPeserta' => $b->pendaftaran_count, // Now only counts approved registrations
                    'status' => $this->deriveBatchStatus($b),
                ])->values(),
            ];
        });
        return Inertia::render('admin/penilaian-sertifikasi', [
            'sertifikasi' => $mapped,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
            'filters' => [
                'search' => $request->get('search'),
                'jenis' => $request->get('jenis'),
                'batch' => $request->get('batch'),
            ],
        ]);
    }

    protected function deriveBatchStatus($batch): string
    {
        $today = now()->startOfDay();
        $result = 'Selesai';
        if ($batch->status === 'Ditutup' || $batch->status === 'Selesai') {
            $result = 'Selesai';
        } elseif ($today->lt($batch->tanggal_mulai)) {
            $result = 'Akan Datang';
        } elseif ($today->between($batch->tanggal_mulai, $batch->tanggal_selesai)) {
            $result = 'Aktif';
        }
        return $result;
    }

    public function show($id)
    {
        $pendaftaran = PendaftaranSertifikasi::with([
            'user', 
            'sertifikasi', 
            'batch', 
            'penilaian',
            'uploadTugas' => function($query) {
                $query->orderBy('tanggal_upload', 'desc');
            }
        ])->findOrFail($id);
        
        return Inertia::render('admin/detail-penilaian-sertifikasi', ['pendaftaran' => $pendaftaran]);
    }

    public function batchPenilaian($sertifikasiId, $batchId)
    {
        $batch = BatchSertifikasi::with([
            'sertifikasi.asesor', // Load asesor relationship
            'pendaftaran' => function($query) {
                $query->where('status', 'Disetujui'); // Only approved registrations
            },
            'pendaftaran.user',
            'pendaftaran.penilaian',
            'pendaftaran.sertifikatKelulusan', // Load issued certificates
            'pendaftaran.uploadTugas' => function($query) {
                $query->orderBy('tanggal_upload', 'desc');
            }
        ])
            ->where('sertifikasi_id', $sertifikasiId)
            ->findOrFail($batchId);

        return Inertia::render('admin/batch-penilaian-sertifikasi', [
            'batch' => [
                'id' => $batch->id,
                'nama_batch' => $batch->nama_batch,
                'tanggal_mulai' => $batch->tanggal_mulai?->format('Y-m-d'),
                'tanggal_selesai' => $batch->tanggal_selesai?->format('Y-m-d'),
                'status' => $batch->status,
                'sertifikasi' => [
                    'id' => $batch->sertifikasi->id,
                    'nama_sertifikasi' => $batch->sertifikasi->nama_sertifikasi,
                    'nama_asesor' => $batch->sertifikasi->asesor?->nama_asesor, // Use asesor relationship
                ],
                'pendaftaran' => $batch->pendaftaran->map(function ($pendaftaran) {
                    return [
                        'id' => $pendaftaran->id,
                        'user' => [
                            'id' => $pendaftaran->user->id,
                            'name' => $pendaftaran->user->nama, // Use 'nama' field from database
                            'email' => $pendaftaran->user->email,
                        ],
                        'berkas_persyaratan' => $pendaftaran->berkas_persyaratan, // Add berkas field
                        'upload_tugas' => $pendaftaran->uploadTugas->map(function ($upload) {
                            return [
                                'id' => $upload->id,
                                'judul_tugas' => $upload->judul_tugas,
                                'link_url' => $upload->link_url,
                                'nama_file' => $upload->nama_file,
                                'path_file' => $upload->path_file,
                                'download_url' => $upload->path_file ? route('admin.upload-tugas.download', ['id' => $upload->id]) : null,
                                'status' => $upload->status,
                                'tanggal_upload' => $upload->tanggal_upload->format('Y-m-d H:i:s'),
                                'feedback' => $upload->feedback,
                            ];
                        }),
                        'tanggal_pendaftaran' => $pendaftaran->tanggal_pendaftaran?->format('Y-m-d'),
                        'status' => $pendaftaran->status,
                        'penilaian' => $pendaftaran->penilaian ? [
                            'id' => $pendaftaran->penilaian->id,
                            'status_kelulusan' => $pendaftaran->penilaian->status_penilaian, // Map status_penilaian to status_kelulusan
                            'nilai_kompetensi' => $pendaftaran->penilaian->nilai_kompetensi,
                            'nilai_wawancara' => $pendaftaran->penilaian->nilai_wawancara,
                            'nilai_praktek' => $pendaftaran->penilaian->nilai_praktek,
                            'catatan_asesor' => $pendaftaran->penilaian->catatan_asesor, // Use consistent field name
                            'tanggal_penilaian' => $pendaftaran->penilaian->tanggal_penilaian?->format('Y-m-d'),
                        ] : null,
                        'sertifikat' => $pendaftaran->sertifikatKelulusan ? [
                            'id' => $pendaftaran->sertifikatKelulusan->id,
                            'link_sertifikat' => $pendaftaran->sertifikatKelulusan->link_sertifikat,
                            'tanggal_selesai' => $pendaftaran->sertifikatKelulusan->tanggal_selesai?->format('Y-m-d'),
                            'catatan_admin' => $pendaftaran->sertifikatKelulusan->catatan_admin,
                        ] : null,
                    ];
                })->values(),
            ],
            'sertifikasi_id' => $sertifikasiId,
            'batch_id' => $batchId
        ]);
    }

    public function updateTugasStatus(Request $request, $tugasId)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'feedback' => 'nullable|string|max:1000'
        ]);
        
        $asesorId = auth()->id();
        if (!$asesorId) {
            return redirect()->back()->withErrors(['error' => 'User tidak terautentikasi']);
        }
        
        $upload = \App\Models\UploadTugasSertifikasi::findOrFail($tugasId);
        $upload->update([
            'status' => $request->status,
            'feedback' => $request->feedback
        ]);
        
        return redirect()->back()->with('success', 'Penilaian tugas berhasil disimpan');
    }

    public function store(StorePenilaianSertifikasiRequest $request, $pendaftaranId)
    {
        $asesorId = auth()->id();
        if (!$asesorId) {
            return redirect()->back()->withErrors(['error' => 'User tidak terautentikasi']);
        }
        
        $this->service->nilaiIndividu($request->validated(), $pendaftaranId, $asesorId);
        
        // Redirect back to batch page instead of main page
        return redirect()->back()->with('success', 'Penilaian sertifikasi berhasil disimpan');
    }

    public function batchStore(BatchStorePenilaianSertifikasiRequest $request, $sertifikasiId, $batchId)
    {
        $asesorId = auth()->id();
        if (!$asesorId) {
            return redirect()->back()->withErrors(['error' => 'User tidak terautentikasi']);
        }
        
        $this->service->nilaiBatch($request->validated()['penilaian'], $sertifikasiId, $batchId, $asesorId);
        return redirect()->route('admin.batch-penilaian-sertifikasi', ['sertifikasiId' => $sertifikasiId, 'batchId' => $batchId])
            ->with('success', 'Penilaian batch berhasil disimpan');
    }

    // API methods keep existing filtering, could later be moved behind a query service.
    public function apiIndex(Request $request)
    {
        $query = PendaftaranSertifikasi::with(['user', 'sertifikasi', 'batch', 'penilaian'])->approved();
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            })->orWhereHas('sertifikasi', function ($q) use ($search) {
                $q->where('nama_sertifikasi', 'like', '%' . $search . '%');
            });
        }
        if ($request->has('sertifikasi_id')) { $query->where('sertifikasi_id', $request->sertifikasi_id); }
        if ($request->has('batch_id')) { $query->where('batch_id', $request->batch_id); }
        if ($request->has('status_kelulusan')) {
            $query->whereHas('penilaian', function ($q) use ($request) {
                $q->where('status_kelulusan', $request->status_kelulusan);
            });
        }
        return response()->json($query->paginate($request->get('per_page', 5)));
    }

    public function apiStore(StorePenilaianSertifikasiRequest $request)
    {
        $asesorId = auth()->id();
        if (!$asesorId) {
            return response()->json(['error' => 'User tidak terautentikasi'], 401);
        }
        
        $data = $request->validated();
        $this->service->nilaiIndividu($data, $data['pendaftaran_id'], $asesorId);
        return response()->json(['message' => 'Penilaian berhasil disimpan']);
    }

    public function apiUpdate(StorePenilaianSertifikasiRequest $request, $id)
    {
        $asesorId = auth()->id();
        if (!$asesorId) {
            return response()->json(['error' => 'User tidak terautentikasi'], 401);
        }
        
        // Reuse same rules; we upsert by pendaftaran reference
        $data = $request->validated();
        $this->service->nilaiIndividu($data, $data['pendaftaran_id'], $asesorId);
        return response()->json(['message' => 'Penilaian berhasil diperbarui']);
    }
}
