<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Services\PKLService;
use App\Services\PendaftaranPKLService;
use App\Http\Requests\PendaftaranPKLRequest;
use App\Models\UploadDokumenPKL;
use App\Models\PendaftaranPKL;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PKLController extends Controller
{
    protected $pklService;
    protected $pendaftaranPKLService;

    public function __construct(PKLService $pklService, PendaftaranPKLService $pendaftaranPKLService)
    {
        $this->pklService = $pklService;
        $this->pendaftaranPKLService = $pendaftaranPKLService;
    }

    /**
     * Display a listing of PKL programs for the client.
     */
    public function index(): Response
    {
        try {
            $user = auth()->guard('client')->user();
            
            if (!$user) {
                return Inertia::render('client/pkl/index', [
                    'pklPrograms' => []
                ]);
            }

            // Get user's approved PKL registrations
            $approvedRegistrations = PendaftaranPKL::with(['posisiPKL'])
                ->where('user_id', $user->id)
                ->where('status', 'Disetujui')
                ->get();

            // Transform the data to match the expected frontend format
            $pklPrograms = $approvedRegistrations->map(function ($registration) {
                $posisi = $registration->posisiPKL;
                return [
                    'id' => $posisi->id,
                    'nama_posisi' => $posisi->nama_posisi,
                    'kategori' => $posisi->kategori,
                    'deskripsi' => $posisi->deskripsi,
                    'persyaratan' => $posisi->persyaratan,
                    'benefits' => $posisi->benefits,
                    'tipe' => $posisi->tipe,
                    'durasi_bulan' => $posisi->durasi_bulan,
                    'jumlah_pendaftar' => $posisi->jumlah_pendaftar,
                    'status' => $posisi->status,
                    'created_by' => $posisi->created_by,
                    'created_at' => $posisi->created_at,
                    'updated_at' => $posisi->updated_at,
                    // Additional registration info
                    'registration_id' => $registration->id,
                    'registration_status' => $registration->status,
                    'tanggal_pendaftaran' => $registration->tanggal_pendaftaran,
                    'tanggal_mulai' => $registration->tanggal_mulai,
                    'tanggal_selesai' => $registration->tanggal_selesai,
                ];
            })->toArray();
            
            return Inertia::render('client/pkl/index', [
                'pklPrograms' => $pklPrograms
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading user PKL programs: ' . $e->getMessage());
            return Inertia::render('client/pkl/index', [
                'pklPrograms' => []
            ]);
        }
    }

    /**
     * Display the specified PKL program detail.
     */
    public function show(string $id): Response
    {
        try {
            $user = auth()->guard('client')->user();
            $pkl = $this->pklService->detail((int)$id);
            
            // Get user's PKL registration for this program
            $pendaftaran = null;
            $uploadedDocuments = [];
            
            if ($user) {
                $pendaftaran = PendaftaranPKL::where('user_id', $user->id)
                    ->where('posisi_pkl_id', $id)
                    ->where('status', 'Disetujui')
                    ->first();
                
                if ($pendaftaran) {
                    $uploadedDocuments = UploadDokumenPKL::where('pendaftaran_id', $pendaftaran->id)
                        ->orderBy('tanggal_upload', 'desc')
                        ->get()
                        ->map(function ($doc, $index) {
                            return [
                                'no' => $index + 1,
                                'tanggal' => $doc->tanggal_upload->format('Y-m-d'),
                                'jenis_dokumen' => $doc->jenis_dokumen_text,
                                'dokumen' => $doc->file_name,
                                'disetujui' => $doc->status === 'approved',
                                'keterangan' => $doc->keterangan,
                                'feedback' => $doc->feedback,
                                'assessor' => $doc->assessor,
                            ];
                        });
                }
            }
            
            return Inertia::render('client/pkl/detail', [
                'pkl' => $pkl,
                'pendaftaran' => $pendaftaran,
                'uploadedDocuments' => $uploadedDocuments
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading PKL detail: ' . $e->getMessage());
            return redirect()->route('client.pkl')->with('error', 'Program PKL tidak ditemukan');
        }
    }

    /**
     * Show PKL registration form - now supports selection from dropdown.
     */
    public function showPendaftaran(Request $request): Response
    {
        try {
            $user = auth()->guard('client')->user();
            
            // Get all active PKL positions for dropdown selection in step 3
            $allPosisiPKL = $this->pklService->list(['status' => 'Aktif'], 100);
            
            // Get user's existing PKL registrations to prevent duplicates
            $existingRegistrations = [];
            if ($user) {
                $existingRegistrations = PendaftaranPKL::where('user_id', $user->id)
                    ->whereIn('status', ['Pengajuan', 'Disetujui', 'Menunggu'])
                    ->pluck('posisi_pkl_id')
                    ->toArray();
            }
            
            // Transform data for frontend
            $transformedPosisi = collect($allPosisiPKL->items())->map(function ($posisi) use ($existingRegistrations) {
                return [
                    'id' => $posisi['id'],
                    'nama_posisi' => $posisi['nama_posisi'],
                    'kategori' => $posisi['kategori'],
                    'tipe' => $posisi['tipe'],
                    'durasi_bulan' => $posisi['durasi_bulan'],
                    'already_registered' => in_array($posisi['id'], $existingRegistrations),
                ];
            })->toArray();
            
            return Inertia::render('client/PendaftaranPKLPage', [
                'allPosisiPKL' => $transformedPosisi,
                'existingRegistrations' => $existingRegistrations
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading PKL positions for registration: ' . $e->getMessage());
            
            return Inertia::render('client/PendaftaranPKLPage', [
                'allPosisiPKL' => []
            ]);
        }
    }

    /**
     * Store PKL registration.
     */
    public function storePendaftaran(PendaftaranPKLRequest $request)
    {
        try {
            \Log::info('=== PKL REGISTRATION START ===', [
                'timestamp' => now()->toISOString(),
                'request_method' => $request->method(),
                'request_url' => $request->fullUrl(),
                'user_authenticated' => auth()->guard('client')->check(),
                'request_data_keys' => array_keys($request->all()),
                'request_data_count' => count($request->all())
            ]);

            $user = auth()->guard('client')->user();
            
            if (!$user) {
                \Log::error('PKL Registration failed: User not authenticated', [
                    'guards_tried' => ['client'],
                    'session_id' => session()->getId(),
                    'ip_address' => $request->ip()
                ]);
                return back()->withErrors(['error' => 'User tidak terautentikasi']);
            }

            \Log::info('PKL Registration: User authenticated', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'user_name' => $user->nama
            ]);

            // Log the raw request data for debugging
            \Log::info('PKL Registration: Raw request data', [
                'raw_data' => $request->all(),
                'has_file_data' => [
                    'cv_file_path' => !empty($request->cv_file_path),
                    'cv_file_name' => !empty($request->cv_file_name),
                    'portfolio_file_path' => !empty($request->portfolio_file_path),
                    'portfolio_file_name' => !empty($request->portfolio_file_name)
                ]
            ]);

            // Validate the data
            \Log::info('PKL Registration: Starting validation');
            $validatedData = $request->validated();
            \Log::info('PKL Registration: Validation successful', [
                'validated_fields_count' => count($validatedData),
                'validated_keys' => array_keys($validatedData)
            ]);

            // Try to create the registration
            \Log::info('PKL Registration: Creating registration via service');
            $pendaftaran = $this->pendaftaranPKLService->createPendaftaran(
                $validatedData,
                $user
            );

            \Log::info('PKL Registration: Registration created successfully', [
                'pendaftaran_id' => $pendaftaran->id,
                'pendaftaran_status' => $pendaftaran->status,
                'pendaftaran_date' => $pendaftaran->tanggal_pendaftaran
            ]);

            // Return success response for Inertia
            \Log::info('PKL Registration: Returning success response');
            return back()->with([
                'success' => true,
                'message' => 'Pendaftaran PKL berhasil dibuat. Pendaftaran Anda akan segera ditinjau oleh admin.',
                'pendaftaran_data' => [
                    'id' => $pendaftaran->id,
                    'status' => $pendaftaran->status,
                    'tanggal_pendaftaran' => $pendaftaran->tanggal_pendaftaran
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('PKL Registration: Validation failed', [
                'validation_errors' => $e->errors(),
                'failed_rules' => $e->validator->failed() ?? 'Unknown'
            ]);
            
            return back()->withErrors($e->errors())->withInput();
            
        } catch (\Exception $e) {
            \Log::error('PKL Registration: Unexpected error', [
                'error_message' => $e->getMessage(),
                'error_code' => $e->getCode(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'stack_trace' => $e->getTraceAsString(),
                'request_data_summary' => [
                    'posisi_pkl_id' => $request->posisi_pkl_id ?? 'missing',
                    'nama_lengkap' => $request->nama_lengkap ?? 'missing',
                    'email_pendaftar' => $request->email_pendaftar ?? 'missing'
                ]
            ]);
            
            return back()->withErrors([
                'error' => 'Terjadi kesalahan dalam memproses pendaftaran: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Transform frontend form field names to backend database field names.
     */
    private function transformFormData(array $data): array
    {
        $fieldMapping = [
            'namaLengkap' => 'nama_lengkap',
            'tempatLahir' => 'tempat_lahir',
            'tanggalLahir' => 'tanggal_lahir',
            'email' => 'email_pendaftar',
            'nomorHandphone' => 'nomor_handphone',
            'memilikiLaptop' => 'memiliki_laptop',
            'memilikiKameraDSLR' => 'memiliki_kamera_dslr',
            'transportasiOperasional' => 'transportasi_operasional',
            'asalSekolah' => 'asal_sekolah',
            'programStudi' => 'program_studi',
            'awalPKL' => 'awal_pkl',
            'akhirPKL' => 'akhir_pkl',
            'kemampuanDitingkatkan' => 'kemampuan_ditingkatkan',
            'skillKelebihan' => 'skill_kelebihan',
            'bidangYangDisukai' => 'bidang_yang_disukai',
            'pernahMembuatVideo' => 'pernah_membuat_video',
            'sudahMelihatProfil' => 'sudah_melihat_profil',
            'tingkatMotivasi' => 'tingkat_motivasi',
            'nilaiDiri' => 'nilai_diri',
            'apakahMerokok' => 'apakah_merokok',
            'bersediaDitempatkan' => 'bersedia_ditempatkan',
            'bersediaMasuk2Kali' => 'bersedia_masuk_2_kali',
        ];

        $transformedData = [];
        
        foreach ($data as $key => $value) {
            $backendKey = $fieldMapping[$key] ?? $key;
            $transformedData[$backendKey] = $value;
        }

        return $transformedData;
    }

    /**
     * Get detailed registration information for a PKL registration
     */
    public function getRegistrationDetail(int $id): JsonResponse
    {
        \Log::info("=== PKL DETAIL REQUEST START ===");
        \Log::info("Request ID: " . $id);
        \Log::info("Auth user: " . (auth()->guard('client')->id() ?? 'NULL'));
        
        try {
            $user = auth()->guard('client')->user();
            \Log::info("User authenticated: " . ($user ? 'YES' : 'NO'));
            
            $registration = $this->pendaftaranPKLService->getDetailById($id);
            \Log::info("Registration found: " . ($registration ? 'YES' : 'NO'));

            if (!$registration) {
                \Log::error("Registration not found for ID: " . $id);
                return response()->json([
                    'success' => false,
                    'message' => 'Pendaftaran tidak ditemukan'
                ], 404);
            }

            \Log::info("Registration user_id: " . $registration->user_id);
            \Log::info("Current user_id: " . ($user ? $user->id : 'NULL'));

            // Check if this registration belongs to the authenticated user
            if ($registration->user_id !== $user->id) {
                \Log::error("Access denied - user mismatch");
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak'
                ], 403);
            }

            \Log::info("Building response data...");
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $registration->id,
                    'jenis_pengajuan' => 'Praktik Kerja Lapangan',
                    'status' => $registration->status,
                    'tanggal_pendaftaran' => $registration->created_at->format('d-m-Y'),
                    'posisi_pkl' => $registration->posisiPKL ? [
                        'nama_posisi' => $registration->posisiPKL->nama_posisi,
                        'kategori' => $registration->posisiPKL->kategori,
                        'tipe' => $registration->posisiPKL->tipe,
                        'durasi_bulan' => $registration->posisiPKL->durasi_bulan,
                    ] : null,
                    'data_diri' => [
                        // Use PKL table data, fallback to user basic info if needed
                        'nama_lengkap' => $registration->nama_lengkap ?: ($registration->user ? $registration->user->nama_lengkap : null),
                        'email' => $registration->email_pendaftar ?: ($registration->user ? $registration->user->email : null),
                        'nomor_telepon' => $registration->nomor_handphone ?: ($registration->user ? $registration->user->telepon : null),
                        'tempat_lahir' => $registration->tempat_lahir,
                        'tanggal_lahir' => $registration->tanggal_lahir,
                        'alamat_lengkap' => $registration->alamat,
                        'instagram' => $registration->instagram,
                        'tiktok' => $registration->tiktok,
                    ],
                    'background_pendidikan' => [
                        'institusi_asal' => $registration->institusi_asal,
                        'asal_sekolah' => $registration->asal_sekolah,
                        'jurusan' => $registration->jurusan,
                        'kelas' => $registration->kelas,
                        'program_studi' => $registration->program_studi,
                        'semester' => $registration->semester,
                        'awal_pkl' => $registration->awal_pkl,
                        'akhir_pkl' => $registration->akhir_pkl,
                    ],
                    'skill_minat' => [
                        'kemampuan_ditingkatkan' => $registration->kemampuan_ditingkatkan,
                        'skill_kelebihan' => $registration->skill_kelebihan,
                        'pernah_membuat_video' => $registration->pernah_membuat_video === 'ya' ? 'Ya' : ($registration->pernah_membuat_video === 'tidak' ? 'Tidak' : null),
                    ],
                    'motivasi_pkl' => [
                        'motivasi' => $registration->motivasi,
                        'tingkat_motivasi' => $registration->tingkat_motivasi,
                        'nilai_diri' => $registration->nilai_diri,
                    ],
                    'persyaratan_khusus' => [
                        'memiliki_laptop' => $registration->memiliki_laptop === 'ya' ? 'Ya' : ($registration->memiliki_laptop === 'tidak' ? 'Tidak' : null),
                        'memiliki_kamera_dslr' => $registration->memiliki_kamera_dslr === 'ya' ? 'Ya' : ($registration->memiliki_kamera_dslr === 'tidak' ? 'Tidak' : null),
                        'transportasi_operasional' => $registration->transportasi_operasional,
                        'apakah_merokok' => $registration->apakah_merokok === 'ya' ? 'Ya' : ($registration->apakah_merokok === 'tidak' ? 'Tidak' : null),
                        'bersedia_ditempatkan' => $registration->bersedia_ditempatkan === 'ya' ? 'Ya' : ($registration->bersedia_ditempatkan === 'tidak' ? 'Tidak' : null),
                        'bersedia_masuk_2_kali' => $registration->bersedia_masuk_2_kali === 'ya' ? 'Ya' : ($registration->bersedia_masuk_2_kali === 'tidak' ? 'Tidak' : null),
                    ],
                    'berkas' => [
                        'cv_file_name' => $registration->cv_file_name,
                        'portfolio_file_name' => $registration->portfolio_file_name,
                        'berkas_persyaratan' => $registration->berkas_persyaratan,
                    ],
                    'catatan_admin' => $registration->catatan_admin,
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error getting PKL registration detail: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil detail pendaftaran'
            ], 500);
        }
    }

    /**
     * Handle document upload for PKL program.
     */
    public function uploadDocument(Request $request, string $id): JsonResponse
    {
        try {
            $user = auth()->guard('client')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak terautentikasi'
                ], 401);
            }

            // Validate request
            $request->validate([
                'jenis_dokumen' => 'required|string|in:proposal,laporan-mingguan,laporan-akhir,evaluasi',
                'link_url' => 'required|url',
                'file' => 'required|file|mimes:pdf,doc,docx,zip,rar|max:10240', // 10MB max
            ]);

            // Check if user has approved registration for this PKL
            $pendaftaran = PendaftaranPKL::where('user_id', $user->id)
                ->where('posisi_pkl_id', $id)
                ->where('status', 'Disetujui')
                ->first();

            if (!$pendaftaran) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda belum memiliki pendaftaran PKL yang disetujui untuk program ini'
                ], 403);
            }

            // Handle file upload
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('pkl_documents', $fileName, 'public');

            // Create upload record
            $upload = UploadDokumenPKL::create([
                'pendaftaran_id' => $pendaftaran->id,
                'user_id' => $user->id,
                'jenis_dokumen' => $request->jenis_dokumen,
                'link_url' => $request->link_url,
                'file_name' => $fileName,
                'file_path' => $filePath,
                'file_size' => $file->getSize(),
                'file_type' => $file->getClientMimeType(),
                'status' => 'pending',
                'keterangan' => 'Dokumen berhasil diunggah, menunggu review admin',
                'tanggal_upload' => now(),
            ]);

            Log::info('PKL document uploaded successfully', [
                'upload_id' => $upload->id,
                'user_id' => $user->id,
                'pendaftaran_id' => $pendaftaran->id,
                'file_name' => $fileName
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Dokumen berhasil diunggah! Dokumen akan ditinjau oleh admin.',
                'data' => [
                    'id' => $upload->id,
                    'status' => $upload->status,
                    'file_name' => $upload->file_name,
                    'tanggal_upload' => $upload->tanggal_upload->format('Y-m-d H:i:s')
                ]
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data yang dikirim tidak valid',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error uploading PKL document: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengunggah dokumen. Silakan coba lagi.'
            ], 500);
        }
    }

    /**
     * Download uploaded document.
     */
    public function downloadDocument(string $uploadId): \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
    {
        try {
            $user = auth()->guard('client')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak terautentikasi'
                ], 401);
            }

            $upload = UploadDokumenPKL::where('id', $uploadId)
                ->where('user_id', $user->id)
                ->first();

            if (!$upload) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dokumen tidak ditemukan'
                ], 404);
            }

            if (!Storage::disk('public')->exists($upload->file_path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File tidak ditemukan di server'
                ], 404);
            }

            return response()->download(
                Storage::disk('public')->path($upload->file_path),
                $upload->file_name
            );

        } catch (\Exception $e) {
            Log::error('Error downloading PKL document: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengunduh dokumen'
            ], 500);
        }
    }
}
