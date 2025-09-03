<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\LaporanMingguan;
use App\Models\PenilaianPKL;

class PenilaianPKLSubmissionController extends Controller
{
    // Simpan penilaian submisi laporan mingguan
    public function store(Request $request, $submissionId)
    {
        // 1. Menggunakan logika validasi Anda yang sudah terbukti
        $validator = Validator::make($request->all(), [
            'statusPenilaian' => 'required|in:Diterima,Tidak Diterima',
            'feedback' => 'nullable|string',
        ]);

        // Jika validasi gagal, redirect kembali dengan error (Inertia akan menanganinya)
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // 2. Menggunakan logika penyimpanan Anda yang sudah terbukti
        $laporan = LaporanMingguan::findOrFail($submissionId);
        $laporan->statusPenilaian = $request->input('statusPenilaian');
        $laporan->feedback = $request->input('feedback');
        $laporan->isAssessed = true;
        $laporan->save();

        // 3. Cari PenilaianPKL utama untuk mendapatkan ID halaman detail
        $penilaian = PenilaianPKL::where('pendaftaran_id', $laporan->pendaftaran_id)->firstOrFail();

        // 4. Ganti respons JSON dengan REDIRECT. Ini adalah kuncinya!
        return redirect()->route('admin.detail-penilaian-pkl', ['id' => $penilaian->id])
            ->with('success', 'Penilaian laporan berhasil disimpan.');
    }
}