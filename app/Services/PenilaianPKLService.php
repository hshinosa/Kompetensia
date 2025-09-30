<?php

namespace App\Services;

use App\Models\PendaftaranPKL;
use App\Models\PenilaianPKL;
use Illuminate\Support\Facades\DB;

class PenilaianPKLService
{
    public function nilai(int $pendaftaranId, array $data): void
    {
        $pendaftaran = PendaftaranPKL::findOrFail($pendaftaranId);
        
        // Ensure status_penilaian is properly mapped
        $statusPenilaian = $data['status_penilaian'] ?? $data['status_kelulusan'] ?? null;
        $catatanPenilai = $data['catatan_penilai'] ?? $data['catatan_pembimbing'] ?? null;
        
        if (!$statusPenilaian) {
            throw new \InvalidArgumentException('Status penilaian harus diisi');
        }
        
        $payload = [
            'status_penilaian' => $statusPenilaian,
            'catatan_penilai' => $catatanPenilai,
            'tanggal_penilaian' => now(),
            'pendaftaran_id' => $pendaftaranId,
            'posisi_pkl_id' => $pendaftaran->posisi_pkl_id
        ];
        
        DB::transaction(function () use ($pendaftaranId, $payload, $statusPenilaian) {
            PenilaianPKL::updateOrCreate(['pendaftaran_id' => $pendaftaranId], $payload);
            
            // Update status pendaftaran PKL berdasarkan penilaian
            $pendaftaran = PendaftaranPKL::find($pendaftaranId);
            if ($pendaftaran) {
                $pendaftaran->update([
                    'status' => $statusPenilaian === 'Diterima' ? 'Disetujui' : 'Ditolak',
                    'catatan_admin' => $payload['catatan_penilai'],
                    'tanggal_diproses' => now()
                ]);
            }
        });
    }
}
