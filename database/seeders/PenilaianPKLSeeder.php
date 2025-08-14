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
            // Generate random scores
            $nilaiSikap = rand(80, 95);
            $nilaiKeterampilan = rand(75, 90);
            $nilaiPengetahuan = rand(70, 95);
            $nilaiAkhir = round((($nilaiSikap + $nilaiKeterampilan + $nilaiPengetahuan) / 3), 2);
            
            PenilaianPKL::create([
                'pendaftaran_id' => $p->id,
                'pkl_id' => $p->pkl_id,
                'pembimbing_id' => 1, // Admin user as pembimbing
                'nilai_sikap' => $nilaiSikap,
                'nilai_keterampilan' => $nilaiKeterampilan,
                'nilai_pengetahuan' => $nilaiPengetahuan,
                'nilai_akhir' => $nilaiAkhir,
                'status_kelulusan' => 'Lulus',
                'catatan_pembimbing' => 'Peserta PKL menunjukkan kinerja yang memuaskan.',
                'tanggal_penilaian' => now()->subDays(rand(1, 15)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
