<?php

namespace Database\Seeders;

use App\Models\PendaftaranSertifikasi;
use App\Models\User;
use App\Models\Sertifikasi;
use App\Models\BatchSertifikasi;
use Illuminate\Database\Seeder;

class PengajuanDaftar1Seeder extends Seeder
{
    public function run(): void
    {
        
        $users = User::where('role', 'user')->get();
        $sertifikasi = Sertifikasi::all();
        $batches = BatchSertifikasi::all();

        if ($users->count() === 0 || $sertifikasi->count() === 0 || $batches->count() === 0) {
            return;
        }

        $pendaftaran = [
            [
                'user_id' => $users->get(0)->id,  // User pertama (Ahmad Rizki)
                'sertifikasi_id' => $sertifikasi->first()->id,
                'batch_id' => $batches->where('sertifikasi_id', $sertifikasi->first()->id)->first()?->id,
                'tanggal_pendaftaran' => now()->subDays(5),
                'status' => 'Ditolak',
                'motivasi' => 'Ingin meningkatkan skill digital marketing untuk karir.',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($pendaftaran as $data) {
            PendaftaranSertifikasi::create($data);
        }
    }
}
