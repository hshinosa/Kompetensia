<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePKLRequest;
use App\Http\Requests\Admin\UpdatePKLRequest;
use App\Http\Requests\Admin\StorePenilaianPKLRequest;
use App\Services\PKLService;
use App\Services\PenilaianPKLService;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PendaftaranPKL;
use App\Models\PosisiPKL;

class PKLController extends Controller
{
    public function __construct(private readonly PKLService $service, private readonly PenilaianPKLService $penilaianService) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search','status','sort_by','sort_direction']);

        // Existing program PKL list (if still used elsewhere on the page or future use)
        $pkl = $this->service->list($filters, 10);

        // Posisi PKL list for the table on the page - dengan count hanya pendaftar yang disetujui
        $posisiQuery = PosisiPKL::query()->withCount([
            'pendaftaran as jumlah_pendaftar_disetujui' => function($query) {
                $query->where('status', 'Disetujui');
            }
        ]);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $posisiQuery->where(function($q) use ($search) {
                $q->where('nama_posisi','like',"%{$search}%")
                  ->orWhere('kategori','like',"%{$search}%");
            });
        }
        if (!empty($filters['status'])) {
            $posisiQuery->where('status', $filters['status']);
        }

        $perPage = 8;
        $posisiPaginator = $posisiQuery->latest()->paginate($perPage)->appends($request->query());
        
        // Map data dan override jumlah_pendaftar dengan count hanya yang disetujui
        $posisiData = $posisiPaginator->getCollection()->map(function ($posisi) {
            $posisi->jumlah_pendaftar = $posisi->jumlah_pendaftar_disetujui;
            return $posisi;
        });
        
        $posisi = [
            'data' => $posisiData,
            'meta' => [
                'current_page' => $posisiPaginator->currentPage(),
                'last_page' => $posisiPaginator->lastPage(),
                'per_page' => $posisiPaginator->perPage(),
                'total' => $posisiPaginator->total(),
            ],
        ];

        return Inertia::render('admin/praktik-kerja-lapangan', [
            'pkl' => $pkl,
            'posisi' => $posisi,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/form-pkl');
    }

    public function store(StorePKLRequest $request)
    {
        $data = $request->validated();
        $data['jumlah_pendaftar'] = 0;
        $data['created_by'] = auth()->id();
        $this->service->create($data);
        return redirect()->route('admin.praktik-kerja-lapangan')->with('success', 'Program PKL berhasil dibuat');
    }

    public function show($id)
    {
        return response()->json($this->service->detail($id));
    }

    public function edit($id)
    {
        $pkl = $this->service->detail($id);
        return Inertia::render('admin/form-pkl', ['pkl' => $pkl, 'isEdit' => true]);
    }

    public function update(UpdatePKLRequest $request, $id)
    {
        $pkl = $this->service->detail($id);
        $data = $request->validated();
        $this->service->update($pkl, $data);
        return redirect()->route('admin.praktik-kerja-lapangan')->with('success', 'Program PKL berhasil diperbarui');
    }

    public function destroy($id)
    {
        $pkl = $this->service->detail($id);
        $this->service->delete($pkl);
        return redirect()->route('admin.praktik-kerja-lapangan')->with('success', 'Program PKL berhasil dihapus');
    }

    public function penilaianIndex()
    {
        // Get only APPROVED applications for assessment - no pending applications
        $pendaftaran = PendaftaranPKL::with(['user', 'posisiPKL', 'penilaian'])
            ->where('status', 'Disetujui') // Only approved applications
            ->latest()
            ->get(); // Remove pagination - get all data
        
        // Add dynamic status based on internship period and assessment
        $pendaftaranWithStatus = $pendaftaran->map(function ($item) {
            $now = now();
            $startDate = $item->tanggal_mulai ? \Carbon\Carbon::parse($item->tanggal_mulai) : null;
            $endDate = $item->tanggal_selesai ? \Carbon\Carbon::parse($item->tanggal_selesai) : null;
            $hasPenilaian = $item->penilaian()->exists();
            
            // For approved applications, dates MUST exist
            if ($item->status === 'Disetujui') {
                // If somehow approved but no dates (should not happen), force default status
                if (!$startDate || !$endDate) {
                    $item->status_dinamis = 'Periode Belum Ditentukan';
                } else {
                    if ($now->lt($startDate)) {
                        // Internship hasn't started yet
                        $item->status_dinamis = 'Belum Dimulai';
                    } elseif ($now->between($startDate, $endDate)) {
                        // Currently in internship period
                        $item->status_dinamis = 'Sedang Berjalan';
                    } elseif ($now->gt($endDate)) {
                        // Internship period has ended
                        if ($hasPenilaian) {
                            $item->status_dinamis = 'Selesai';
                        } else {
                            $item->status_dinamis = 'Belum Dinilai';
                        }
                    }
                }
            } else {
                // For non-approved applications, status doesn't depend on dates
                $item->status_dinamis = $item->status; // Use original status
            }
            
            return $item;
        });
        
        return Inertia::render('admin/penilaian-pkl', [
            'pendaftaran' => [
                'data' => $pendaftaranWithStatus,
                'total' => $pendaftaranWithStatus->count()
            ]
        ]);
    }

    public function penilaianOverview(Request $request)
    {
        // Get PKL positions with approved participants count
        $posisiQuery = PosisiPKL::with([
            'pendaftaran' => function($query) {
                $query->where('status', 'Disetujui');
            }
        ])->withCount([
            'pendaftaran as approved_count' => function($query) {
                $query->where('status', 'Disetujui');
            }
        ]);

        if ($request->filled('search')) {
            $search = $request->search;
            $posisiQuery->where(function($q) use ($search) {
                $q->where('nama_posisi', 'like', '%' . $search . '%')
                  ->orWhere('kategori', 'like', '%' . $search . '%');
            });
        }

        $posisi = $posisiQuery->latest()->paginate(5);
        
        return Inertia::render('admin/penilaian-pkl-overview', [
            'posisi' => $posisi,
            'filters' => $request->only(['search'])
        ]);
    }

    public function penilaianShow($id)
    {
        $pendaftaran = PendaftaranPKL::with(['user', 'posisiPKL', 'penilaian'])->findOrFail($id);
        
        // Add dynamic status for detail view
        $now = now();
        $startDate = $pendaftaran->tanggal_mulai ? \Carbon\Carbon::parse($pendaftaran->tanggal_mulai) : null;
        $endDate = $pendaftaran->tanggal_selesai ? \Carbon\Carbon::parse($pendaftaran->tanggal_selesai) : null;
        $hasPenilaian = $pendaftaran->penilaian()->exists();
        
        if ($pendaftaran->status === 'Disetujui' && $startDate && $endDate) {
            if ($now->lt($startDate)) {
                $pendaftaran->status_dinamis = 'Belum Dimulai';
            } elseif ($now->between($startDate, $endDate)) {
                $pendaftaran->status_dinamis = 'Sedang Berjalan';
            } elseif ($now->gt($endDate)) {
                $pendaftaran->status_dinamis = $hasPenilaian ? 'Selesai' : 'Belum Dinilai';
            }
        } else {
            $pendaftaran->status_dinamis = $pendaftaran->status;
        }
        
        // Ambil submisi PKL dari UserDocument
        $submisiPKL = \App\Models\UserDocument::where('user_id', $pendaftaran->user_id)
            ->where('pendaftaran_pkl_id', $pendaftaran->id)
            ->where('jenis_dokumen', 'submisi_pkl')
            ->with(['diverifikasiOleh'])
            ->orderBy('tanggal_submit', 'asc')
            ->get()
            ->map(function($submisi) {
                return [
                    'id' => $submisi->id,
                    'nomor_submisi' => $submisi->nomor_submisi,
                    'tanggal_submit' => $submisi->tanggal_submit ? $submisi->tanggal_submit->format('d M Y') : null,
                    'status' => $submisi->tanggal_submit ? 'submitted' : 'pending',
                    'kategori_submisi' => $submisi->kategori_submisi, // 'laporan' | 'tugas'
                    'tipe_submisi' => $submisi->tipe_submisi, // 'link' | 'dokumen'
                    'judul_tugas' => $submisi->judul_tugas,
                    'deskripsi_tugas' => $submisi->deskripsi_tugas,
                    'link_submisi' => $submisi->link_submisi,
                    'nama_dokumen' => $submisi->nama_dokumen,
                    'path_file' => $submisi->path_file,
                    'ukuran_file' => $submisi->ukuran_file,
                    'tipe_mime' => $submisi->tipe_mime,
                    'url_file' => $submisi->url_file,
                    'ukuran_file_format' => $submisi->ukuran_file_format,
                    'is_assessed' => $submisi->status_penilaian !== 'menunggu',
                    'status_penilaian' => $submisi->status_penilaian, // 'menunggu' | 'diterima' | 'ditolak'
                    'feedback_pembimbing' => $submisi->feedback_pembimbing,
                    'tanggal_verifikasi' => $submisi->tanggal_verifikasi ? $submisi->tanggal_verifikasi->format('d M Y') : null,
                    'diverifikasi_oleh' => $submisi->diverifikasiOleh?->nama ?? $submisi->diverifikasiOleh?->nama_lengkap,
                ];
            });
        
        return Inertia::render('admin/detail-penilaian-pkl', [
            'pendaftaran' => $pendaftaran,
            'submisi_pkl' => $submisiPKL
        ]);
    }

    public function penilaianStore(StorePenilaianPKLRequest $request, $pendaftaranId)
    {
        $this->penilaianService->nilai($pendaftaranId, $request->validated(), auth()->id());
        return redirect()->route('admin.penilaian-pkl')->with('success', 'Penilaian PKL berhasil disimpan');
    }

    public function penilaianSubmisiStore(Request $request, $submisiId)
    {
        $request->validate([
            'status_penilaian' => 'required|in:diterima,ditolak',
            'feedback_pembimbing' => 'nullable|string|max:1000'
        ]);

        $submisi = \App\Models\UserDocument::where('jenis_dokumen', 'submisi_pkl')
            ->findOrFail($submisiId);

        $submisi->update([
            'status_penilaian' => $request->status_penilaian,
            'feedback_pembimbing' => $request->feedback_pembimbing,
            'tanggal_verifikasi' => now(),
            'diverifikasi_oleh' => auth()->id(),
            'terverifikasi' => $request->status_penilaian === 'diterima'
        ]);

        return redirect()->back()->with('success', 'Penilaian submisi berhasil disimpan');
    }

    public function apiIndex(Request $request)
    {
        $query = PosisiPKL::withCount('pendaftaran');
        if ($request->has('search')) { $query->where('nama_program', 'like', '%' . $request->search . '%'); }
        if ($request->has('status')) { $query->where('status', $request->status); }
        return response()->json($query->paginate($request->get('per_page', 5)));
    }

    public function apiStore(StorePKLRequest $request)
    {
        $validated = $request->validated();
        $validated['jumlah_pendaftar'] = 0;
        $validated['created_by'] = auth()->id();
        $pkl = PosisiPKL::create($validated);
        return response()->json(['message' => 'Program PKL berhasil dibuat', 'data' => $pkl], 201);
    }

    public function apiUpdate(UpdatePKLRequest $request, $id)
    {
        $pkl = PosisiPKL::findOrFail($id);
        $validated = $request->validated();
        $pkl->update($validated);
        return response()->json(['message' => 'Program PKL berhasil diperbarui', 'data' => $pkl]);
    }

    public function destroyPosisi($id)
    {
        $posisi = PosisiPKL::findOrFail($id);
        $posisi->delete();
        return redirect()->back()->with('success','Posisi PKL berhasil dihapus');
    }

    public function storePosisi(Request $request)
    {
        $validated = $this->validatePosisiData($request);
        $validated['created_by'] = auth()->id();
        
        PosisiPKL::create($validated);
        
        return redirect()->route('admin.praktik-kerja-lapangan')
            ->with('success', 'Posisi PKL berhasil ditambahkan');
    }

    public function updatePosisi(Request $request, $id)
    {
        $posisi = PosisiPKL::findOrFail($id);
        $validated = $this->validatePosisiData($request);
        
        $posisi->update($validated);
        
        return redirect()->route('admin.praktik-kerja-lapangan')
            ->with('success', 'Posisi PKL berhasil diperbarui');
    }

    public function showPosisi($id)
    {
        $posisi = PosisiPKL::with(['pendaftaran.user', 'creator'])->findOrFail($id);
        
        // Ensure persyaratan and benefit are arrays for consistent frontend handling
        if (is_string($posisi->persyaratan)) {
            $posisi->persyaratan = json_decode($posisi->persyaratan, true) ?: array_filter(explode("\n", $posisi->persyaratan));
        }
        
            if (is_string($posisi->benefits)) {
                $posisi->benefits = json_decode($posisi->benefits, true) ?: array_filter(explode("\n", $posisi->benefits));
        }
        
        return response()->json($posisi);
    }

    private function validatePosisiData(Request $request): array
    {
        // Validate basic fields; benefits and persyaratan as newline-separated strings
        $data = $request->validate([
            'nama_posisi' => 'required|string|max:255',
            'kategori' => 'nullable|string|max:255',
            'deskripsi' => 'required|string',
            'persyaratan' => 'required|string',
            'benefits' => 'required|string',
            'tipe' => 'required|string|max:255',
            'durasi_bulan' => 'required|integer|min:1|max:12',
            'status' => 'required|in:Aktif,Non-Aktif,Penuh',
        ]);

    // Split persyaratan and benefits into arrays for Eloquent cast
    $data['persyaratan'] = array_filter(explode("\n", $data['persyaratan']));
    $data['benefits'] = array_filter(explode("\n", $data['benefits']));
        
    return $data;
    }
}
