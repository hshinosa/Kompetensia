<?php

namespace Database\Factories;

use App\Models\PKL;
use Illuminate\Database\Eloquent\Factories\Factory;

class PKLFactory extends Factory
{
    protected $model = PKL::class;

    public function definition(): array
    {
        return [
            'nama_program' => $this->faker->sentence(3),
            'deskripsi' => $this->faker->paragraph(),
            'durasi_minggu' => 4,
            'peserta_terdaftar' => 0,
            'status' => 'Aktif',
            'persyaratan' => [],
            'benefit' => []
        ];
    }
}
