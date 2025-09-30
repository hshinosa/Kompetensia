<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UploadDokumenPKL;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class UploadDokumenPKLController extends Controller
{
    /**
     * Display a listing of PKL document uploads.
     */
    public function index(Request $request): Response
    {
        $query = UploadDokumenPKL::with(['pendaftaran.user', 'pendaftaran.posisiPKL', 'user'])
            ->orderBy('tanggal_upload', 'desc');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by jenis dokumen
        if ($request->filled('jenis_dokumen')) {
            $query->where('jenis_dokumen', $request->jenis_dokumen);
        }

        // Search by user name or document type
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('nama_lengkap', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            })->orWhere('jenis_dokumen', 'LIKE', "%{$search}%");
        }

        $uploads = $query->paginate(20);

        // Transform data for frontend
        $transformedUploads = $uploads->getCollection()->map(function ($upload) {
            return [
                'id' => $upload->id,
                'user_name' => $upload->user->nama_lengkap ?? 'N/A',
                'user_email' => $upload->user->email ?? 'N/A',
                'pkl_position' => $upload->pendaftaran->posisiPKL->nama_posisi ?? 'N/A',
                'jenis_dokumen' => $upload->jenis_dokumen_text,
                'file_name' => $upload->file_name,
                'file_size' => $upload->formatted_file_size,
                'link_url' => $upload->link_url,
                'status' => $upload->status,
                'status_text' => $upload->status_text,
                'status_badge_color' => $upload->status_badge_color,
                'tanggal_upload' => $upload->tanggal_upload->format('d/m/Y H:i'),
                'tanggal_review' => $upload->tanggal_review ? $upload->tanggal_review->format('d/m/Y H:i') : null,
                'assessor' => $upload->assessor,
                'feedback' => $upload->feedback,
                'keterangan' => $upload->keterangan,
            ];
        });

        $uploads->setCollection($transformedUploads);

        // Get statistics
        $stats = [
            'total' => UploadDokumenPKL::count(),
            'pending' => UploadDokumenPKL::where('status', 'pending')->count(),
            'approved' => UploadDokumenPKL::where('status', 'approved')->count(),
            'rejected' => UploadDokumenPKL::where('status', 'rejected')->count(),
        ];

        return Inertia::render('admin/pkl/upload-dokumen/index', [
            'uploads' => $uploads,
            'stats' => $stats,
            'filters' => $request->only(['status', 'jenis_dokumen', 'search']),
        ]);
    }

    /**
     * Display the specified upload dokumen PKL.
     */
    public function show(string $id): Response
    {
        $upload = UploadDokumenPKL::with(['pendaftaran.user', 'pendaftaran.posisiPKL', 'user'])
            ->findOrFail($id);

        $uploadData = [
            'id' => $upload->id,
            'user' => [
                'name' => $upload->user->nama_lengkap ?? 'N/A',
                'email' => $upload->user->email ?? 'N/A',
            ],
            'pendaftaran' => [
                'id' => $upload->pendaftaran->id,
                'pkl_position' => $upload->pendaftaran->posisiPKL->nama_posisi ?? 'N/A',
                'pkl_category' => $upload->pendaftaran->posisiPKL->kategori ?? 'N/A',
            ],
            'jenis_dokumen' => $upload->jenis_dokumen_text,
            'judul_tugas' => $upload->judul_tugas,
            'link_url' => $upload->link_url,
            'file_name' => $upload->file_name,
            'file_size' => $upload->formatted_file_size,
            'file_type' => $upload->file_type,
            'status' => $upload->status,
            'status_text' => $upload->status_text,
            'status_badge_color' => $upload->status_badge_color,
            'tanggal_upload' => $upload->tanggal_upload->format('d/m/Y H:i'),
            'tanggal_review' => $upload->tanggal_review ? $upload->tanggal_review->format('d/m/Y H:i') : null,
            'assessor' => $upload->assessor,
            'feedback' => $upload->feedback,
            'keterangan' => $upload->keterangan,
        ];

        return Inertia::render('admin/pkl/upload-dokumen/show', [
            'upload' => $uploadData,
        ]);
    }

    /**
     * Update the status of the specified upload dokumen PKL.
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        try {
            $request->validate([
                'status' => 'required|in:approved,rejected',
                'feedback' => 'nullable|string|max:1000',
            ]);

            $upload = UploadDokumenPKL::findOrFail($id);
            $admin = auth()->user();

            $upload->update([
                'status' => $request->status,
                'feedback' => $request->feedback,
                'assessor' => $admin->nama_lengkap ?? $admin->name ?? 'Admin',
                'tanggal_review' => now(),
            ]);

            Log::info('PKL document status updated', [
                'upload_id' => $upload->id,
                'status' => $request->status,
                'admin_id' => $admin->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Status dokumen berhasil diperbarui',
                'data' => [
                    'id' => $upload->id,
                    'status' => $upload->status,
                    'status_text' => $upload->status_text,
                    'tanggal_review' => $upload->tanggal_review->format('d/m/Y H:i'),
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data yang dikirim tidak valid',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating PKL document status: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status dokumen'
            ], 500);
        }
    }

    /**
     * Download the uploaded file.
     */
    public function downloadFile(string $id): \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
    {
        try {
            $upload = UploadDokumenPKL::findOrFail($id);

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
                'message' => 'Gagal mengunduh file'
            ], 500);
        }
    }

    /**
     * Get upload statistics for dashboard.
     */
    public function getStats(): JsonResponse
    {
        try {
            $stats = [
                'total_uploads' => UploadDokumenPKL::count(),
                'pending_review' => UploadDokumenPKL::where('status', 'pending')->count(),
                'approved' => UploadDokumenPKL::where('status', 'approved')->count(),
                'rejected' => UploadDokumenPKL::where('status', 'rejected')->count(),
                'recent_uploads' => UploadDokumenPKL::with(['user', 'pendaftaran.posisiPKL'])
                    ->orderBy('tanggal_upload', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(function ($upload) {
                        return [
                            'id' => $upload->id,
                            'user_name' => $upload->user->nama_lengkap ?? 'N/A',
                            'jenis_dokumen' => $upload->jenis_dokumen_text,
                            'status' => $upload->status_text,
                            'tanggal_upload' => $upload->tanggal_upload->format('d/m/Y H:i'),
                        ];
                    }),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('Error getting PKL upload stats: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil statistik'
            ], 500);
        }
    }
}