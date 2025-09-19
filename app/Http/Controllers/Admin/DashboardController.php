<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Sertifikasi;
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
            // total articles and videos should include all records
            'total_blog' => Blog::count(),
            'total_video' => Video::count(),
            'total_users' => User::count()
        ];

        $pendaftaranTerbaru = collect()
            ->merge(
                PendaftaranSertifikasi::with(['user', 'sertifikasi', 'batch'])
                    ->latest()
                    ->get()  // Hapus limit, ambil semua
                    ->map(function ($item) {
                        $batchDisplay = $item->batch->nama_batch ?? null;
                        if (!$batchDisplay && $item->status === 'Disetujui') {
                            $batchDisplay = 'Batch akan ditentukan';
                        }

                        return [
                            'id' => 'sertifikasi_' . $item->id,
                            'original_id' => $item->id,
                            'user_id' => $item->user->id,
                            'nama' => $item->user->nama ?? $item->user->name ?? 'Nama tidak tersedia',
                            'full_name' => $item->user->nama_lengkap ?? $item->user->full_name ?? $item->user->nama ?? $item->user->name ?? 'Nama tidak tersedia',
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
                PendaftaranPKL::with(['user', 'posisiPKL'])
                    ->latest()
                    ->get()  // Hapus limit, ambil semua
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
                            'nama' => $item->user->nama ?? $item->user->name ?? 'Nama tidak tersedia',
                            'full_name' => $item->user->nama_lengkap ?? $item->user->full_name ?? $item->user->nama ?? $item->user->name ?? 'Nama tidak tersedia',
                            'jenis_pendaftaran' => 'Praktik Kerja Lapangan',
                            'program' => $item->posisiPKL ? $item->posisiPKL->nama_posisi : 'Tidak ada posisi',
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
            ->values();  // Hapus take(50), ambil semua data

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
                    
                // Add batch information if approved
                if ($pendaftaran->status === 'Disetujui' && !$pendaftaran->batch_id) {
                    $activeBatch = $this->findOrCreateActiveBatch($pendaftaran->sertifikasi_id);
                    $pendaftaran->batch_id = $activeBatch->id;
                    $pendaftaran->save();
                    $pendaftaran->load('batch');
                }

                // Format data untuk sertifikasi
                $formattedData = [
                    'user_id' => $pendaftaran->user->id,
                    'nama' => $pendaftaran->user->nama ?? $pendaftaran->user->name ?? 'Nama tidak tersedia',
                    'full_name' => $pendaftaran->user->nama_lengkap ?? $pendaftaran->user->full_name ?? $pendaftaran->user->nama ?? $pendaftaran->user->name,
                    'jenis_pendaftaran' => 'Sertifikasi Kompetensi',
                    'status' => $pendaftaran->status,
                    'catatan_admin' => $pendaftaran->catatan_admin,
                    'biodata' => [
                        'nama' => $pendaftaran->user->nama ?? $pendaftaran->user->name ?? 'Nama tidak tersedia',
                        'full_name' => $pendaftaran->user->nama_lengkap ?? $pendaftaran->user->full_name ?? $pendaftaran->user->nama ?? $pendaftaran->user->name,
                        'email' => $pendaftaran->user->email ?? 'Email tidak tersedia',
                        'phone' => $pendaftaran->user->telepon ?? $pendaftaran->user->phone ?? $pendaftaran->user->phone_number,
                        'noTelepon' => $pendaftaran->user->telepon ?? $pendaftaran->user->phone ?? $pendaftaran->user->phone_number,
                        'address' => $pendaftaran->user->alamat ?? $pendaftaran->user->address,
                        'alamat' => $pendaftaran->user->alamat ?? $pendaftaran->user->address,
                        'birth_place' => $pendaftaran->user->tempat_lahir ?? $pendaftaran->user->birth_place ?? $pendaftaran->user->place_of_birth,
                        'birth_date' => ($pendaftaran->user->tanggal_lahir ?? $pendaftaran->user->birth_date ?? $pendaftaran->user->date_of_birth) ? 
                            ($pendaftaran->user->tanggal_lahir ?? $pendaftaran->user->birth_date ?? $pendaftaran->user->date_of_birth)->format('d-m-Y') : null,
                        'tempatTanggalLahir' => $this->formatBirthPlaceDate($pendaftaran->user),
                    ],
                    'sertifikasi' => [
                        'namaSertifikasi' => $pendaftaran->sertifikasi->nama_sertifikasi,
                        'batch' => $pendaftaran->batch ? $pendaftaran->batch->nama_batch : null,
                        'jadwalSertifikasi' => $pendaftaran->batch && $pendaftaran->batch->tanggal_mulai ? 
                            $pendaftaran->batch->tanggal_mulai->format('d-m-Y') . ' s/d ' . 
                            ($pendaftaran->batch->tanggal_selesai ? $pendaftaran->batch->tanggal_selesai->format('d-m-Y') : '-') : null,
                        'assessor' => $pendaftaran->sertifikasi->asesor ? $pendaftaran->sertifikasi->asesor->nama_asesor : null,
                    ]
                ];
                
            } else {
                $pendaftaran = PendaftaranPKL::with(['user', 'posisiPKL'])
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

                // Format data untuk PKL
                $formattedData = [
                    'user_id' => $pendaftaran->user->id,
                    'nama' => $pendaftaran->user->nama ?? $pendaftaran->user->name ?? 'Nama tidak tersedia',
                    'full_name' => $pendaftaran->user->nama_lengkap ?? $pendaftaran->user->full_name ?? $pendaftaran->user->nama ?? $pendaftaran->user->name,
                    'jenis_pendaftaran' => 'Praktik Kerja Lapangan',
                    'status' => $pendaftaran->status,
                    'catatan_admin' => $pendaftaran->catatan_admin,
                    'biodata' => [
                        'nama' => $pendaftaran->user->nama ?? $pendaftaran->user->name ?? 'Nama tidak tersedia',
                        'full_name' => $pendaftaran->user->nama_lengkap ?? $pendaftaran->user->full_name ?? $pendaftaran->user->nama ?? $pendaftaran->user->name,
                        'email' => $pendaftaran->user->email ?? 'Email tidak tersedia',
                        'phone' => $pendaftaran->user->telepon ?? $pendaftaran->user->phone ?? $pendaftaran->user->phone_number,
                        'noTelepon' => $pendaftaran->user->telepon ?? $pendaftaran->user->phone ?? $pendaftaran->user->phone_number,
                        'address' => $pendaftaran->user->alamat ?? $pendaftaran->user->address,
                        'alamat' => $pendaftaran->user->alamat ?? $pendaftaran->user->address,
                        'birth_place' => $pendaftaran->user->tempat_lahir ?? $pendaftaran->user->birth_place ?? $pendaftaran->user->place_of_birth,
                        'birth_date' => ($pendaftaran->user->tanggal_lahir ?? $pendaftaran->user->birth_date ?? $pendaftaran->user->date_of_birth) ? 
                            ($pendaftaran->user->tanggal_lahir ?? $pendaftaran->user->birth_date ?? $pendaftaran->user->date_of_birth)->format('d-m-Y') : null,
                        'tempatTanggalLahir' => $this->formatBirthPlaceDate($pendaftaran->user),
                    ],
                    'pkl_info' => [
                        'namaPosisi' => $pendaftaran->posisiPKL ? $pendaftaran->posisiPKL->nama_posisi : 'Belum ditentukan',
                        'perusahaan' => $pendaftaran->posisiPKL ? $pendaftaran->posisiPKL->perusahaan : null,
                        'kategori' => $pendaftaran->posisiPKL ? $pendaftaran->posisiPKL->kategori : null,
                        'tanggal_mulai' => $pendaftaran->posisiPKL && $pendaftaran->posisiPKL->tanggal_mulai ? 
                            $pendaftaran->posisiPKL->tanggal_mulai->format('d-m-Y') : null,
                        'tanggal_selesai' => $pendaftaran->posisiPKL && $pendaftaran->posisiPKL->tanggal_selesai ? 
                            $pendaftaran->posisiPKL->tanggal_selesai->format('d-m-Y') : null,
                    ]
                ];
            }

            \Log::info("pendaftaranDetail success, returning formatted data");
            
            return response()->json($formattedData, 200, [
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
        \Log::info("approvePendaftaran called", [
            'type' => $type,
            'id' => $id,
            'request_data' => $request->all(),
            'content_type' => $request->header('Content-Type'),
            'accepts' => $request->header('Accept')
        ]);
        
        try {
            // Validate that type is correct
            if (!in_array($type, ['sertifikasi', 'pkl'])) {
                \Log::error("Invalid type provided", ['type' => $type]);
                return response()->json([
                    'success' => false,
                    'error' => 'Jenis pendaftaran tidak valid'
                ], 400);
            }
            
            $validated = $request->validate([
                'status' => 'required|in:Disetujui,Ditolak',
                'catatan_admin' => 'nullable|string'
            ]);

            \Log::info("Validation passed", ['validated' => $validated]);

            if ($type === 'sertifikasi') {
                $pendaftaran = PendaftaranSertifikasi::with(['sertifikasi', 'batch'])->find($id);
                
                if (!$pendaftaran) {
                    \Log::error("Pendaftaran sertifikasi not found", ['id' => $id]);
                    return response()->json([
                        'success' => false,
                        'error' => 'Pendaftaran sertifikasi tidak ditemukan'
                    ], 404);
                }
                
                \Log::info("Before update - pendaftaran status", [
                    'current_status' => $pendaftaran->status,
                    'id' => $pendaftaran->id
                ]);
                
                // Jika disetujui, cari atau buat batch aktif untuk sertifikasi
                if ($validated['status'] === 'Disetujui') {
                    $activeBatch = $this->findOrCreateActiveBatch($pendaftaran->sertifikasi_id);
                    $pendaftaran->batch_id = $activeBatch->id;
                }
                
                $pendaftaran->update([
                    'status' => $validated['status'],
                    'catatan_admin' => $validated['catatan_admin'],
                    'tanggal_diproses' => now(),
                    'batch_id' => $pendaftaran->batch_id ?? null
                ]);
                
                \Log::info("After update - pendaftaran status", [
                    'new_status' => $pendaftaran->fresh()->status,
                    'batch_id' => $pendaftaran->fresh()->batch_id
                ]);
                
            } else {
                $pendaftaran = PendaftaranPKL::with(['posisiPKL'])->find($id);
                
                if (!$pendaftaran) {
                    \Log::error("Pendaftaran PKL not found", ['id' => $id]);
                    return response()->json([
                        'success' => false,
                        'error' => 'Pendaftaran PKL tidak ditemukan'
                    ], 404);
                }
                
                \Log::info("Before update - PKL pendaftaran status", [
                    'current_status' => $pendaftaran->status,
                    'id' => $pendaftaran->id
                ]);
                
                $updateData = [
                    'status' => $validated['status'],
                    'catatan_admin' => $validated['catatan_admin'],
                    'tanggal_diproses' => now()
                ];
                
                // Jika disetujui, set tanggal mulai dan selesai berdasarkan durasi magang
                if ($validated['status'] === 'Disetujui' && $pendaftaran->posisiPKL) {
                    $durasiMagang = $pendaftaran->posisiPKL->durasi_bulan;
                    
                    // Set tanggal mulai (minggu depan)
                    $tanggalMulai = now()->addWeek()->startOfWeek();
                    $updateData['tanggal_mulai'] = $tanggalMulai;
                    
                    // Hitung tanggal selesai berdasarkan durasi
                    if ($durasiMagang == 1) {
                        // Jika durasi 1 bulan, anggap project-based (1 bulan penuh)
                        $updateData['tanggal_selesai'] = $tanggalMulai->copy()->addMonth();
                    } else {
                        // Durasi normal sesuai bulan yang ditentukan
                        $updateData['tanggal_selesai'] = $tanggalMulai->copy()->addMonths($durasiMagang);
                    }
                }
                
                $pendaftaran->update($updateData);
                
                \Log::info("After update - PKL pendaftaran status", [
                    'new_status' => $pendaftaran->fresh()->status,
                    'tanggal_mulai' => $pendaftaran->fresh()->tanggal_mulai,
                    'tanggal_selesai' => $pendaftaran->fresh()->tanggal_selesai
                ]);
            }

            $approvalType = $type === 'sertifikasi' ? 'batch aktif' : 'program PKL';
            $message = $validated['status'] === 'Disetujui'
                ? "Pendaftaran berhasil disetujui dan ditambahkan ke {$approvalType}"
                : 'Pendaftaran berhasil ditolak';

            \Log::info("Approval completed successfully", [
                'type' => $type,
                'id' => $id,
                'status' => $validated['status'],
                'message' => $message
            ]);

            // Always return JSON response for AJAX calls
            return response()->json([
                'success' => true,
                'message' => $message
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'error' => 'Data yang dikirim tidak valid: ' . collect($e->errors())->flatten()->implode(', ')
            ], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Log::error('Model not found', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'error' => 'Data pendaftaran tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Approval failed', [
                'error' => $e->getMessage(), 
                'trace' => $e->getTraceAsString(),
                'type' => $type,
                'id' => $id
            ]);
            return response()->json([
                'success' => false,
                'error' => 'Gagal memperbarui status: ' . $e->getMessage()
            ], 500);
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

    private function formatBirthPlaceDate($user)
    {
        $birthPlace = $user->tempat_lahir ?? $user->birth_place ?? $user->place_of_birth;
        $birthDate = $user->tanggal_lahir ?? $user->birth_date ?? $user->date_of_birth;
        
        if ($birthPlace && $birthDate) {
            if (is_string($birthDate)) {
                return $birthPlace . ', ' . $birthDate;
            } else {
                return $birthPlace . ', ' . $birthDate->format('d-m-Y');
            }
        } elseif ($birthPlace) {
            return $birthPlace;
        } elseif ($birthDate) {
            if (is_string($birthDate)) {
                return $birthDate;
            } else {
                return $birthDate->format('d-m-Y');
            }
        }
        
        return '-';
    }
}
