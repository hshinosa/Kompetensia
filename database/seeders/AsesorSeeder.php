<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Asesor;

class AsesorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $asesors = [
            [
                'nama_asesor' => 'Dr. Budi Santoso',
                'jabatan_asesor' => 'Digital Marketing Consultant',
                'instansi_asesor' => 'PT. Digital Solutions Indonesia',
                'foto_asesor' => null,
                'status' => 'Aktif',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_asesor' => 'Prof. Sari Wijaya',
                'jabatan_asesor' => 'Senior Software Engineer',
                'instansi_asesor' => 'Tech Corp Indonesia',
                'foto_asesor' => null,
                'status' => 'Aktif',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_asesor' => 'Ir. Andi Prasetyo',
                'jabatan_asesor' => 'Senior Network Engineer',
                'instansi_asesor' => 'Net Solutions Corp',
                'foto_asesor' => null,
                'status' => 'Aktif',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($asesors as $asesorData) {
            Asesor::create($asesorData);
        }

        echo "Asesor seeded successfully!\n";
    }
}
