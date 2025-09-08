<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sertifikasi;
use App\Models\Asesor;

class SertifikasiSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus data lama dengan menghapus foreign key dependencies dulu
        \Illuminate\Support\Facades\DB::table('modul_sertifikasi')->delete();
        \Illuminate\Support\Facades\DB::table('batch_sertifikasi')->delete();
        \Illuminate\Support\Facades\DB::table('pendaftaran_sertifikasi')->delete();
        \Illuminate\Support\Facades\DB::table('sertifikasi')->delete();
        
        // Seeder berdasarkan struktur tabel yang benar
        $sertifikasiData = [
            [
                'nama_sertifikasi' => 'Digital Marketing',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Sertifikasi digital marketing untuk meningkatkan kemampuan pemasaran digital',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Profesi']),
                'status' => 'Aktif',
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Web Development',
                'jenis_sertifikasi' => 'BNSP',
                'deskripsi' => 'Sertifikasi web development untuk pengembangan aplikasi web',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Keahlian']),
                'status' => 'Aktif',
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Network Engineering',
                'jenis_sertifikasi' => 'BNSP',
                'deskripsi' => 'Sertifikasi jaringan komputer untuk teknisi jaringan',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Pelatihan']),
                'status' => 'Aktif',
                'created_by' => 1,
                'updated_by' => 1,
            ]
        ];

        foreach ($sertifikasiData as $data) {
            Sertifikasi::create($data);
        }

        echo "Sertifikasi seeded successfully!\n";
    }
}
