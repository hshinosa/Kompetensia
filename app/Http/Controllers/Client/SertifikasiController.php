<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\PendaftaranSertifikasiRequest;
use App\Http\Resources\PendaftaranSertifikasiResource;
use App\Services\PendaftaranSertifikasiService;
use App\Services\SertifikasiService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Inertia\Inertia;

class SertifikasiController extends Controller
{
    protected $pendaftaranSertifikasiService;
    protected $sertifikasiService;

    public function __construct(
        PendaftaranSertifikasiService $pendaftaranSertifikasiService,
        SertifikasiService $sertifikasiService
    ) {
        $this->pendaftaranSertifikasiService = $pendaftaranSertifikasiService;
        $this->sertifikasiService = $sertifikasiService;
    }
    public function index()
    {
        try {
            $user = auth()->guard('client')->user();
            
            if (!$user) {
                return redirect()->route('client.login');
            }
            
            // Get only approved sertifikasi registrations for this user
            $approvedSertifikasi = \App\Models\PendaftaranSertifikasi::where('user_id', $user->id)
                ->where('status', 'Disetujui')
                ->with(['sertifikasi.batch' => function($query) {
                    $query->where('status', 'Aktif');
                }, 'batch'])
                ->get()
                ->map(function ($pendaftaran) {
                    $sertifikasi = $pendaftaran->sertifikasi;
                    $batch = $pendaftaran->batch;
                    
                    if (!$sertifikasi) return null;
                    
                    return [
                        'id' => $sertifikasi->id,
                        'nama_sertifikasi' => $sertifikasi->nama_sertifikasi,
                        'jenis_sertifikasi' => $sertifikasi->jenis_sertifikasi,
                        'deskripsi' => $sertifikasi->deskripsi,
                        'batch' => $batch ? $batch->nama_batch : 'Batch akan ditentukan',
                        'tanggal_mulai' => $batch ? $batch->tanggal_mulai->format('d M Y') : null,
                        'status_pendaftaran' => $pendaftaran->status,
                        'can_upload' => true // User can upload documents for approved certifications
                    ];
                })
                ->filter()
                ->values();
            
            return Inertia::render('client/sertifikasi/index', [
                'sertifikasiTerdaftar' => $approvedSertifikasi
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading user sertifikasi: ' . $e->getMessage());
            return Inertia::render('client/sertifikasi/index', [
                'sertifikasiTerdaftar' => []
            ]);
        }
    }

    public function show($id)
    {
        try {
            $user = auth()->guard('client')->user();
            
            if (!$user) {
                return redirect()->route('client.login');
            }
            
            // Get sertifikasi directly since it's already approved
            $sertifikasi = \App\Models\Sertifikasi::findOrFail($id);
            
            // Get active batch for this sertifikasi (hasMany relationship)
            $batch = $sertifikasi->batch()->where('status', 'Aktif')->first() 
                     ?? $sertifikasi->batch()->first(); // fallback to first batch if no active batch
            
            // Optional: Check if user has registration (for reference only)
            $pendaftaran = \App\Models\PendaftaranSertifikasi::where('user_id', $user->id)
                ->where('sertifikasi_id', $id)
                ->where('status', 'Disetujui')
                ->with(['sertifikasi.batch', 'batch'])
                ->first();
            
            // Get upload history for this user and sertifikasi, preferring uploads linked to their registration
            if ($pendaftaran) {
                // If user has a registration, get uploads linked to that registration
                $uploadHistory = \App\Models\UploadTugasSertifikasi::where('pendaftaran_id', $pendaftaran->id)
                    ->orderBy('created_at', 'desc')
                    ->get();
            } else {
                // Fallback: get uploads by user_id and sertifikasi_id (for backwards compatibility)
                $uploadHistory = \App\Models\UploadTugasSertifikasi::where('user_id', $user->id)
                    ->where('sertifikasi_id', $id)
                    ->whereNull('pendaftaran_id') // Only get orphaned uploads
                    ->orderBy('created_at', 'desc')
                    ->get();
            }
            
            // Get existing review from this user for this sertifikasi
            $existingReview = \App\Models\ReviewSertifikasi::where('user_id', $user->id)
                ->where('sertifikasi_id', $id)
                ->first();
            
            return Inertia::render('client/sertifikasi/detail', [
                'sertifikasi' => [
                    'id' => $sertifikasi->id,
                    'nama' => $sertifikasi->nama_sertifikasi,
                    'deskripsi' => $sertifikasi->deskripsi,
                    'batch' => $batch ? $batch->nama_batch : 'Batch akan ditentukan',
                    'tanggal' => $batch ? $batch->tanggal_mulai->format('d M Y') : null
                ],
                'pendaftaran' => $pendaftaran ? [
                    'id' => $pendaftaran->id,
                    'status' => $pendaftaran->status
                ] : null,
                'uploadedDocuments' => $uploadHistory->map(function($upload, $index) {
                    return [
                        'no' => $index + 1,
                        'tanggal' => $upload->created_at->format('Y-m-d'),
                        'judul_tugas' => $upload->judul_tugas,
                        'nama_file' => $upload->nama_file ?? 'File tidak tersedia',
                        'disetujui' => $upload->status === 'approved' ? true : ($upload->status === 'rejected' ? false : null), // null for pending
                        'status' => $upload->status, // Add raw status for frontend to use
                        'keterangan' => $upload->feedback ?? 'Tidak ada keterangan', // Use feedback as keterangan
                        'feedback' => $upload->feedback,
                        'link_url' => $upload->link_url
                    ];
                }),
                'existingReview' => $existingReview ? [
                    'id' => $existingReview->id,
                    'rating' => $existingReview->rating,
                    'review' => $existingReview->review,
                    'created_at' => $existingReview->created_at->format('d M Y H:i')
                ] : null
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error loading sertifikasi detail: ' . $e->getMessage());
            return redirect()->route('client.sertifikasi')->with('error', 'Sertifikasi tidak ditemukan');
        }
    }

    public function showUploadDokumen($id)
    {
        try {
            $user = auth()->guard('client')->user();
            
            if (!$user) {
                return redirect()->route('client.login');
            }
            
            // Check if user has approved registration for this sertifikasi
            $pendaftaran = \App\Models\PendaftaranSertifikasi::where('user_id', $user->id)
                ->where('sertifikasi_id', $id)
                ->where('status', 'Disetujui')
                ->with(['sertifikasi.batch', 'batch'])
                ->first();
            
            if (!$pendaftaran) {
                return redirect()->route('client.sertifikasi')->with('error', 'Anda belum terdaftar atau belum disetujui untuk sertifikasi ini');
            }
            
            $sertifikasi = $pendaftaran->sertifikasi;
            $batch = $pendaftaran->batch;
            
            return Inertia::render('client/sertifikasi/upload-dokumen', [
                'sertifikasi' => [
                    'id' => $sertifikasi->id,
                    'nama_sertifikasi' => $sertifikasi->nama_sertifikasi,
                    'jenis_sertifikasi' => $sertifikasi->jenis_sertifikasi,
                    'deskripsi' => $sertifikasi->deskripsi,
                    'batch' => $batch ? $batch->nama_batch : 'Batch akan ditentukan',
                    'tanggal_mulai' => $batch ? $batch->tanggal_mulai->format('d M Y') : null
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading upload dokumen page: ' . $e->getMessage());
            return redirect()->route('client.sertifikasi')->with('error', 'Sertifikasi tidak ditemukan');
        }
    }

    public function uploadTugas(Request $request, $id)
    {
        try {
            $user = auth()->guard('client')->user();
            
            if (!$user) {
                return redirect()->back()->with('error', 'Unauthorized');
            }
            
            // Validate request
            $request->validate([
                'judul_tugas' => 'required|string|max:255',
                'link_url' => 'nullable|url',
                'file' => 'nullable|file|mimes:pdf,doc,docx,zip,rar|max:10240' // 10MB max
            ]);
            
            // Validate that at least one of link_url or file is provided
            if (!$request->link_url && !$request->hasFile('file')) {
                return redirect()->back()->withErrors(['upload' => 'Anda harus mengisi link URL atau upload file'])->withInput();
            }
            
            // Find the user's registration for this certification
            $pendaftaran = \App\Models\PendaftaranSertifikasi::where('user_id', $user->id)
                ->where('sertifikasi_id', $id)
                ->where('status', 'Disetujui')
                ->first();
            
            $uploadData = [
                'user_id' => $user->id,
                'sertifikasi_id' => $id,
                'pendaftaran_id' => $pendaftaran ? $pendaftaran->id : null, // Link to the registration if found
                'judul_tugas' => $request->judul_tugas,
                'link_url' => $request->link_url,
                'tanggal_upload' => now(),
                'status' => 'pending'
            ];
            
            // Handle file upload if provided
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $originalName = $file->getClientOriginalName();
                $fileName = time() . '_' . $originalName;
                $filePath = $file->storeAs('uploads/tugas_sertifikasi', $fileName, 'public');
                
                $uploadData['nama_file'] = $originalName;
                $uploadData['path_file'] = $filePath;
                $uploadData['ukuran_file'] = $file->getSize();
                $uploadData['tipe_mime'] = $file->getClientMimeType();
            }
            
            // Create upload record
            $upload = \App\Models\UploadTugasSertifikasi::create($uploadData);
            
            return redirect()->back()->with('success', 'Tugas berhasil diunggah dan akan dikurasi oleh admin');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            \Log::error('Error uploading tugas: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat mengunggah tugas')->withInput();
        }
    }

    /**
     * Store pendaftaran sertifikasi
     */
    public function storePendaftaran(PendaftaranSertifikasiRequest $request): JsonResponse
    {
        try {
            \Log::info('CSRF Token from request: ' . $request->header('X-CSRF-TOKEN'));
            \Log::info('Session token: ' . $request->session()->token());
            
            $user = auth()->guard('client')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak terautentikasi'
                ], Response::HTTP_UNAUTHORIZED);
            }

            $pendaftaran = $this->pendaftaranSertifikasiService->createPendaftaran(
                $request->validated(),
                $user
            );

            return response()->json([
                'success' => true,
                'message' => 'Pendaftaran sertifikasi berhasil dibuat',
                'data' => new PendaftaranSertifikasiResource($pendaftaran)
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            \Log::error('Error in storePendaftaran: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat pendaftaran sertifikasi',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get detailed registration information for a Sertifikasi registration
     */
    public function getRegistrationDetail(int $id): JsonResponse
    {
        try {
            $user = auth()->guard('client')->user();
            $registration = $this->pendaftaranSertifikasiService->getDetailById($id);

            if (!$registration) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pendaftaran tidak ditemukan'
                ], 404);
            }

            // Check if this registration belongs to the authenticated user
            if ($registration->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $registration->id,
                    'jenis_pengajuan' => 'Sertifikasi Kompetensi',
                    'status' => $registration->status,
                    'tanggal_pendaftaran' => $registration->created_at->format('d-m-Y'),
                    'sertifikasi' => $registration->sertifikasi ? [
                        'nama_sertifikasi' => $registration->sertifikasi->nama_sertifikasi,
                        'jenis_sertifikasi' => $registration->sertifikasi->jenis_sertifikasi,
                        'deskripsi' => $registration->sertifikasi->deskripsi,
                    ] : null,
                    'batch' => $registration->batch ? [
                        'nama_batch' => $registration->batch->nama_batch,
                        'tanggal_mulai' => $registration->batch->tanggal_mulai->format('d-m-Y'),
                        'tanggal_selesai' => $registration->batch->tanggal_selesai->format('d-m-Y'),
                    ] : null,
                    'data_diri' => [
                        'nama_lengkap' => $registration->nama_lengkap,
                        'email' => $registration->email,
                        'nomor_telepon' => $registration->no_telp,
                    ],
                    'motivasi' => [
                        'motivasi_mengikuti' => $registration->motivasi,
                    ],
                    'berkas_persyaratan' => $registration->berkas_persyaratan,
                    'catatan_admin' => $registration->catatan_admin,
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error getting Sertifikasi registration detail: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil detail pendaftaran'
            ], 500);
        }
    }

    public function submitReview(Request $request, $id)
    {
        try {
            $user = auth()->guard('client')->user();
            
            if (!$user) {
                return redirect()->back()->withErrors(['error' => 'User tidak terautentikasi']);
            }

            // Validate request
            $request->validate([
                'rating' => 'required|integer|min:1|max:5',
                'review' => 'required|string|max:1000'
            ]);

            // Check if user has any approved tasks for this sertifikasi
            $hasApprovedTasks = \App\Models\UploadTugasSertifikasi::where('user_id', $user->id)
                ->where('sertifikasi_id', $id)
                ->where('status', 'approved')
                ->exists();

            if (!$hasApprovedTasks) {
                return redirect()->back()->withErrors(['error' => 'Anda harus menyelesaikan tugas sertifikasi terlebih dahulu untuk memberikan ulasan']);
            }

            // Check if user already submitted a review
            $existingReview = \App\Models\ReviewSertifikasi::where('user_id', $user->id)
                ->where('sertifikasi_id', $id)
                ->first();

            if ($existingReview) {
                // Update existing review
                $existingReview->update([
                    'rating' => $request->rating,
                    'review' => $request->review,
                    'updated_at' => now()
                ]);
                $message = 'Ulasan Anda berhasil diperbarui!';
            } else {
                // Create new review
                \App\Models\ReviewSertifikasi::create([
                    'user_id' => $user->id,
                    'sertifikasi_id' => $id,
                    'rating' => $request->rating,
                    'review' => $request->review,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                $message = 'Terima kasih! Ulasan Anda berhasil dikirim.';
            }

            return redirect()->back()->with('success', $message);

        } catch (\Exception $e) {
            \Log::error('Error submitting review: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat mengirim ulasan. Silakan coba lagi.']);
        }
    }
}
