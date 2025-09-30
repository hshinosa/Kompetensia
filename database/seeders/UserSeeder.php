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
        
        // Create additional random students
        User::factory(25)->mahasiswa()->create();
    }

    /**
     * Create specific realistic students
     */
    private function createSpecificStudents(): void
    {
        $students = [
            [
                'nama' => 'Ahmad Rizki Pratama',
                'nama_lengkap' => 'Ahmad Rizki Pratama',
                'email' => 'ahmad.rizki@student.ac.id',
                'telepon' => '08123456789',
                'alamat' => 'Jl. Merdeka No. 12, Bekasi Timur',
                'tanggal_lahir' => '2002-05-20',
                'tempat_lahir' => 'Bekasi',
                'gender' => 'Laki-laki',
            ],
            [
                'nama' => 'Sari Dewi Lestari',
                'nama_lengkap' => 'Sari Dewi Lestari',
                'email' => 'sari.dewi@student.ac.id',
                'telepon' => '08234567890',
                'alamat' => 'Jl. Kebon Jeruk No. 8, Jakarta Barat',
                'tanggal_lahir' => '2001-11-10',
                'tempat_lahir' => 'Jakarta',
                'gender' => 'Perempuan',
            ],
            [
                'nama' => 'Budi Santoso',
                'nama_lengkap' => 'Budi Santoso',
                'email' => 'budi.santoso@student.ac.id',
                'telepon' => '08345678901',
                'alamat' => 'Jl. Sudirman No. 15, Tangerang',
                'tanggal_lahir' => '2002-01-25',
                'tempat_lahir' => 'Tangerang',
                'gender' => 'Laki-laki',
            ],
            [
                'nama' => 'Rina Maharani',
                'nama_lengkap' => 'Rina Maharani',
                'email' => 'rina.maharani@student.ac.id',
                'telepon' => '08456789012',
                'alamat' => 'Jl. Gatot Subroto No. 20, Depok',
                'tanggal_lahir' => '2001-08-12',
                'tempat_lahir' => 'Depok',
                'gender' => 'Perempuan',
            ],
            [
                'nama' => 'Dimas Adi Putra',
                'nama_lengkap' => 'Dimas Adi Putra',
                'email' => 'dimas.adi@student.ac.id',
                'telepon' => '08567890123',
                'alamat' => 'Jl. Diponegoro No. 33, Bogor',
                'tanggal_lahir' => '2002-04-08',
                'tempat_lahir' => 'Bogor',
                'gender' => 'Laki-laki',
            ]
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
