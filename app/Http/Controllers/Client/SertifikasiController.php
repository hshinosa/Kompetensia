<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SertifikasiController extends Controller
{
    public function index()
    {
        return Inertia::render('client/sertifikasi/index');
    }

    public function show($id)
    {
        // Sample data - in real implementation, fetch from database
        $sertifikasi = [
            'id' => $id,
            'nama' => 'Lorem ipsum dolor sit amet, consectetur adipiscing...',
            'deskripsi' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'batch' => 'Batch 1',
            'tanggal' => '24 Juli 2025',
            'peserta' => 25,
            'progress' => 45
        ];

        return Inertia::render('client/sertifikasi/detail', [
            'sertifikasi' => $sertifikasi
        ]);
    }

    public function uploadTugas(Request $request, $id)
    {
        $request->validate([
            'judul_tugas' => 'required|string|max:255',
            'link_url' => 'required|url',
            'file' => 'required|file|mimes:pdf,doc,docx,zip,rar|max:10240', // 10MB max
        ]);

        try {
            // Handle file upload
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('uploads/sertifikasi/' . $id, $fileName, 'public');

            // In real implementation, save to database
            // TugasSertifikasi::create([
            //     'sertifikasi_id' => $id,
            //     'user_id' => auth()->guard('client')->id(),
            //     'judul_tugas' => $request->judul_tugas,
            //     'link_url' => $request->link_url,
            //     'file_path' => 'uploads/sertifikasi/' . $id . '/' . $fileName,
            //     'nama_file' => $fileName,
            //     'status' => 'pending'
            // ]);

            return redirect()->back()->with('success', 'Tugas berhasil diunggah!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengunggah tugas. Silakan coba lagi.');
        }
    }
}
