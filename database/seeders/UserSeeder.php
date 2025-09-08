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
            'nama' => 'Administrator',
            'nama_lengkap' => 'Administrator Kompetensia',
            'email' => 'admin@kompetensia.com',
            'telepon' => '081234567890',
            'password' => Hash::make('password'),
            'alamat' => 'Jl. Admin No. 1, Jakarta Pusat',
            'tanggal_lahir' => '1990-01-01',
            'tempat_lahir' => 'Jakarta',
            'institusi' => 'Kompetensia',
            'jurusan' => 'Information Technology',
            'semester' => null,
            'role' => 'admin',
            'aktif' => true,
            'status_akun' => 'aktif',
            'tipe_pengguna' => 'admin',
            'foto_profil' => null,
            'email_verified_at' => now(),
        ]);
    }

    /**
     * Create student users using factory
     */
    private function createStudentUsers(): void
    {
        // Create 30 student users using factory
        User::factory(30)->mahasiswa()->create();
    }
}
