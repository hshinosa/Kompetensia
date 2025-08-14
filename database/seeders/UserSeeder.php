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
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@kompetensia.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '081234567890',
            'email_verified_at' => now(),
        ]);

        // Create sample student users
        User::create([
            'name' => 'Ahmad Rizki',
            'email' => 'ahmad.rizki@student.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => '08123456789',
            'address' => 'Jl. Merdeka No. 123, Jakarta',
            'birth_date' => '2001-05-15',
            'birth_place' => 'Jakarta',
            'institution' => 'Universitas Indonesia',
            'major' => 'Teknik Informatika',
            'semester' => 6,
            'gpa' => 3.45,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Sari Wulandari',
            'email' => 'sari.wulandari@student.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => '08198765432',
            'address' => 'Jl. Sudirman No. 456, Bandung',
            'birth_date' => '2000-08-20',
            'birth_place' => 'Bandung',
            'institution' => 'Institut Teknologi Bandung',
            'major' => 'Sistem Informasi',
            'semester' => 7,
            'gpa' => 3.67,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi.santoso@student.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => '08567891234',
            'address' => 'Jl. Gatot Subroto No. 789, Surabaya',
            'birth_date' => '1999-12-10',
            'birth_place' => 'Surabaya',
            'institution' => 'Universitas Airlangga',
            'major' => 'Teknik Komputer',
            'semester' => 8,
            'gpa' => 3.12,
            'email_verified_at' => now(),
        ]);

        echo "Users seeded successfully!\n";
    }
}
