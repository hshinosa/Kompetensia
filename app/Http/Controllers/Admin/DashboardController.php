<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Sertifikasi;
use App\Models\PKL;
use App\Models\PendaftaranSertifikasi;
use App\Models\PendaftaranPKL;
use App\Models\Blog;
use App\Models\Video;
use App\Models\BatchSertifikasi;
use App\Models\PosisiPKL;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'peserta_sertifikasi' => PendaftaranSertifikasi::approved()->count(),
            'siswa_pkl' => PendaftaranPKL::approved()->count(),
            // assessor count removed (asesor now standalone table without auth)
            'jumlah_sertifikasi' => Sertifikasi::active()->count(),
            'total_blog' => Blog::published()->count(),
            'total_video' => Video::published()->count(),
            'total_users' => User::count()
        ];

        $pendaftaranTerbaru = collect()
            ->merge(
                PendaftaranSertifikasi::with(['user', 'sertifikasi', 'batch'])
                    ->latest()
                    ->limit(10)
                    ->get()
                    ->map(function ($item) {
                        $batchDisplay = $item->batch->nama_batch ?? null;
                        if (!$batchDisplay && $item->status === 'Disetujui') {
                            $batchDisplay = 'Batch akan ditentukan';
                        }

                        return [
                            'id' => 'sertifikasi_' . $item->id,
                            'original_id' => $item->id,
                            'user_id' => $item->user->id,
                            'nama' => $item->user->name,
                            'jenis_pendaftaran' => 'Sertifikasi Kompetensi',
                            'program' => $item->sertifikasi->nama_sertifikasi,
                            'batch' => $batchDisplay,
                            'tanggal_pendaftaran' => $item->tanggal_pendaftaran->format('d-m-Y'),
                            'status' => $item->status,
                            'type' => 'sertifikasi',
                            'batch_info' => $item->batch ? [
                                'id' => $item->batch->id,
                                'nama' => $item->batch->nama_batch,
                                'tanggal_mulai' => $item->batch->tanggal_mulai?->format('d-m-Y'),
                                'status' => $item->batch->status
                            ] : null
                        ];
                    })
            )
            ->merge(
                PendaftaranPKL::with(['user', 'pkl', 'posisiPKL'])
                    ->latest()
                    ->limit(10)
                    ->get()
                    ->map(function ($item) {
                        $batchDisplay = null;
                        if ($item->posisiPKL) {
                            $batchDisplay = $item->posisiPKL->nama_posisi . ' - ' . $item->posisiPKL->perusahaan;
                        } elseif ($item->status === 'Disetujui') {
                            $batchDisplay = 'Posisi akan ditentukan';
                        }

                        return [
                            'id' => 'pkl_' . $item->id,
                            'original_id' => $item->id,
                            'user_id' => $item->user->id,
                            'nama' => $item->user->name,
                            'jenis_pendaftaran' => 'Praktik Kerja Lapangan',
                            'program' => $item->pkl->nama_program,
                            'batch' => $batchDisplay,
                            'tanggal_pendaftaran' => $item->tanggal_pendaftaran->format('d-m-Y'),
                            'status' => $item->status,
                            'type' => 'pkl',
                            'posisi_info' => $item->posisiPKL ? [
                                'id' => $item->posisiPKL->id,
                                'nama_posisi' => $item->posisiPKL->nama_posisi,
                                'perusahaan' => $item->posisiPKL->perusahaan,
                                'kategori' => $item->posisiPKL->kategori,
                                'tanggal_mulai' => $item->posisiPKL->tanggal_mulai?->format('d-m-Y'),
                                'tanggal_selesai' => $item->posisiPKL->tanggal_selesai?->format('d-m-Y'),
                                'status' => $item->posisiPKL->status
                            ] : null
                        ];
                    })
            )
            ->sortByDesc('tanggal_pendaftaran')
            ->take(15)
            ->values();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'pendaftaran_terbaru' => $pendaftaranTerbaru
        ]);
    }

    public function pendaftaranDetail($type, $id)
    {
        try {
            \Log::info("pendaftaranDetail called with type: {$type}, id: {$id}");
            
            if ($type === 'sertifikasi') {
                $pendaftaran = PendaftaranSertifikasi::with(['user', 'sertifikasi', 'batch'])
                    ->findOrFail($id);
                    
                \Log::info("Found sertifikasi pendaftaran: {$pendaftaran->id}");
                \Log::info("User: {$pendaftaran->user->name}");
                \Log::info("Sertifikasi: " . ($pendaftaran->sertifikasi ? $pendaftaran->sertifikasi->nama_sertifikasi : 'null'));
                \Log::info("Batch: " . ($pendaftaran->batch ? $pendaftaran->batch->id : 'null'));
                    
                // Add batch information if approved
                if ($pendaftaran->status === 'Disetujui' && !$pendaftaran->batch_id) {
                    $activeBatch = $this->findOrCreateActiveBatch($pendaftaran->sertifikasi_id);
                    $pendaftaran->batch_id = $activeBatch->id;
                    $pendaftaran->save();
                    $pendaftaran->load('batch');
                }
            } else {
                $pendaftaran = PendaftaranPKL::with(['user', 'pkl', 'posisiPKL'])
                    ->findOrFail($id);
                    
                \Log::info("Found PKL pendaftaran: {$pendaftaran->id}");
                    
                // Add position information if approved
                if ($pendaftaran->status === 'Disetujui' && !$pendaftaran->posisi_pkl_id) {
                    $availablePosition = $this->findAvailablePKLPosition();
                    if ($availablePosition) {
                        $pendaftaran->posisi_pkl_id = $availablePosition->id;
                        $pendaftaran->save();
                        $pendaftaran->load('posisiPKL');
                    }
                }
            }

            \Log::info("pendaftaranDetail success, returning JSON data");
            
            // Ensure we return a proper JSON response
            return response()->json($pendaftaran, 200, [
                'Content-Type' => 'application/json'
            ]);
            
        } catch (\Exception $e) {
            \Log::error("pendaftaranDetail error: " . $e->getMessage());
            \Log::error("Stack trace: " . $e->getTraceAsString());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function approvePendaftaran(Request $request, $type, $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:Disetujui,Ditolak',
                'catatan_admin' => 'nullable|string'
            ]);

            if ($type === 'sertifikasi') {
                $pendaftaran = PendaftaranSertifikasi::with(['sertifikasi', 'batch'])->findOrFail($id);
                
                // Jika disetujui, cari atau buat batch aktif untuk sertifikasi
                if ($validated['status'] === 'Disetujui') {
                    $activeBatch = $this->findOrCreateActiveBatch($pendaftaran->sertifikasi_id);
                    $pendaftaran->batch_id = $activeBatch->id;
                }
            } else {
                $pendaftaran = PendaftaranPKL::with(['pkl'])->findOrFail($id);
                
                // Untuk PKL, cari posisi PKL yang tersedia
                if ($validated['status'] === 'Disetujui') {
                    $availablePosition = $this->findAvailablePKLPosition();
                    if ($availablePosition) {
                        $pendaftaran->posisi_pkl_id = $availablePosition->id;
                    }
                }
            }

            $pendaftaran->update([
                'status' => $validated['status'],
                'catatan_admin' => $validated['catatan_admin'],
                'tanggal_diproses' => now(),
                'batch_id' => $pendaftaran->batch_id ?? null,
                'posisi_pkl_id' => $pendaftaran->posisi_pkl_id ?? null
            ]);

            $approvalType = $type === 'sertifikasi' ? 'batch aktif' : 'posisi PKL yang tersedia';
            $message = $validated['status'] === 'Disetujui'
                ? "Pendaftaran berhasil disetujui dan ditambahkan ke {$approvalType}"
                : 'Pendaftaran berhasil ditolak';

            return response()->json(['message' => $message]);
            
        } catch (\Exception $e) {
            \Log::error('Approval failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Gagal memperbarui status: ' . $e->getMessage()], 500);
        }
    }

    private function findOrCreateActiveBatch($sertifikasiId)
    {
        // Cari batch aktif yang masih bisa menampung pendaftar
        $activeBatch = BatchSertifikasi::where('sertifikasi_id', $sertifikasiId)
            ->where('status', 'Aktif')
            ->where('tanggal_mulai', '>', now())
            ->first();

        if (!$activeBatch) {
            // Jika tidak ada batch aktif, cari batch yang sudah ada untuk sertifikasi ini
            $activeBatch = BatchSertifikasi::where('sertifikasi_id', $sertifikasiId)
                ->where('status', 'Aktif')
                ->first();
        }

        if (!$activeBatch) {
            // Buat batch baru jika tidak ada yang tersedia
            $batchCount = BatchSertifikasi::where('sertifikasi_id', $sertifikasiId)->count();
            $activeBatch = BatchSertifikasi::create([
                'sertifikasi_id' => $sertifikasiId,
                'nama_batch' => 'Batch ' . ($batchCount + 1),
                'tanggal_mulai' => now()->addDays(7),
                'tanggal_selesai' => now()->addDays(52), // 45 hari pelatihan
                'jam_mulai' => '08:00:00',
                'jam_selesai' => '17:00:00',
                'tempat' => 'Ruang Pelatihan',
                'jumlah_pendaftar' => 0,
                'status' => 'Aktif',
                'instruktur' => 'Instruktur Sertifikasi',
                'catatan' => 'Batch otomatis dibuat untuk pendaftaran yang disetujui'
            ]);
        }

        return $activeBatch;
    }

    private function findAvailablePKLPosition()
    {
        // Cari posisi PKL yang masih aktif dan tersedia
        return PosisiPKL::where('status', 'Aktif')
            ->where('tanggal_selesai', '>', now())
            ->first();
    }

    public function apiStats()
    {
        $stats = [
            'peserta_sertifikasi' => PendaftaranSertifikasi::approved()->count(),
            'siswa_pkl' => PendaftaranPKL::approved()->count(),
            // assessor count removed
            'jumlah_sertifikasi' => Sertifikasi::active()->count(),
            'total_blog' => Blog::published()->count(),
            'total_video' => Video::published()->count(),
            'pendaftaran_pending' => PendaftaranSertifikasi::pending()->count() + PendaftaranPKL::pending()->count()
        ];
        return response()->json($stats);
    }

    public function apiChartData(Request $request)
    {
        $period = $request->get('period', '7days');
        $startDate = match($period) {
            '7days' => Carbon::now()->subDays(7),
            '30days' => Carbon::now()->subDays(30),
            '3months' => Carbon::now()->subMonths(3),
            '1year' => Carbon::now()->subYear(),
            default => Carbon::now()->subDays(7)
        };
        $pendaftaranChart = [];
        $current = $startDate->copy();
        while ($current <= Carbon::now()) {
            $date = $current->format('Y-m-d');
            $sertifikasiCount = PendaftaranSertifikasi::whereDate('tanggal_pendaftaran', $date)->count();
            $pklCount = PendaftaranPKL::whereDate('tanggal_pendaftaran', $date)->count();
            $pendaftaranChart[] = [
                'date' => $date,
                'sertifikasi' => $sertifikasiCount,
                'pkl' => $pklCount,
                'total' => $sertifikasiCount + $pklCount
            ];
            $current->addDay();
        }
        return response()->json(['pendaftaran_chart' => $pendaftaranChart]);
    }
}
