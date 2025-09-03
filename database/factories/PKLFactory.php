<?php

namespace Database\Factories;

use App\Models\PosisiPKL;
use Illuminate\Database\Eloquent\Factories\Factory;

class PKLFactory extends Factory
{
    protected $model = PosisiPKL::class;

    public function definition(): array
    {
        return [
            'nama_posisi' => $this->faker->jobTitle(),
            'kategori' => $this->faker->randomElement(['Teknologi', 'Marketing', 'HR', 'Finance', 'Operations']),
            'deskripsi' => $this->faker->paragraph(),
            'persyaratan' => $this->faker->paragraph(),
            'benefit' => $this->faker->paragraph(),
            'lokasi' => $this->faker->city(),
            'tipe' => $this->faker->randomElement(['Remote', 'On-site', 'Hybrid']),
            'durasi_bulan' => $this->faker->numberBetween(1, 6),
            'jumlah_pendaftar' => $this->faker->numberBetween(5, 20),
            'status' => $this->faker->randomElement(['Aktif', 'Non-Aktif', 'Penuh']),
            'tanggal_mulai' => $this->faker->dateTimeBetween('now', '+1 month'),
            'tanggal_selesai' => $this->faker->dateTimeBetween('+2 months', '+8 months'),
            'created_by' => 1
        ];
    }
}
