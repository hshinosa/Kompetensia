<?php

namespace Database\Seeders;

use App\Models\PendaftaranSertifikasi;
use App\Models\User;
use App\Models\Sertifikasi;
use App\Models\BatchSertifikasi;
use Illuminate\Database\Seeder;

class PendaftaranSertifikasiSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data to prevent duplicates
        PendaftaranSertifikasi::query()->delete();
        
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
                'status' => 'Disetujui',
                'motivasi' => 'Ingin meningkatkan skill digital marketing untuk karir.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $users->get(1)->id,  // User kedua (Sari Wulandari)
                'sertifikasi_id' => $sertifikasi->first()->id,
                'batch_id' => $batches->where('sertifikasi_id', $sertifikasi->first()->id)->skip(1)->first()?->id,
                'tanggal_pendaftaran' => now()->subDays(3),
                'status' => 'Disetujui',
                'motivasi' => 'Untuk menambah pengetahuan tentang pemasaran digital.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $users->get(2)->id,  // User ketiga (Budi Santoso)
                'sertifikasi_id' => $sertifikasi->skip(1)->first()->id,
                'batch_id' => $batches->where('sertifikasi_id', $sertifikasi->skip(1)->first()->id)->first()?->id,
                'tanggal_pendaftaran' => now()->subDays(2),
                'status' => 'Disetujui',
                'motivasi' => 'Ingin menjadi web developer profesional.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($pendaftaran as $data) {
            PendaftaranSertifikasi::create($data);
        }
    }
}
