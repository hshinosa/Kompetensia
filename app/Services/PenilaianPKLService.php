<?php

namespace App\Services;

use App\Models\PendaftaranPKL;
use App\Models\PenilaianPKL;
use Illuminate\Support\Facades\DB;

class PenilaianPKLService
{
    public function nilai(int $pendaftaranId, array $data, int $pembimbingId): void
    {
        $pendaftaran = PendaftaranPKL::findOrFail($pendaftaranId);
        $payload = [
            'status_kelulusan' => $data['status_kelulusan'],
            'catatan_pembimbing' => $data['catatan_pembimbing'] ?? null,
            'tanggal_penilaian' => now(),
            'pembimbing_id' => $pembimbingId,
            'pendaftaran_id' => $pendaftaranId,
            'pkl_id' => $pendaftaran->pkl_id
        ];
        DB::transaction(fn () => PenilaianPKL::updateOrCreate(['pendaftaran_id' => $pendaftaranId], $payload));
    }
}
