<?php

namespace Database\Factories;

use App\Models\Sertifikasi;
use Illuminate\Database\Eloquent\Factories\Factory;

class SertifikasiFactory extends Factory
{
    protected $model = Sertifikasi::class;

    public function definition(): array
    {
        return [
            'nama_sertifikasi' => $this->faker->sentence(3),
            'jenis_sertifikasi' => 'Kompetensi',
            'deskripsi' => $this->faker->paragraph(),
            'kapasitas_peserta' => 50,
            'status' => 'Aktif',
            'created_by' => null
        ];
    }
}
