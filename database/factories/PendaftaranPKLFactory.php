<?php

namespace Database\Factories;

use App\Models\PendaftaranPKL;
use App\Models\PKL;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PendaftaranPKLFactory extends Factory
{
    protected $model = PendaftaranPKL::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'pkl_id' => PKL::factory(),
            'status' => 'Approved'
        ];
    }
}
