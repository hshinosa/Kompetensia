<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = fake()->randomElement(['Laki-laki', 'Perempuan']);
        $firstName = fake('id_ID')->firstName($gender === 'Laki-laki' ? 'male' : 'female');
        $lastName = fake('id_ID')->lastName();
        $fullName = $firstName . ' ' . $lastName;
        
        // Generate realistic student email
        $emailPrefix = strtolower(str_replace(' ', '.', $firstName . '.' . $lastName));
        $emailPrefix = preg_replace('/[^a-z.]/', '', $emailPrefix);
        $domains = ['student.ac.id', 'mahasiswa.univ.ac.id', 'student.edu', 'gmail.com'];
        $email = $emailPrefix . '@' . fake()->randomElement($domains);
        
        // Generate realistic phone number (Indonesian format)
        $phoneProviders = ['0812', '0813', '0821', '0822', '0851', '0852', '0853'];
        $phone = fake()->randomElement($phoneProviders) . fake()->numerify('########');
        
        // Realistic birth year for students (18-22 years old)
        $birthYear = fake()->numberBetween(2002, 2006);
        $birthDate = fake()->dateTimeBetween($birthYear.'-01-01', $birthYear.'-12-31')->format('Y-m-d');
        
        // Indonesian cities for birth place
        $cities = [
            'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Bekasi', 'Tangerang', 
            'Depok', 'Semarang', 'Palembang', 'Makassar', 'Batam', 'Bogor',
            'Pekanbaru', 'Bandar Lampung', 'Yogyakarta', 'Solo', 'Malang',
            'Denpasar', 'Balikpapan', 'Samarinda', 'Pontianak', 'Jambi'
        ];
        
        return [
            'nama' => $fullName,
            'nama_lengkap' => $fullName,
            'email' => $email,
            'telepon' => $phone,
            'email_verified_at' => fake()->randomElement([now(), now()->subDays(rand(1, 30)), null]),
            'password' => static::$password ??= Hash::make('student123'),
            'alamat' => 'Jl. ' . fake('id_ID')->streetName() . ' No. ' . fake()->numberBetween(1, 999) . ', ' . fake('id_ID')->city(),
            'tanggal_lahir' => $birthDate,
            'tempat_lahir' => fake()->randomElement($cities),
            'role' => 'mahasiswa',
            'status_akun' => fake()->randomElement(['aktif', 'aktif', 'aktif', 'pending']), // Most are active
            'aktif' => fake()->randomElement([true, true, true, false]), // Most are active
            'foto_profil' => null,
            'gender' => $gender,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Create a mahasiswa user
     */
    public function mahasiswa(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'mahasiswa',
        ]);
    }

    /**
     * Create an admin user
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
        ]);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
