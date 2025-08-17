<?php

namespace Database\Seeders;

use App\Models\PenilaianPKL;
use App\Models\PendaftaranPKL;
use Illuminate\Database\Seeder;

class PenilaianPKLSeeder extends Seeder
{
    public function run(): void
    {
        $pendaftaran = PendaftaranPKL::where('status', 'Disetujui')->get();

        if ($pendaftaran->count() === 0) {
            return;
        }

        foreach ($pendaftaran as $p) {
            PenilaianPKL::create([
                'pendaftaran_id' => $p->id,
                'posisi_pkl_id' => $p->posisi_pkl_id,
                'status_penilaian' => 'Diterima',
                'catatan_penilai' => 'Peserta PKL menunjukkan kinerja yang memuaskan dan memenuhi kriteria.',
                'tanggal_penilaian' => now()->subDays(rand(1, 15)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
