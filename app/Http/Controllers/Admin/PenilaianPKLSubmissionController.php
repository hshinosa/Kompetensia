<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\UploadDokumenPKL;
use App\Models\PenilaianPKL;

class PenilaianPKLSubmissionController extends Controller
{
    // Simpan penilaian submisi dokumen PKL
    public function store(Request $request, $submissionId)
    {
        // 1. Menggunakan logika validasi yang sudah terbukti
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,rejected',
            'feedback' => 'nullable|string',
        ]);

        // Jika validasi gagal, redirect kembali dengan error (Inertia akan menanganinya)
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // 2. Menggunakan logika penyimpanan dengan model baru
        $upload = UploadDokumenPKL::findOrFail($submissionId);
        $admin = auth()->user();
        
        $upload->update([
            'status' => $request->input('status'),
            'feedback' => $request->input('feedback'),
            'assessor' => $admin->nama_lengkap ?? $admin->name ?? 'Admin',
            'tanggal_review' => now(),
        ]);

        // 3. Cari PenilaianPKL utama untuk mendapatkan ID halaman detail
        $penilaian = PenilaianPKL::where('pendaftaran_id', $upload->pendaftaran_id)->firstOrFail();

        // 4. Ganti respons JSON dengan REDIRECT
        return redirect()->route('admin.detail-penilaian-pkl', ['id' => $penilaian->id])
            ->with('success', 'Penilaian dokumen berhasil disimpan.');
    }
}