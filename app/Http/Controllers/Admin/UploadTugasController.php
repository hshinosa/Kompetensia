<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UploadTugasSertifikasi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\Response;

class UploadTugasController extends Controller
{
    /**
     * Display listing of all upload tugas for admin review
     */
    public function index(Request $request)
    {
        try {
            $query = UploadTugasSertifikasi::with([
                'user:id,nama,email',
                'sertifikasi:id,nama_sertifikasi,jenis_sertifikasi',
                'pendaftaran:id,user_id,sertifikasi_id',
                'assessor:id,nama'
            ])
            ->orderBy('created_at', 'desc');
            
            // Filter by status if provided
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            
            // Filter by sertifikasi if provided
            if ($request->has('sertifikasi_id')) {
                $query->where('sertifikasi_id', $request->sertifikasi_id);
            }
            
            // Search by user name or judul tugas
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('judul_tugas', 'like', "%{$search}%")
                      ->orWhereHas('user', function($userQuery) use ($search) {
                          $userQuery->where('nama', 'like', "%{$search}%")
                                   ->orWhere('email', 'like', "%{$search}%");
                      });
                });
            }
            
            $uploads = $query->paginate(15);
            
            // Get sertifikasi list for filter dropdown
            $sertifikasiList = \App\Models\Sertifikasi::select('id', 'nama_sertifikasi')
                ->orderBy('nama_sertifikasi')
                ->get();
            
            return Inertia::render('admin/upload-tugas/index', [
                'uploads' => $uploads,
                'sertifikasiList' => $sertifikasiList,
                'filters' => [
                    'status' => $request->status ?? 'all',
                    'sertifikasi_id' => $request->sertifikasi_id,
                    'search' => $request->search
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading upload tugas list: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memuat data upload tugas');
        }
    }
    
    /**
     * Show detail of upload tugas for review
     */
    public function show($id)
    {
        try {
            $upload = UploadTugasSertifikasi::with([
                'user:id,nama,email,no_hp',
                'sertifikasi:id,nama_sertifikasi,jenis_sertifikasi,deskripsi',
                'pendaftaran:id,user_id,sertifikasi_id,tanggal_daftar',
                'assessor:id,nama'
            ])->findOrFail($id);
            
            return Inertia::render('admin/upload-tugas/detail', [
                'upload' => [
                    'id' => $upload->id,
                    'judul_tugas' => $upload->judul_tugas,
                    'link_url' => $upload->link_url,
                    'nama_file' => $upload->nama_file,
                    'path_file' => $upload->path_file ? asset('storage/' . $upload->path_file) : null,
                    'ukuran_file_formatted' => $upload->ukuran_file_formatted,
                    'tipe_file' => $upload->tipe_file,
                    'tanggal_upload' => $upload->tanggal_upload->format('d M Y H:i'),
                    'status' => $upload->status,
                    'status_display' => $upload->status_display,
                    'feedback' => $upload->feedback,
                    'tanggal_review' => $upload->tanggal_review ? $upload->tanggal_review->format('d M Y H:i') : null,
                    'user' => [
                        'id' => $upload->user->id,
                        'nama' => $upload->user->nama,
                        'email' => $upload->user->email,
                        'no_hp' => $upload->user->no_hp
                    ],
                    'sertifikasi' => [
                        'id' => $upload->sertifikasi->id,
                        'nama_sertifikasi' => $upload->sertifikasi->nama_sertifikasi,
                        'jenis_sertifikasi' => $upload->sertifikasi->jenis_sertifikasi,
                        'deskripsi' => $upload->sertifikasi->deskripsi
                    ],
                    'assessor' => $upload->assessor ? [
                        'id' => $upload->assessor->id,
                        'nama' => $upload->assessor->nama
                    ] : null
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading upload tugas detail: ' . $e->getMessage());
            return redirect()->route('admin.upload-tugas.index')->with('error', 'Upload tugas tidak ditemukan');
        }
    }
    
    /**
     * Approve upload tugas
     */
    public function approve(Request $request, $id)
    {
        try {
            $request->validate([
                'feedback' => 'nullable|string|max:1000'
            ]);
            
            $upload = UploadTugasSertifikasi::findOrFail($id);
            
            $upload->update([
                'status' => 'approved',
                'feedback' => $request->feedback,
                'assessor_id' => auth()->guard('admin')->id(),
                'tanggal_review' => now()
            ]);
            
            return response()->json([
                'message' => 'Upload tugas berhasil disetujui',
                'upload' => $upload->fresh()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error approving upload tugas: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal menyetujui upload tugas'], 500);
        }
    }
    
    /**
     * Reject upload tugas
     */
    public function reject(Request $request, $id)
    {
        try {
            $request->validate([
                'feedback' => 'required|string|max:1000'
            ]);
            
            $upload = UploadTugasSertifikasi::findOrFail($id);
            
            $upload->update([
                'status' => 'rejected',
                'feedback' => $request->feedback,
                'assessor_id' => auth()->guard('admin')->id(),
                'tanggal_review' => now()
            ]);
            
            return response()->json([
                'message' => 'Upload tugas berhasil ditolak',
                'upload' => $upload->fresh()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error rejecting upload tugas: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal menolak upload tugas'], 500);
        }
    }
    
    /**
     * Bulk action for multiple uploads
     */
    public function bulkAction(Request $request)
    {
        try {
            $request->validate([
                'action' => 'required|in:approve,reject',
                'upload_ids' => 'required|array|min:1',
                'upload_ids.*' => 'exists:upload_tugas_sertifikasi,id',
                'feedback' => 'nullable|string|max:1000'
            ]);
            
            $uploads = UploadTugasSertifikasi::whereIn('id', $request->upload_ids)
                ->where('status', 'pending')
                ->get();
            
            if ($uploads->isEmpty()) {
                return response()->json(['message' => 'Tidak ada upload yang dapat diproses'], 422);
            }
            
            $status = $request->action === 'approve' ? 'approved' : 'rejected';
            $assessorId = auth()->guard('admin')->id();
            $now = now();
            
            foreach ($uploads as $upload) {
                $upload->update([
                    'status' => $status,
                    'feedback' => $request->feedback,
                    'assessor_id' => $assessorId,
                    'tanggal_review' => $now
                ]);
            }
            
            $actionText = $request->action === 'approve' ? 'disetujui' : 'ditolak';
            return response()->json([
                'message' => "Berhasil {$actionText} {$uploads->count()} upload tugas",
                'processed_count' => $uploads->count()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error bulk action upload tugas: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal memproses bulk action'], 500);
        }
    }
    
    /**
     * Download uploaded file
     */
    public function downloadFile($id)
    {
        try {
            $upload = UploadTugasSertifikasi::findOrFail($id);
            
            if (!$upload->path_file) {
                return redirect()->back()->with('error', 'File tidak ditemukan');
            }
            
            $filePath = storage_path('app/public/' . $upload->path_file);
            
            if (!file_exists($filePath)) {
                return redirect()->back()->with('error', 'File tidak ditemukan di server');
            }
            
            return response()->download($filePath, $upload->nama_file);
        } catch (\Exception $e) {
            \Log::error('Error downloading file: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal mengunduh file');
        }
    }
}