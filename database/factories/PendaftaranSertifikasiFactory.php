<?php

namespace Database\Factories;

use App\Models\PendaftaranSertifikasi;
use App\Models\Sertifikasi;
use App\Models\BatchSertifikasi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PendaftaranSertifikasiFactory extends Factory
{
    protected $model = PendaftaranSertifikasi::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'sertifikasi_id' => Sertifikasi::factory(),
            'batch_id' => BatchSertifikasi::factory(),
            'status' => 'Approved'
        ];
    }
}
