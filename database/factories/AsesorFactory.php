<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Asesor>
 */
class AsesorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jabatan = [
            'Senior Consultant',
            'Technical Lead', 
            'Senior Engineer',
            'Principal Architect',
            'Solutions Architect',
            'Senior Specialist',
            'Expert Advisor'
        ];

        $instansi = [
            'PT. Digital Solutions Indonesia',
            'Tech Corp Indonesia', 
            'PT. Inovasi Teknologi',
            'Cyber Security Indonesia',
            'PT. Data Analytics Pro',
            'Cloud Solutions Corp',
            'PT. Software Development'
        ];

        return [
            'nama_asesor' => $this->faker->name(),
            'jabatan_asesor' => $this->faker->randomElement($jabatan),
            'instansi_asesor' => $this->faker->randomElement($instansi),
            'foto_asesor' => null,
            'status' => $this->faker->randomElement(['Aktif', 'Non-Aktif']),
            'created_by' => 1,
            'updated_by' => 1,
        ];
    }
}
