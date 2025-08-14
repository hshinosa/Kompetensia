<?php

namespace Database\Seeders;

use App\Models\PenilaianSertifikasi;
use App\Models\PendaftaranSertifikasi;
use Illuminate\Database\Seeder;

class PenilaianSertifikasiSeeder extends Seeder
{
    public function run(): void
    {
        $pendaftaran = PendaftaranSertifikasi::where('status', 'Disetujui')->get();

        if ($pendaftaran->count() === 0) {
            return;
        }

        foreach ($pendaftaran as $p) {
            // generate random values
            $nilaiTeori = rand(70, 95);
            $nilaiPraktek = rand(80, 100);
            $nilaiAkhir = round((($nilaiTeori + $nilaiPraktek) / 2), 2);
            PenilaianSertifikasi::create([
                'pendaftaran_id'     => $p->id,
                'sertifikasi_id'     => $p->sertifikasi_id,
                'batch_id'           => $p->batch_id,
                'asesor_id'          => 1, // Admin user
                'nilai_teori'        => $nilaiTeori,
                'nilai_praktek'      => $nilaiPraktek,
                'nilai_akhir'        => $nilaiAkhir,
                'status_kelulusan'   => 'Lulus',
                'catatan_asesor'     => 'Peserta menunjukkan pemahaman yang baik.',
                'tanggal_penilaian'  => now()->subDays(rand(1, 10)),
                'created_at'         => now(),
                'updated_at'         => now(),
            ]);
        }
    }
}
