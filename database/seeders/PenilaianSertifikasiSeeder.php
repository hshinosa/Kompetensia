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
            PenilaianSertifikasi::create([
                'pendaftaran_id'     => $p->id,
                'sertifikasi_id'     => $p->sertifikasi_id,
                'batch_id'           => $p->batch_id,
                'asesor_id'          => 1, // Admin user
                'status_penilaian'   => 'Diterima',
                'catatan_asesor'     => 'Peserta menunjukkan pemahaman yang baik dan lulus semua komponen penilaian.',
                'tanggal_penilaian'  => now()->subDays(rand(1, 10)),
                'created_at'         => now(),
                'updated_at'         => now(),
            ]);
        }
    }
}
