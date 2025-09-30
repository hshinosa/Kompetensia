<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PendaftaranSertifikasiRequest;
use App\Http\Resources\PendaftaranSertifikasiResource;
use App\Http\Resources\PendaftaranSertifikasiCollection;
use App\Services\PendaftaranSertifikasiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PendaftaranSertifikasiController extends Controller
{
    protected PendaftaranSertifikasiService $pendaftaranSertifikasiService;

    public function __construct(PendaftaranSertifikasiService $pendaftaranSertifikasiService)
    {
        $this->pendaftaranSertifikasiService = $pendaftaranSertifikasiService;
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
            
            $pendaftaran = $this->pendaftaranSertifikasiService->getAllPendaftaran(
                $perPage,
                $status,
                $search
            );

            return response()->json(
                new PendaftaranSertifikasiCollection($pendaftaran),
                Response::HTTP_OK
            );
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pendaftaran sertifikasi',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PendaftaranSertifikasiRequest $request): JsonResponse
    {
        try {
            $pendaftaran = $this->pendaftaranSertifikasiService->createPendaftaran(
                $request->validated(),
                $request->user()
            );

            return response()->json([
                'success' => true,
                'message' => 'Pendaftaran sertifikasi berhasil dibuat',
                'data' => new PendaftaranSertifikasiResource($pendaftaran)
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat pendaftaran sertifikasi',
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
            $pendaftaran = $this->pendaftaranSertifikasiService->getPendaftaranById($id);

            if (!$pendaftaran) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pendaftaran sertifikasi tidak ditemukan'
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data pendaftaran sertifikasi berhasil diambil',
                'data' => new PendaftaranSertifikasiResource($pendaftaran)
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pendaftaran sertifikasi',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PendaftaranSertifikasiRequest $request, int $id): JsonResponse
    {
        try {
            $pendaftaran = $this->pendaftaranSertifikasiService->updatePendaftaran(
                $id,
                $request->validated()
            );

            if (!$pendaftaran) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pendaftaran sertifikasi tidak ditemukan'
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'message' => 'Pendaftaran sertifikasi berhasil diperbarui',
                'data' => new PendaftaranSertifikasiResource($pendaftaran)
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui pendaftaran sertifikasi',
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
            'catatan_admin' => 'nullable|string|max:1000'
        ]);

        try {
            $pendaftaran = $this->pendaftaranSertifikasiService->updateStatus(
                $id,
                $request->status,
                $request->catatan_admin
            );

            if (!$pendaftaran) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pendaftaran sertifikasi tidak ditemukan'
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'message' => 'Status pendaftaran sertifikasi berhasil diperbarui',
                'data' => new PendaftaranSertifikasiResource($pendaftaran)
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status pendaftaran sertifikasi',
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
            $deleted = $this->pendaftaranSertifikasiService->deletePendaftaran($id);

            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pendaftaran sertifikasi tidak ditemukan'
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'message' => 'Pendaftaran sertifikasi berhasil dihapus'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus pendaftaran sertifikasi',
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
            $pendaftaran = $this->pendaftaranSertifikasiService->getByUser($user);

            return response()->json([
                'success' => true,
                'message' => 'Data pendaftaran sertifikasi user berhasil diambil',
                'data' => PendaftaranSertifikasiResource::collection($pendaftaran)
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pendaftaran sertifikasi user',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get pendaftaran by sertifikasi
     */
    public function getBySertifikasi(int $sertifikasiId): JsonResponse
    {
        try {
            $pendaftaran = $this->pendaftaranSertifikasiService->getPendaftaranBySertifikasi($sertifikasiId);

            return response()->json([
                'success' => true,
                'message' => 'Data pendaftaran sertifikasi berhasil diambil',
                'data' => PendaftaranSertifikasiResource::collection($pendaftaran)
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pendaftaran sertifikasi',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}