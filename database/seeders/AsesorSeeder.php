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
                'jabatan' => 'Digital Marketing Consultant',
                'instansi' => 'PT. Digital Solutions Indonesia',
                'bio' => 'Praktisi digital marketing dengan pengalaman 15+ tahun',
                'foto' => null,
                'email' => 'budi.santoso@digitalsolid.id',
                'phone' => '081234567891',
                'keahlian' => json_encode(['Digital Marketing', 'SEO', 'Social Media Marketing']),
                'sertifikat' => json_encode(['Google Ads Certified', 'Facebook Blueprint Certified']),
                'status' => 'Aktif',
            ],
            [
                'nama_asesor' => 'Prof. Sari Wijaya',
                'jabatan' => 'Senior Software Engineer',
                'instansi' => 'Tech Corp Indonesia',
                'bio' => 'Senior engineer dengan spesialisasi dalam web development dan sistem terdistribusi',
                'foto' => null,
                'email' => 'sari.wijaya@techcorp.id',
                'phone' => '081234567892',
                'keahlian' => json_encode(['PHP', 'Laravel', 'Vue.js', 'System Architecture']),
                'sertifikat' => json_encode(['AWS Certified Solutions Architect', 'Laravel Certified Developer']),
                'status' => 'Aktif',
            ],
            [
                'nama_asesor' => 'Ir. Andi Prasetyo',
                'jabatan' => 'Senior Network Engineer',
                'instansi' => 'Net Solutions Corp',
                'bio' => 'Network specialist dengan fokus pada keamanan jaringan dan infrastruktur IT',
                'foto' => null,
                'email' => 'andi.prasetyo@netsol.id',
                'phone' => '081234567893',
                'keahlian' => json_encode(['Network Security', 'Cisco', 'Linux Administration']),
                'sertifikat' => json_encode(['CCNA', 'CCNP Security', 'CompTIA Security+']),
                'status' => 'Aktif',
            ]
        ];

        foreach ($asesors as $asesorData) {
            Asesor::firstOrCreate(
                ['email' => $asesorData['email']],
                $asesorData
            );
        }

        echo "Asesor seeded successfully!\n";
    }
}
