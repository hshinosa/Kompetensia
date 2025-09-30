<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PendaftaranPKLRequest;
use App\Http\Resources\PendaftaranPKLResource;
use App\Http\Resources\PendaftaranPKLCollection;
use App\Services\PendaftaranPKLService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PendaftaranPKLController extends Controller
{
    protected PendaftaranPKLService $pendaftaranPKLService;

    public function __construct(PendaftaranPKLService $pendaftaranPKLService)
    {
        $this->pendaftaranPKLService = $pendaftaranPKLService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->get('per_page', 15);
            $status = $request->get('status');
            $search = $request->get('search');
            $posisiId = $request->get('posisi_pkl_id');
            
            $pendaftaran = $this->pendaftaranPKLService->getAllPendaftaran(
                $perPage,
                $status,
                $search,
                $posisiId
            );

            return response()->json(
                new PendaftaranPKLCollection($pendaftaran),
                Response::HTTP_OK
            );
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pendaftaran PKL',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PendaftaranPKLRequest $request): JsonResponse
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

            $pendaftaran = $this->pendaftaranPKLService->createPendaftaran(
                $request->validated(),
                $user
            );

            return response()->json([
                'success' => true,
                'message' => 'Pendaftaran PKL berhasil dibuat',
                'data' => new PendaftaranPKLResource($pendaftaran)
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            \Log::error('Error in PKL store: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat pendaftaran PKL',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $pendaftaran = $this->pendaftaranPKLService->getPendaftaranById($id);

            if (!$pendaftaran) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pendaftaran PKL tidak ditemukan'
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data pendaftaran PKL berhasil diambil',
                'data' => new PendaftaranPKLResource($pendaftaran)
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pendaftaran PKL',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PendaftaranPKLRequest $request, int $id): JsonResponse
    {
        try {
            $pendaftaran = $this->pendaftaranPKLService->updatePendaftaran(
                $id,
                $request->validated()
            );

            if (!$pendaftaran) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pendaftaran PKL tidak ditemukan'
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'message' => 'Pendaftaran PKL berhasil diperbarui',
                'data' => new PendaftaranPKLResource($pendaftaran)
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui pendaftaran PKL',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update status pendaftaran
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|string|in:menunggu_verifikasi,diterima,ditolak,sedang_berlangsung,selesai',
            'catatan_admin' => 'nullable|string|max:1000',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai'
        ]);

        try {
            $pendaftaran = $this->pendaftaranPKLService->updateStatus(
                $id,
                $request->status,
                $request->catatan_admin,
                $request->tanggal_mulai,
                $request->tanggal_selesai
            );

            if (!$pendaftaran) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pendaftaran PKL tidak ditemukan'
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'message' => 'Status pendaftaran PKL berhasil diperbarui',
                'data' => new PendaftaranPKLResource($pendaftaran)
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status pendaftaran PKL',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $deleted = $this->pendaftaranPKLService->deletePendaftaran($id);

            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pendaftaran PKL tidak ditemukan'
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'message' => 'Pendaftaran PKL berhasil dihapus'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus pendaftaran PKL',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get pendaftaran by user
     */
    public function getByUser(): JsonResponse
    {
        try {
            $user = auth()->guard('client')->user();
            $pendaftaran = $this->pendaftaranPKLService->getByUser($user);

            return response()->json([
                'success' => true,
                'message' => 'Data pendaftaran PKL user berhasil diambil',
                'data' => PendaftaranPKLResource::collection($pendaftaran)
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pendaftaran PKL user',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get pendaftaran by posisi PKL
     */
    public function getByPosisi(int $posisiId): JsonResponse
    {
        try {
            $pendaftaran = $this->pendaftaranPKLService->getPendaftaranByPosisi($posisiId);

            return response()->json([
                'success' => true,
                'message' => 'Data pendaftaran PKL berhasil diambil',
                'data' => PendaftaranPKLResource::collection($pendaftaran)
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pendaftaran PKL',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get statistics for dashboard
     */
    public function getStatistics(): JsonResponse
    {
        try {
            $statistics = $this->pendaftaranPKLService->getStatistics();

            return response()->json([
                'success' => true,
                'message' => 'Statistik pendaftaran PKL berhasil diambil',
                'data' => $statistics
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil statistik pendaftaran PKL',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Upload document for PKL registration
     */
    public function uploadDocument(Request $request): JsonResponse
    {
        try {
            // === DETAILED LOGGING FOR DOCUMENT UPLOAD ===
            \Log::info('=== DOCUMENT UPLOAD REQUEST RECEIVED ===', [
                'timestamp' => now()->toDateTimeString(),
                'user_authenticated' => auth()->guard('client')->check(),
                'user_id' => auth()->guard('client')->id(),
                'request_method' => $request->method(),
                'request_url' => $request->fullUrl()
            ]);
            
            $request->validate([
                'file' => 'required|file|mimes:pdf,doc,docx|max:5120', // 5MB max
                'jenis_dokumen' => 'required|string|in:cv,portfolio'
            ]);

            $file = $request->file('file');
            $jenisDokumen = $request->input('jenis_dokumen');
            
            // Log file details - MAIN FOCUS
            \Log::info('FILE UPLOAD DETAILS:', [
                'jenis_dokumen' => $jenisDokumen,
                'original_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'file_mime_type' => $file->getMimeType(),
                'file_extension' => $file->getClientOriginalExtension(),
                'is_cv' => $jenisDokumen === 'cv',
                'is_portfolio' => $jenisDokumen === 'portfolio'
            ]);
            
            // Generate unique filename
            $extension = $file->getClientOriginalExtension();
            $fileName = time() . '_' . $jenisDokumen . '_' . uniqid() . '.' . $extension;
            
            \Log::info('FILE NAME GENERATION:', [
                'generated_file_name' => $fileName,
                'file_extension' => $extension,
                'jenis_dokumen' => $jenisDokumen
            ]);
            
            // Store file in storage/app/public/pkl-documents
            $filePath = $file->storeAs('pkl-documents', $fileName, 'public');
            
            // Verify file was stored successfully
            $fullPath = storage_path('app/public/' . $filePath);
            $fileExists = file_exists($fullPath);
            
            \Log::info('FILE STORAGE RESULT:', [
                'file_path' => $filePath,
                'full_path' => $fullPath,
                'file_exists' => $fileExists,
                'stored_file_size' => $fileExists ? filesize($fullPath) : 'N/A',
                'storage_successful' => $fileExists
            ]);
            
            $responseData = [
                'filePath' => $filePath,
                'fileName' => $fileName,
                'originalName' => $file->getClientOriginalName(),
                'fileSize' => $file->getSize(),
                'jenisDokumen' => $jenisDokumen
            ];
            
            \Log::info('UPLOAD RESPONSE DATA PREPARED:', [
                'response_data' => $responseData,
                'cv_or_portfolio' => $jenisDokumen,
                'success' => true
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Dokumen berhasil diupload',
                'data' => $responseData
            ], Response::HTTP_OK);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupload dokumen',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Download berkas PKL
     */
    public function downloadBerkas(Request $request, int $id, string $type)
    {
        try {
            $pendaftaran = $this->pendaftaranPKLService->getPendaftaranById($id);

            if (!$pendaftaran) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pendaftaran PKL tidak ditemukan'
                ], Response::HTTP_NOT_FOUND);
            }

            // Validasi akses - user hanya bisa download berkas miliknya sendiri
            $user = auth()->guard('client')->user();
            if ($user && $user->id !== $pendaftaran->user_id) {
                // Allow admin/staff to download
                $adminUser = auth()->guard('web')->user();
                if (!$adminUser || $adminUser->role !== 'admin') {
                    abort(403, 'Anda tidak memiliki akses untuk mendownload berkas ini');
                }
            }

            $filePath = null;
            $fileName = null;

            switch ($type) {
                case 'cv':
                    $filePath = $pendaftaran->cv_file_path;
                    $fileName = $pendaftaran->cv_file_name;
                    break;
                case 'portfolio':
                    $filePath = $pendaftaran->portfolio_file_path;
                    $fileName = $pendaftaran->portfolio_file_name;
                    break;
                default:
                    abort(400, 'Tipe berkas tidak valid');
            }

            if (!$filePath || !$fileName) {
                abort(404, 'Berkas tidak ditemukan');
            }

            $fullPath = storage_path('app/public/' . $filePath);

            if (!file_exists($fullPath)) {
                abort(404, 'File tidak ditemukan di server');
            }

            return response()->download($fullPath, $fileName);

        } catch (\Exception $e) {
            \Log::error('Download berkas error: ' . $e->getMessage());
            abort(500, 'Gagal mendownload berkas');
        }
    }
}