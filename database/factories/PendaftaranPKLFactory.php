<?php

namespace Database\Factories;

use App\Models\PendaftaranPKL;
use App\Models\PosisiPKL;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PendaftaranPKLFactory extends Factory
{
    protected $model = PendaftaranPKL::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'posisi_pkl_id' => PosisiPKL::factory(),
            'tanggal_pendaftaran' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'status' => $this->faker->randomElement(['Pengajuan', 'Disetujui', 'Ditolak']),
            'motivasi' => $this->faker->paragraph()
        ];
    }
}
