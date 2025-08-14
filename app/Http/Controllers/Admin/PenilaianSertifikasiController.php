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
                  ->orWhere('nama_asesor','like','%'.$search.'%');
            });
        }
        if($request->filled('jenis')){ $query->where('jenis_sertifikasi',$request->jenis); }
        
        $paginator = $query->latest()->paginate($request->integer('per_page',10))->appends($request->all());
        $focusBatchId = $request->integer('batch');
        $mapped = $paginator->through(function($s) use ($focusBatchId){
            return [
                'id' => $s->id,
                'namaSertifikasi' => $s->nama_sertifikasi,
                'assessor' => $s->nama_asesor,
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
        $pendaftaran = PendaftaranSertifikasi::with(['user', 'sertifikasi', 'batch', 'penilaian'])->findOrFail($id);
        return Inertia::render('admin/detail-penilaian-sertifikasi', ['pendaftaran' => $pendaftaran]);
    }

    public function batchPenilaian($sertifikasiId, $batchId)
    {
        $batch = BatchSertifikasi::with([
            'sertifikasi',
            'pendaftaran' => function($query) {
                $query->where('status', 'Disetujui'); // Only approved registrations
            },
            'pendaftaran.user',
            'pendaftaran.penilaian'
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
                    'nama_asesor' => $batch->sertifikasi->nama_asesor,
                ],
                'pendaftaran' => $batch->pendaftaran->map(function ($pendaftaran) {
                    return [
                        'id' => $pendaftaran->id,
                        'user' => [
                            'id' => $pendaftaran->user->id,
                            'name' => $pendaftaran->user->name,
                            'email' => $pendaftaran->user->email,
                        ],
                        'tanggal_pendaftaran' => $pendaftaran->tanggal_pendaftaran?->format('Y-m-d'),
                        'status' => $pendaftaran->status,
                        'penilaian' => $pendaftaran->penilaian ? [
                            'id' => $pendaftaran->penilaian->id,
                            'status_kelulusan' => $pendaftaran->penilaian->status_kelulusan,
                            'nilai_kompetensi' => $pendaftaran->penilaian->nilai_kompetensi,
                            'nilai_wawancara' => $pendaftaran->penilaian->nilai_wawancara,
                            'nilai_praktek' => $pendaftaran->penilaian->nilai_praktek,
                            'catatan' => $pendaftaran->penilaian->catatan,
                            'tanggal_penilaian' => $pendaftaran->penilaian->tanggal_penilaian?->format('Y-m-d'),
                        ] : null,
                    ];
                })->values(),
            ],
            'sertifikasi_id' => $sertifikasiId,
            'batch_id' => $batchId
        ]);
    }

    public function store(StorePenilaianSertifikasiRequest $request, $pendaftaranId)
    {
        $this->service->nilaiIndividu($request->validated(), $pendaftaranId, auth()->id());
        return redirect()->route('admin.penilaian-sertifikasi')->with('success', 'Penilaian sertifikasi berhasil disimpan');
    }

    public function batchStore(BatchStorePenilaianSertifikasiRequest $request, $sertifikasiId, $batchId)
    {
        $this->service->nilaiBatch($request->validated()['penilaian'], $sertifikasiId, $batchId, auth()->id());
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
        return response()->json($query->paginate($request->get('per_page', 10)));
    }

    public function apiStore(StorePenilaianSertifikasiRequest $request)
    {
        $data = $request->validated();
        $this->service->nilaiIndividu($data, $data['pendaftaran_id'], auth()->id());
        return response()->json(['message' => 'Penilaian berhasil disimpan']);
    }

    public function apiUpdate(StorePenilaianSertifikasiRequest $request, $id)
    {
        // Reuse same rules; we upsert by pendaftaran reference
        $data = $request->validated();
        $this->service->nilaiIndividu($data, $data['pendaftaran_id'], auth()->id());
        return response()->json(['message' => 'Penilaian berhasil diperbarui']);
    }
}
