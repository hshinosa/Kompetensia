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
        $payload = [
            'status_penilaian' => $data['status_penilaian'],
            'catatan_penilai' => $data['catatan_penilai'] ?? null,
            'tanggal_penilaian' => now(),
            'pendaftaran_id' => $pendaftaranId,
            'posisi_pkl_id' => $pendaftaran->posisi_pkl_id
        ];
        DB::transaction(fn () => PenilaianPKL::updateOrCreate(['pendaftaran_id' => $pendaftaranId], $payload));
    }
}
