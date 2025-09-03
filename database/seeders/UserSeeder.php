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
            'name' => 'Administrator',
            'email' => 'admin@kompetensia.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'user_type' => 'admin',
            'full_name' => 'Administrator Kompetensia',
            'phone' => '081234567890',
            'address' => 'Jl. Admin No. 1, Jakarta Pusat',
            'birth_date' => '1990-01-01',
            'birth_place' => 'Jakarta',
            'institution' => 'Kompetensia',
            'major' => 'Information Technology',
            'semester' => null,
            'is_active' => true,
            'account_status' => 'active',
            'email_verified_at' => now(),
        ]);
    }

    /**
     * Create student users using factory
     */
    private function createStudentUsers(): void
    {
        // Create 30 student users using factory
        User::factory(30)->student()->create();
    }
}
