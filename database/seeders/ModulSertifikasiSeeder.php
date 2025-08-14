<?php

namespace Database\Seeders;

use App\Models\ModulSertifikasi;
use App\Models\Sertifikasi;
use Illuminate\Database\Seeder;

class ModulSertifikasiSeeder extends Seeder
{
    public function run(): void
    {
        $sertifikasi = \App\Models\Sertifikasi::all();

        if ($sertifikasi->count() === 0) {
            return;
        }

        \Illuminate\Support\Facades\DB::table('modul_sertifikasi')->insert([
            [
                'sertifikasi_id' => $sertifikasi->first()->id,
                'judul' => 'Pengenalan Digital Marketing',
                'deskripsi' => 'Modul dasar tentang digital marketing',
                'poin_pembelajaran' => json_encode(['Konsep dasar', 'Strategi marketing', 'Tools digital']),
                'urutan' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'sertifikasi_id' => $sertifikasi->first()->id,
                'judul' => 'Social Media Marketing',
                'deskripsi' => 'Strategi pemasaran di media sosial',
                'poin_pembelajaran' => json_encode(['Platform sosmed', 'Content creation', 'Analytics']),
                'urutan' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'sertifikasi_id' => $sertifikasi->skip(1)->first()->id,
                'judul' => 'HTML & CSS',
                'deskripsi' => 'Dasar-dasar markup dan styling',
                'poin_pembelajaran' => json_encode(['HTML elements', 'CSS styling', 'Responsive design']),
                'urutan' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'sertifikasi_id' => $sertifikasi->skip(1)->first()->id,
                'judul' => 'JavaScript Programming',
                'deskripsi' => 'Pemrograman JavaScript untuk web',
                'poin_pembelajaran' => json_encode(['JS basics', 'DOM manipulation', 'Event handling']),
                'urutan' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        echo "ModulSertifikasi seeded successfully!\n";
    }
}
