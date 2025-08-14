<?php

namespace Database\Seeders;

use App\Models\PendaftaranPKL;
use App\Models\User;
use App\Models\PKL;
use App\Models\PosisiPKL;
use Illuminate\Database\Seeder;

class PendaftaranPKLSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data to prevent duplicates
        PendaftaranPKL::query()->delete();
        
        $users = User::where('role', 'user')->get();
        $pkl = PKL::all();

        if ($users->count() === 0 || $pkl->count() === 0) {
            return;
        }

        $pendaftaran = [
            [
                'user_id' => $users->get(0)->id,  // User pertama
                'pkl_id' => $pkl->first()->id,
                'tanggal_pendaftaran' => now()->subDays(4),
                'status' => 'Pengajuan',
                'motivasi' => 'Ingin mendapatkan pengalaman kerja di bidang teknologi.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $users->get(1)->id,  // User kedua
                'pkl_id' => $pkl->skip(1)->first()->id,
                'tanggal_pendaftaran' => now()->subDays(2),
                'status' => 'Disetujui',
                'motivasi' => 'Untuk menerapkan ilmu yang sudah dipelajari di kampus.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $users->get(2)->id,  // User ketiga
                'pkl_id' => $pkl->skip(2)->first()->id,
                'tanggal_pendaftaran' => now()->subDays(1),
                'status' => 'Pengajuan',
                'motivasi' => 'Mempersiapkan diri untuk dunia kerja.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($pendaftaran as $data) {
            PendaftaranPKL::create($data);
        }
    }
}
