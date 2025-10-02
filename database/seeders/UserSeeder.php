<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create admin user
        $this->createAdminUser();
        
        // Create student users using factory
        $this->createStudentUsers();
        
        echo "Users seeded successfully with complete data!\n";
    }

    /**
     * Create admin user
     */
    private function createAdminUser(): void
    {
        User::create([
            'nama' => 'Dr. Siti Nurhaliza',
            'nama_lengkap' => 'Dr. Siti Nurhaliza, M.Kom',
            'email' => 'admin@ujikom.com',
            'telepon' => '021-7896543',
            'password' => Hash::make('admin123'),
            'alamat' => 'Jl. Pendidikan No. 45, Jakarta Selatan 12560',
            'tanggal_lahir' => '1985-03-15',
            'tempat_lahir' => 'Jakarta',
            'role' => 'admin',
            'status_akun' => 'aktif',
            'aktif' => true,
            'foto_profil' => null,
            'gender' => 'Perempuan',
            'email_verified_at' => now(),
        ]);
    }

    /**
     * Create student users using factory
     */
    private function createStudentUsers(): void
    {
        // Create realistic student data
        $this->createSpecificStudents();

        // Create additional random students with more variety
        try {
            User::factory(150)->mahasiswa()->create();
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            // If we get duplicate emails, create fewer users
            $remaining = 150 - User::where('role', 'mahasiswa')->where('email', 'not like', '%@ui.ac.id')
                                   ->where('email', 'not like', '%@itb.ac.id')
                                   ->where('email', 'not like', '%@ugm.ac.id')
                                   ->where('email', 'not like', '%@smkn%.sch.id')
                                   ->where('email', 'not like', '%@unpad.ac.id')
                                   ->where('email', 'not like', '%@uns.ac.id')
                                   ->where('email', 'not like', '%@unair.ac.id')
                                   ->where('email', 'not like', '%@ub.ac.id')
                                   ->where('email', 'not like', '%@undip.ac.id')
                                   ->count();
            if ($remaining > 0) {
                User::factory($remaining)->mahasiswa()->create();
            }
        }
    }

    /**
     * Create specific realistic students with diverse backgrounds
     */
    private function createSpecificStudents(): void
    {
        $students = [
            // Universitas Indonesia students
            [
                'nama' => 'Ahmad Rizki Pratama',
                'nama_lengkap' => 'Ahmad Rizki Pratama',
                'email' => 'ahmad.rizki@ui.ac.id',
                'telepon' => '08123456789',
                'alamat' => 'Jl. Merdeka No. 12, Bekasi Timur, Jawa Barat',
                'tanggal_lahir' => '2002-05-20',
                'tempat_lahir' => 'Bekasi',
                'gender' => 'Laki-laki',
            ],
            [
                'nama' => 'Sari Dewi Lestari',
                'nama_lengkap' => 'Sari Dewi Lestari',
                'email' => 'sari.dewi@ui.ac.id',
                'telepon' => '08234567890',
                'alamat' => 'Jl. Kebon Jeruk No. 8, Jakarta Barat, DKI Jakarta',
                'tanggal_lahir' => '2001-11-10',
                'tempat_lahir' => 'Jakarta',
                'gender' => 'Perempuan',
            ],
            [
                'nama' => 'Budi Santoso',
                'nama_lengkap' => 'Budi Santoso',
                'email' => 'budi.santoso@ui.ac.id',
                'telepon' => '08345678901',
                'alamat' => 'Jl. Sudirman No. 15, Tangerang, Banten',
                'tanggal_lahir' => '2002-01-25',
                'tempat_lahir' => 'Tangerang',
                'gender' => 'Laki-laki',
            ],
            [
                'nama' => 'Rina Maharani',
                'nama_lengkap' => 'Rina Maharani',
                'email' => 'rina.maharani@ui.ac.id',
                'telepon' => '08456789012',
                'alamat' => 'Jl. Gatot Subroto No. 20, Depok, Jawa Barat',
                'tanggal_lahir' => '2001-08-12',
                'tempat_lahir' => 'Depok',
                'gender' => 'Perempuan',
            ],
            [
                'nama' => 'Dimas Adi Putra',
                'nama_lengkap' => 'Dimas Adi Putra',
                'email' => 'dimas.adi@ui.ac.id',
                'telepon' => '08567890123',
                'alamat' => 'Jl. Diponegoro No. 33, Bogor, Jawa Barat',
                'tanggal_lahir' => '2002-04-08',
                'tempat_lahir' => 'Bogor',
                'gender' => 'Laki-laki',
            ],

            // Institut Teknologi Bandung students
            [
                'nama' => 'Maya Sari Putri',
                'nama_lengkap' => 'Maya Sari Putri',
                'email' => 'maya.sari@itb.ac.id',
                'telepon' => '08678901234',
                'alamat' => 'Jl. Cihampelas No. 45, Bandung, Jawa Barat',
                'tanggal_lahir' => '2001-12-03',
                'tempat_lahir' => 'Bandung',
                'gender' => 'Perempuan',
            ],
            [
                'nama' => 'Rizky Ramadhan',
                'nama_lengkap' => 'Rizky Ramadhan',
                'email' => 'rizky.ramadhan@itb.ac.id',
                'telepon' => '08789012345',
                'alamat' => 'Jl. Dago No. 67, Bandung, Jawa Barat',
                'tanggal_lahir' => '2002-03-15',
                'tempat_lahir' => 'Bandung',
                'gender' => 'Laki-laki',
            ],

            // Universitas Gadjah Mada students
            [
                'nama' => 'Citra Ayu Lestari',
                'nama_lengkap' => 'Citra Ayu Lestari',
                'email' => 'citra.ayu@ugm.ac.id',
                'telepon' => '08890123456',
                'alamat' => 'Jl. Kaliurang No. 89, Yogyakarta, DIY',
                'tanggal_lahir' => '2001-07-22',
                'tempat_lahir' => 'Yogyakarta',
                'gender' => 'Perempuan',
            ],
            [
                'nama' => 'Fajar Nugroho',
                'nama_lengkap' => 'Fajar Nugroho',
                'email' => 'fajar.nugroho@ugm.ac.id',
                'telepon' => '08901234567',
                'alamat' => 'Jl. Colombo No. 12, Yogyakarta, DIY',
                'tanggal_lahir' => '2002-09-18',
                'tempat_lahir' => 'Yogyakarta',
                'gender' => 'Laki-laki',
            ],

            // SMK students
            [
                'nama' => 'Andi Saputra',
                'nama_lengkap' => 'Andi Saputra',
                'email' => 'andi.saputra@smkn1jakarta.sch.id',
                'telepon' => '08111222333',
                'alamat' => 'Jl. Budi Utomo No. 25, Jakarta Pusat, DKI Jakarta',
                'tanggal_lahir' => '2004-06-10',
                'tempat_lahir' => 'Jakarta',
                'gender' => 'Laki-laki',
            ],
            [
                'nama' => 'Nadia Putri Sari',
                'nama_lengkap' => 'Nadia Putri Sari',
                'email' => 'nadia.putri@smkn2bandung.sch.id',
                'telepon' => '08222333444',
                'alamat' => 'Jl. Asia Afrika No. 78, Bandung, Jawa Barat',
                'tanggal_lahir' => '2004-02-28',
                'tempat_lahir' => 'Bandung',
                'gender' => 'Perempuan',
            ],
            [
                'nama' => 'Rian Pratama',
                'nama_lengkap' => 'Rian Pratama',
                'email' => 'rian.pratama@smkn3surabaya.sch.id',
                'telepon' => '08333444555',
                'alamat' => 'Jl. Tunjungan No. 45, Surabaya, Jawa Timur',
                'tanggal_lahir' => '2004-11-05',
                'tempat_lahir' => 'Surabaya',
                'gender' => 'Laki-laki',
            ],

            // More university students from various regions
            [
                'nama' => 'Dewi Sartika',
                'nama_lengkap' => 'Dewi Sartika',
                'email' => 'dewi.sartika@unpad.ac.id',
                'telepon' => '08444555666',
                'alamat' => 'Jl. Dipati Ukur No. 35, Bandung, Jawa Barat',
                'tanggal_lahir' => '2001-10-14',
                'tempat_lahir' => 'Bandung',
                'gender' => 'Perempuan',
            ],
            [
                'nama' => 'Hendra Gunawan',
                'nama_lengkap' => 'Hendra Gunawan',
                'email' => 'hendra.gunawan@uns.ac.id',
                'telepon' => '08555666777',
                'alamat' => 'Jl. Ir. Sutami No. 36, Surakarta, Jawa Tengah',
                'tanggal_lahir' => '2002-07-30',
                'tempat_lahir' => 'Surakarta',
                'gender' => 'Laki-laki',
            ],
            [
                'nama' => 'Lina Marlina',
                'nama_lengkap' => 'Lina Marlina',
                'email' => 'lina.marlina@unair.ac.id',
                'telepon' => '08666777888',
                'alamat' => 'Jl. Airlangga No. 4, Surabaya, Jawa Timur',
                'tanggal_lahir' => '2001-04-17',
                'tempat_lahir' => 'Surabaya',
                'gender' => 'Perempuan',
            ],
            [
                'nama' => 'Taufik Hidayat',
                'nama_lengkap' => 'Taufik Hidayat',
                'email' => 'taufik.hidayat@ub.ac.id',
                'telepon' => '08777888999',
                'alamat' => 'Jl. Veteran No. 12, Malang, Jawa Timur',
                'tanggal_lahir' => '2002-12-08',
                'tempat_lahir' => 'Malang',
                'gender' => 'Laki-laki',
            ],
            [
                'nama' => 'Siti Aminah',
                'nama_lengkap' => 'Siti Aminah',
                'email' => 'siti.aminah@undip.ac.id',
                'telepon' => '08888999000',
                'alamat' => 'Jl. Prof. Sudarto No. 13, Semarang, Jawa Tengah',
                'tanggal_lahir' => '2001-01-22',
                'tempat_lahir' => 'Semarang',
                'gender' => 'Perempuan',
            ],
        ];

        foreach ($students as $student) {
            User::create(array_merge($student, [
                'password' => Hash::make('student123'),
                'role' => 'mahasiswa',
                'status_akun' => 'aktif',
                'aktif' => true,
                'foto_profil' => null,
                'email_verified_at' => now(),
            ]));
        }
    }
}
