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
        $firstName = fake('id_ID')->firstName();
        $lastName = fake('id_ID')->lastName();
        $fullName = $firstName . ' ' . $lastName;
        
        return [
            'nama' => $fullName,
            'nama_lengkap' => $fullName,
            'email' => fake()->unique()->safeEmail(),
            'telepon' => '08' . fake()->randomNumber(9, true),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'alamat' => fake('id_ID')->address(),
            'tanggal_lahir' => fake()->dateTimeBetween('1999-01-01', '2003-12-31')->format('Y-m-d'),
            'tempat_lahir' => fake('id_ID')->city(),
            'institusi' => fake()->randomElement([
                'Universitas Indonesia',
                'Institut Teknologi Bandung',
                'Universitas Gadjah Mada',
                'Universitas Airlangga',
                'Universitas Padjadjaran',
                'Institut Pertanian Bogor',
                'SMKN 1 Majalaya',
                'SMK Negeri 2 Depok',
                'SMK Negeri 1 Jakarta',
                'SMK Negeri 1 Bandung',
                'SMK Negeri 1 Cibinong'
            ]),
            'jurusan' => function (array $attributes) {
                // Check if institution is SMK
                if (str_contains($attributes['institusi'], 'SMK')) {
                    return fake()->randomElement([
                        'Teknik Komputer dan Jaringan',
                        'Rekayasa Perangkat Lunak',
                        'Multimedia',
                        'Sistem Informasi Jaringan dan Aplikasi',
                        'Teknik Elektronika Industri',
                        'Desain Komunikasi Visual',
                        'Broadcasting dan Perfilman',
                        'Animasi',
                        'Teknik Audio Video',
                        'Otomatisasi dan Tata Kelola Perkantoran'
                    ]);
                }
                // For universities, use university majors
                return fake()->randomElement([
                    'Teknik Informatika',
                    'Sistem Informasi',
                    'Teknik Komputer',
                    'Ilmu Komputer',
                    'Teknologi Informasi',
                    'Rekayasa Perangkat Lunak',
                    'Teknik Elektro',
                    'Manajemen Informatika',
                    'Desain Komunikasi Visual',
                    'Teknik Industri'
                ]);
            },
            'semester' => function (array $attributes) {
                // Check if institution is SMK - untuk SMK, semester dibiarkan null
                if (str_contains($attributes['institusi'], 'SMK')) {
                    return null;
                }
                // For universities, use semester numbers
                return fake()->numberBetween(4, 8);
            },
            'role' => 'mahasiswa',
            'aktif' => true,
            'status_akun' => 'aktif',
            'tipe_pengguna' => 'mahasiswa',
            'foto_profil' => null,
            // Gender dan Social Media
            'gender' => fake()->randomElement(['Laki-laki', 'Perempuan']),
            'instagram_handle' => fake()->optional(0.7)->userName(),
            'tiktok_handle' => fake()->optional(0.5)->userName(),
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
            'tipe_pengguna' => 'mahasiswa',
        ]);
    }

    /**
     * Create an admin user
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
            'tipe_pengguna' => 'admin',
        ]);
    }

    /**
     * Create an asesor user
     */
    public function asesor(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'mahasiswa',
            'tipe_pengguna' => 'asesor',
        ]);
    }

    /**
     * Create an instruktur user
     */
    public function instruktur(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'mahasiswa',
            'tipe_pengguna' => 'instruktur',
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
