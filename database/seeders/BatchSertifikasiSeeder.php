<?php

namespace Database\Seeders;

use App\Models\BatchSertifikasi;
use App\Models\Sertifikasi;
use Illuminate\Database\Seeder;

class BatchSertifikasiSeeder extends Seeder
{
    public function run(): void
    {
        $sertifikasi = Sertifikasi::all();

        if ($sertifikasi->count() === 0) {
            return;
        }

        $batches = [
            [
                'sertifikasi_id' => $sertifikasi->first()->id,
                'nama_batch' => 'Batch 1 - Digital Marketing',
                'tanggal_mulai' => now()->addDays(7)->toDateString(),
                'tanggal_selesai' => now()->addDays(37)->toDateString(),
                'jumlah_pendaftar' => 15,
                'status' => 'Aktif',
                'instruktur' => 'Pak Ahmad Santoso',
                'catatan' => 'Pelatihan digital marketing tingkat dasar hingga menengah',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'sertifikasi_id' => $sertifikasi->first()->id,
                'nama_batch' => 'Batch 2 - Digital Marketing',
                'tanggal_mulai' => now()->addDays(45)->toDateString(),
                'tanggal_selesai' => now()->addDays(75)->toDateString(),
                'jumlah_pendaftar' => 20,
                'status' => 'Aktif',
                'instruktur' => 'Bu Sarah Wijaya',
                'catatan' => 'Pelatihan digital marketing tingkat lanjutan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'sertifikasi_id' => $sertifikasi->skip(1)->first()->id,
                'nama_batch' => 'Batch 1 - Web Development',
                'tanggal_mulai' => now()->addDays(14)->toDateString(),
                'tanggal_selesai' => now()->addDays(59)->toDateString(),
                'jumlah_pendaftar' => 12,
                'status' => 'Aktif',
                'instruktur' => 'Pak Budi Raharjo',
                'catatan' => 'Pelatihan web development dari dasar',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'sertifikasi_id' => $sertifikasi->skip(1)->first()->id,
                'nama_batch' => 'Batch 1 - Web Development Advanced',
                'tanggal_mulai' => now()->addDays(21)->toDateString(),
                'tanggal_selesai' => now()->addDays(66)->toDateString(),
                'jumlah_pendaftar' => 18,
                'status' => 'Aktif',
                'instruktur' => 'Dr. Lisa Handayani',
                'catatan' => 'Pelatihan web development tingkat lanjut',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'sertifikasi_id' => $sertifikasi->skip(1)->first()->id,
                'nama_batch' => 'Batch 2 - Web Development',
                'tanggal_mulai' => now()->addDays(60)->toDateString(),
                'tanggal_selesai' => now()->addDays(105)->toDateString(),
                'jumlah_pendaftar' => 8,
                'status' => 'Aktif',
                'instruktur' => 'Pak Doni Pratama',
                'catatan' => 'Pelatihan web development tingkat menengah',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($batches as $batch) {
            BatchSertifikasi::create($batch);
        }
    }
}
