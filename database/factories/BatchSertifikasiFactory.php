<?php

namespace Database\Factories;

use App\Models\BatchSertifikasi;
use App\Models\Sertifikasi;
use Illuminate\Database\Eloquent\Factories\Factory;

class BatchSertifikasiFactory extends Factory
{
    protected $model = BatchSertifikasi::class;

    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('-1 month', '+1 month');
        $end = (clone $start)->modify('+7 days');
        return [
            'sertifikasi_id' => Sertifikasi::factory(),
            'nama_batch' => 'Batch '.$this->faker->unique()->numberBetween(1,100),
            'tanggal_mulai' => $start->format('Y-m-d'),
            'tanggal_selesai' => $end->format('Y-m-d'),
            'status' => 'Aktif'
        ];
    }
}
