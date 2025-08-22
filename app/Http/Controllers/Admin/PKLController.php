<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePKLRequest;
use App\Http\Requests\Admin\UpdatePKLRequest;
use App\Http\Requests\Admin\StorePenilaianPKLRequest;
use App\Services\PKLService;
use App\Services\PenilaianPKLService;
use App\Models\PKL;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PendaftaranPKL;
use App\Models\PosisiPKL;
use App\Models\PenilaianPKL;

class PKLController extends Controller
{
    public function __construct(private readonly PKLService $service, private readonly PenilaianPKLService $penilaianService) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search','status','sort_by','sort_direction']);

        // Existing program PKL list (if still used elsewhere on the page or future use)
        $pkl = $this->service->list($filters, 10);

        // Posisi PKL list for the table on the page
        $posisiQuery = PosisiPKL::withCount([
        'pendaftaran as jumlah_pendaftar_aktual' => function($query) {
            $query->where('status', 'Disetujui');
            }
        ]);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $posisiQuery->where(function($q) use ($search) {
                $q->where('nama_posisi','like',"%{$search}%")
                  ->orWhere('perusahaan','like',"%{$search}%");
            });
        }
        if (!empty($filters['status'])) {
            $posisiQuery->where('status', $filters['status']);
        }

        // For now kategori filter not implemented because we treat 'perusahaan' as kategori in UI temporarily.

        $perPage = 5;
        $posisiPaginator = $posisiQuery->latest()->paginate($perPage)->appends($request->query());
        
        // Update the data to include actual count
        $posisiData = $posisiPaginator->items();
        foreach ($posisiData as $posisi) {
            $posisi->jumlah_pendaftar = $posisi->jumlah_pendaftar_aktual;
        }
        
        // Ambil total posisi dari seluruh data (tanpa paginasi/filter)
        $totalPosisi = PosisiPKL::count();
        $posisi = [
            'data' => $posisiData,
            'meta' => [
                'current_page' => $posisiPaginator->currentPage(),
                'last_page' => $posisiPaginator->lastPage(),
                'per_page' => $posisiPaginator->perPage(),
                'total' => $totalPosisi,
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
        $data['peserta_terdaftar'] = 0;
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
        $pendaftaran = PendaftaranPKL::with(['user', 'posisiPKL', 'penilaian'])
            ->approved()
            ->latest()
            ->paginate(10);
        
        return Inertia::render('admin/penilaian-pkl', [
            'pendaftaran' => \App\Http\Resources\PendaftaranPKLResource::collection($pendaftaran)
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
                  ->orWhere('perusahaan', 'like', '%' . $search . '%');
            });
        }

        $posisi = $posisiQuery->latest()->paginate(10);
        
        return Inertia::render('admin/penilaian-pkl-overview', [
            'posisi' => $posisi,
            'filters' => $request->only(['search'])
        ]);
    }

    public function penilaianShow($id)
    {
        // 1. Perbarui query untuk menyertakan relasi 'laporanMingguan'
        //    Kita memuatnya melalui pendaftaran: 'pendaftaran.laporanMingguan'
        $penilaian = PenilaianPKL::with([
            'pendaftaran.user', 
            'pendaftaran.pkl', 
            'pendaftaran.posisi',
            'pendaftaran.penilaian',
            'pendaftaran.laporanMingguan'
        ])->findOrFail($id);

        // 2. Ambil data laporan dari relasi yang sudah dimuat
        $weeklyReports = $penilaian->pendaftaran->laporanMingguan ?? [];
        
        // 3. Hapus array $weeklyReports yang di-hardcode.
        //    Data sekarang sepenuhnya berasal dari database.

        // 4. Kirim data ke komponen React
        return Inertia::render('admin/detail-penilaian-pkl', [
            'penilaian' => $penilaian,
            'weeklyReports' => $weeklyReports, // Variabel ini sekarang berisi data asli
        ]);
    }

    public function penilaianStore(StorePenilaianPKLRequest $request, $pendaftaranId)
    {
        $this->penilaianService->nilai($pendaftaranId, $request->validated(), auth()->id());
        return redirect()->route('admin.penilaian-pkl')->with('success', 'Penilaian PKL berhasil disimpan');
    }

    public function apiIndex(Request $request)
    {
        $query = PKL::query();
        if ($request->has('search')) { $query->where('nama_program', 'like', '%' . $request->search . '%'); }
        if ($request->has('status')) { $query->where('status', $request->status); }
        return response()->json($query->paginate($request->get('per_page', 10)));
    }

    public function apiStore(StorePKLRequest $request)
    {
        $validated = $request->validated();
        $validated['peserta_terdaftar'] = 0;
        $pkl = PKL::create($validated);
        return response()->json(['message' => 'Program PKL berhasil dibuat', 'data' => $pkl], 201);
    }

    public function apiUpdate(UpdatePKLRequest $request, $id)
    {
        $pkl = PKL::findOrFail($id);
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
        return response()->json($posisi);
    }

    private function validatePosisiData(Request $request): array
    {
        $validated = $request->validate([
            'nama_posisi' => 'required|string|max:255',
            'perusahaan' => 'required|string|max:255',
            'kategori' => 'nullable|string|max:255',
            'deskripsi' => 'required|string',
            'persyaratan' => 'required|string',
            'lokasi' => 'required|string|max:255',
            'tipe' => 'required|string|max:255',
            'durasi_bulan' => 'required|integer|min:1|max:12',
            'status' => 'required|in:Aktif,Non-Aktif,Penuh',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai'
        ]);

        // Set default values for removed fields
        $validated['gaji'] = 0;
        $validated['jumlah_pendaftar'] = 10; // Default quota
        $validated['contact_person'] = null;
        $validated['contact_email'] = null;
        $validated['contact_phone'] = null;

        return $validated;
    }
}
