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

        // Status distribution: 40% Belum Dinilai, 35% Diterima, 25% Ditolak
        $statusOptions = [
            'Belum Dinilai' => 40,
            'Diterima' => 35, 
            'Ditolak' => 25
        ];

        // Catatan untuk berbagai status
        $catatanDiterima = [
            'Peserta menunjukkan pemahaman yang baik dan lulus semua komponen penilaian.',
            'Excellent performance. Menguasai materi dengan sangat baik.',
            'Good work! Memenuhi semua kriteria kelulusan.',
            'Peserta menunjukkan kompetensi yang sesuai dengan standar sertifikasi.',
            'Sangat memuaskan. Dapat mengaplikasikan pengetahuan dengan baik.'
        ];

        $catatanDitolak = [
            'Peserta belum menunjukkan pemahaman yang cukup pada beberapa komponen.',
            'Perlu peningkatan dalam pemahaman konsep dasar.',
            'Beberapa jawaban tidak sesuai dengan standar yang diharapkan.',
            'Kurang dalam aplikasi praktis dari materi yang dipelajari.',
            'Perlu belajar lebih mendalam sebelum mengikuti penilaian ulang.'
        ];

        foreach ($pendaftaran as $index => $p) {
            // Determine status based on weighted probability
            $rand = rand(1, 100);
            if ($rand <= 40) {
                $status = 'Belum Dinilai';
            } elseif ($rand <= 75) { // 40 + 35
                $status = 'Diterima';
            } else {
                $status = 'Ditolak';
            }

            // Only create penilaian record if not "Belum Dinilai"
            if ($status !== 'Belum Dinilai') {
                $catatan = $status === 'Diterima' 
                    ? $catatanDiterima[array_rand($catatanDiterima)]
                    : $catatanDitolak[array_rand($catatanDitolak)];

                PenilaianSertifikasi::create([
                    'pendaftaran_id'     => $p->id,
                    'sertifikasi_id'     => $p->sertifikasi_id,
                    'batch_id'           => $p->batch_id,
                    'asesor_id'          => 1, // Admin user
                    'status_penilaian'   => $status,
                    'catatan_asesor'     => $catatan,
                    'tanggal_penilaian'  => now()->subDays(rand(1, 10)),
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ]);
            }
            // If "Belum Dinilai", no penilaian record is created (handled by relationship)
        }
    }
}
