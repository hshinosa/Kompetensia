<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SertifikatKelulusan;
use App\Models\PendaftaranSertifikasi;
use App\Models\PenilaianSertifikasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class SertifikatKelulusanController extends Controller
{
    /**
     * Store a new certificate for approved certification participant.
     */
    public function store(Request $request, $pendaftaranId)
    {
        try {
            $validated = $request->validate([
                'link_sertifikat' => 'required|url|max:500',
                'tanggal_selesai' => 'required|date',
                'catatan_admin' => 'nullable|string|max:1000',
            ]);

            $pendaftaran = PendaftaranSertifikasi::with(['user', 'sertifikasi', 'batch'])
                ->findOrFail($pendaftaranId);

            // Check if certificate already exists
            $existingCertificate = SertifikatKelulusan::where('pendaftaran_sertifikasi_id', $pendaftaranId)
                ->first();

            if ($existingCertificate) {
                return redirect()->back()->with('error', 'Sertifikat untuk peserta ini sudah diterbitkan sebelumnya');
            }

            DB::beginTransaction();
            try {
                // Create or update penilaian with status "Lulus"
                $penilaian = PenilaianSertifikasi::updateOrCreate(
                    ['pendaftaran_id' => $pendaftaranId],
                    [
                        'sertifikasi_id' => $pendaftaran->sertifikasi_id,
                        'batch_id' => $pendaftaran->batch_id,
                        'asesor_id' => Auth::guard('admin')->id(),
                        'status_penilaian' => 'Diterima',
                        'tanggal_penilaian' => now(),
                    ]
                );

                // Create certificate
                $certificate = SertifikatKelulusan::create([
                    'user_id' => $pendaftaran->user_id,
                    'pendaftaran_sertifikasi_id' => $pendaftaranId,
                    'pendaftaran_pkl_id' => null,
                    'jenis_program' => 'sertifikasi',
                    'nama_program' => $pendaftaran->sertifikasi->nama_sertifikasi,
                    'link_sertifikat' => $validated['link_sertifikat'],
                    'tanggal_selesai' => $validated['tanggal_selesai'],
                    'catatan_admin' => $validated['catatan_admin'] ?? null,
                    'diterbitkan_oleh' => Auth::guard('admin')->id(),
                ]);

                DB::commit();

                // For Inertia requests, return back with flash message
                return back()->with('success', 'Sertifikat berhasil diterbitkan dan status penilaian diperbarui menjadi Lulus');
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            Log::error('Error creating certificate: ' . $e->getMessage());
            
            return back()->with('error', 'Gagal menerbitkan sertifikat: ' . $e->getMessage());
        }
    }

    /**
     * Check if certificate exists for a pendaftaran.
     */
    public function checkCertificate($pendaftaranId)
    {
        $certificate = SertifikatKelulusan::where('pendaftaran_sertifikasi_id', $pendaftaranId)
            ->first();

        return response()->json([
            'exists' => !is_null($certificate),
            'certificate' => $certificate ? [
                'id' => $certificate->id,
                'link_sertifikat' => $certificate->link_sertifikat,
                'tanggal_selesai' => $certificate->tanggal_selesai->format('Y-m-d'),
                'catatan_admin' => $certificate->catatan_admin,
            ] : null
        ]);
    }

    /**
     * Store a new certificate for completed PKL participant.
     */
    public function storePKL(Request $request, $pendaftaranId)
    {
        try {
            $validated = $request->validate([
                'link_sertifikat' => 'required|url|max:500',
                'tanggal_selesai' => 'required|date',
                'catatan_admin' => 'nullable|string|max:1000',
            ]);

            $pendaftaran = \App\Models\PendaftaranPKL::with(['user', 'posisiPKL'])
                ->findOrFail($pendaftaranId);

            // Check if certificate already exists
            $existingCertificate = SertifikatKelulusan::where('pendaftaran_pkl_id', $pendaftaranId)
                ->first();

            if ($existingCertificate) {
                return redirect()->back()->with('error', 'Sertifikat untuk peserta ini sudah diterbitkan sebelumnya');
            }

            // Check if "Laporan Akhir" has been approved
            $hasApprovedLaporanAkhir = \App\Models\UploadDokumenPKL::where('pendaftaran_id', $pendaftaranId)
                ->where('jenis_dokumen', 'laporan-akhir')
                ->where('status', 'approved')
                ->exists();

            if (!$hasApprovedLaporanAkhir) {
                return redirect()->back()->with('error', 'Laporan Akhir harus disetujui terlebih dahulu sebelum menerbitkan sertifikat');
            }

            DB::beginTransaction();
            try {
                // Create certificate
                $certificate = SertifikatKelulusan::create([
                    'user_id' => $pendaftaran->user_id,
                    'pendaftaran_sertifikasi_id' => null,
                    'pendaftaran_pkl_id' => $pendaftaranId,
                    'jenis_program' => 'pkl',
                    'nama_program' => $pendaftaran->posisiPKL->nama_posisi,
                    'link_sertifikat' => $validated['link_sertifikat'],
                    'tanggal_selesai' => $validated['tanggal_selesai'],
                    'catatan_admin' => $validated['catatan_admin'] ?? null,
                    'diterbitkan_oleh' => Auth::guard('admin')->id(),
                ]);

                DB::commit();

                return redirect()->back()->with('success', 'Sertifikat PKL berhasil diterbitkan');
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            Log::error('Error creating PKL certificate: ' . $e->getMessage());
            
            return redirect()->back()->with('error', 'Gagal menerbitkan sertifikat PKL');
        }
    }

    /**
     * Check if PKL certificate exists for a pendaftaran.
     */
    public function checkPKLCertificate($pendaftaranId)
    {
        $certificate = SertifikatKelulusan::where('pendaftaran_pkl_id', $pendaftaranId)
            ->first();

        return response()->json([
            'exists' => !is_null($certificate),
            'certificate' => $certificate ? [
                'id' => $certificate->id,
                'link_sertifikat' => $certificate->link_sertifikat,
                'tanggal_selesai' => $certificate->tanggal_selesai->format('Y-m-d'),
                'catatan_admin' => $certificate->catatan_admin,
            ] : null
        ]);
    }
}
