<?php

namespace Database\Seeders;

use App\Models\Sertifikasi;
use Illuminate\Database\Seeder;

class SertifikasiSeeder extends Seeder
{
    public function run(): void
    {
        // Use raw DB insert to avoid Eloquent issues
        \Illuminate\Support\Facades\DB::table('sertifikasi')->insert([
            [
                'nama_sertifikasi' => 'Digital Marketing',
                'jenis_sertifikasi' => 'Industri', 
                'deskripsi' => 'Sertifikasi digital marketing',
                'nama_asesor' => 'Dr. Budi',
                'jabatan_asesor' => 'Consultant',
                'instansi_asesor' => 'PT. Digital',
                'tipe_sertifikat' => 'Sertifikat Profesi',
                'kapasitas_peserta' => 25,
                'status' => 'Aktif',
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_sertifikasi' => 'Web Development',
                'jenis_sertifikasi' => 'Internal',
                'deskripsi' => 'Sertifikasi web development', 
                'nama_asesor' => 'Prof. Sari',
                'jabatan_asesor' => 'Engineer',
                'instansi_asesor' => 'Tech Corp',
                'tipe_sertifikat' => 'Sertifikat Keahlian',
                'kapasitas_peserta' => 20,
                'status' => 'Aktif',
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        echo "Sertifikasi seeded successfully!\n";
    }
}
