<?php

namespace Database\Seeders;

use App\Models\PendaftaranPKL;
use App\Models\User;
use App\Models\PosisiPKL;
use Illuminate\Database\Seeder;

class PendaftaranPKLSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data to prevent duplicates
        PendaftaranPKL::query()->delete();
        
        $users = User::where('role', 'user')->get();
        $posisiPKL = PosisiPKL::all();

        if ($users->count() === 0 || $posisiPKL->count() === 0) {
            return;
        }

        $pendaftaran = [
            [
                'user_id' => $users->get(0)->id,  // User pertama (Ahmad Rizki)
                'posisi_pkl_id' => $posisiPKL->get(0)->id,  // UI/UX Designer
                'tanggal_pendaftaran' => now()->subDays(4),
                'status' => 'Disetujui',
                'motivasi' => 'Ingin mendapatkan pengalaman kerja di bidang teknologi.',
                'institusi_asal' => 'Universitas Indonesia',
                'program_studi' => 'Sistem Informasi',
                'semester' => 6,
                'ipk' => 3.75,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $users->get(1)->id,  // User kedua (Sari Wulandari)
                'posisi_pkl_id' => $posisiPKL->get(1)->id,  // Backend Developer
                'tanggal_pendaftaran' => now()->subDays(2),
                'status' => 'Disetujui',
                'motivasi' => 'Untuk menerapkan ilmu yang sudah dipelajari di kampus.',
                'institusi_asal' => 'Institut Teknologi Bandung',
                'program_studi' => 'Teknik Informatika',
                'semester' => 7,
                'ipk' => 3.85,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $users->get(2)->id,  // User ketiga (Budi Santoso)
                'posisi_pkl_id' => $posisiPKL->get(2)->id,  // Frontend Developer
                'tanggal_pendaftaran' => now()->subDays(1),
                'status' => 'Disetujui',
                'motivasi' => 'Mempersiapkan diri untuk dunia kerja.',
                'institusi_asal' => 'Universitas Gadjah Mada',
                'program_studi' => 'Ilmu Komputer',
                'semester' => 5,
                'ipk' => 3.60,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($pendaftaran as $data) {
            PendaftaranPKL::create($data);
            
            // Update jumlah pendaftar di posisi PKL
            $posisi = PosisiPKL::find($data['posisi_pkl_id']);
            if ($posisi) {
                $posisi->increment('jumlah_pendaftar');
            }
        }
    }
}
