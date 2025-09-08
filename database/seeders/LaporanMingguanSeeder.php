<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\PendaftaranPKL;
use App\Models\LaporanMingguan;
use Illuminate\Support\Str;

class LaporanMingguanSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus data lama
        LaporanMingguan::query()->delete();

        // Ambil semua user dengan role 'mahasiswa'
        $users = User::where('role', 'mahasiswa')->get();

        foreach ($users as $user) {
            // Ambil pendaftaran PKL milik user
            $pendaftaran = PendaftaranPKL::where('user_id', $user->id)->first();
            if (!$pendaftaran) continue;

            // Buat 4 laporan mingguan untuk setiap pendaftaran
            for ($i = 1; $i <= 4; $i++) {
                LaporanMingguan::create([
                    'pendaftaran_id' => $pendaftaran->id,
                    'submissionNumber' => 'Submisi ' . $i,
                    'submittedDate' => now()->subDays(7 * (5 - $i)),
                    'status' => 'submitted',
                    'jenisDocument' => 'Laporan/Tugas',
                    'submissionType' => $i % 2 === 0 ? 'document' : 'link',
                    'isAssessed' => $i % 2 === 0,
                    'statusPenilaian' => $i % 2 === 0 ? 'Diterima' : null,
                    'feedback' => $i % 2 === 0 ? 'Feedback untuk submisi ' . $i : null,
                    'judulTugas' => 'Judul Tugas Minggu ' . $i,
                    'deskripsiTugas' => 'Deskripsi tugas minggu ke-' . $i,
                    'linkSubmisi' => $i % 2 === 1 ? 'https://github.com/example/submisi' . $i : null,
                    'fileName' => $i % 2 === 0 ? 'Laporan_Mingguan_' . $i . '.pdf' : null,
                    'fileSize' => $i % 2 === 0 ? rand(1,3) . '.2 MB' : null,
                    'fileType' => $i % 2 === 0 ? 'PDF' : null,
                ]);
            }
        }
    }
}