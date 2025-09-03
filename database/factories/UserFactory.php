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
            'name' => $fullName,
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => 'student',
            'user_type' => 'student',
            'full_name' => $fullName,
            'phone' => '08' . fake()->randomNumber(9, true),
            'address' => fake('id_ID')->address(),
            'birth_date' => fake()->dateTimeBetween('1999-01-01', '2003-12-31')->format('Y-m-d'),
            'birth_place' => fake('id_ID')->city(),
            'gender' => fake()->randomElement(['L', 'P']),
            'place_of_birth' => fake('id_ID')->city(),
            'date_of_birth' => fake()->dateTimeBetween('1999-01-01', '2003-12-31')->format('Y-m-d'),
            'institution' => fake()->randomElement([
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
            'major' => function (array $attributes) {
                // Check if institution is SMK
                if (str_contains($attributes['institution'], 'SMK')) {
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
                if (str_contains($attributes['institution'], 'SMK')) {
                    return null;
                }
                // For universities, use semester numbers
                return fake()->numberBetween(4, 8);
            },
            'is_active' => true,
            'account_status' => 'active',
            // PKL specific fields
            'school_university' => function (array $attributes) {
                return $attributes['institution'];
            },
            'major_concentration' => fake()->randomElement([
                'Software Engineering',
                'Web Development',
                'Mobile Development',
                'Database Management',
                'Network Security',
                'Artificial Intelligence',
                'Data Science',
                'UI/UX Design',
                'System Analysis',
                'Project Management'
            ]),
            'class_semester' => function (array $attributes) {
                // Check if institution is SMK
                if (str_contains($attributes['institution'], 'SMK')) {
                    return 'Kelas ' . fake()->randomElement(['X', 'XI', 'XII']);
                }
                // For universities, use semester format
                return 'Semester ' . $attributes['semester'];
            },
            'skills_to_improve' => fake()->randomElement([
                'Web Development, Database Management',
                'Mobile Development, UI/UX Design',
                'Data Analysis, Machine Learning',
                'Network Security, Cloud Computing',
                'Project Management, Leadership',
                'Frontend Development, JavaScript',
                'Backend Development, API Design',
                'DevOps, CI/CD Pipeline',
                'Digital Marketing, Content Creation',
                'Business Analysis, Documentation'
            ]),
            'skills_to_contribute' => fake()->randomElement([
                'Programming Skills, Problem Solving',
                'Design Thinking, Creative Solutions',
                'Technical Writing, Documentation',
                'Team Collaboration, Communication',
                'Research Skills, Data Analysis',
                'Customer Service, User Experience',
                'Quality Assurance, Testing',
                'Innovation, Fresh Perspective',
                'Social Media Management',
                'Event Organization, Coordination'
            ]),
            'preferred_field' => fake()->randomElement(['teknologi', 'marketing', 'kreatif', 'bisnis']),
            'preferred_field_type' => fake()->randomElement(['teknis', 'analitis', 'kreatif', 'manajerial']),
            'transportation' => fake()->randomElement(['punya', 'transportasi_umum', 'tidak']),
            'motivation_level' => fake()->numberBetween(6, 10),
            'self_rating' => fake()->randomElement(['A', 'B', 'C']),
            'has_laptop' => fake()->boolean(85),
            'has_dslr' => fake()->boolean(30),
            'has_video_review_experience' => fake()->boolean(40),
            'interested_in_content_creation' => fake()->boolean(60),
            'has_viewed_company_profile' => fake()->boolean(80),
            'is_smoker' => fake()->boolean(15),
            'agrees_to_school_return_if_violation' => true,
            'agrees_to_return_if_absent_twice' => true,
            'instagram_handle' => '@' . strtolower(str_replace(' ', '_', $firstName . '_' . substr($lastName, 0, 3))),
            'tiktok_handle' => fake()->boolean(70) ? '@' . strtolower(str_replace(' ', '.', $firstName . '.' . substr($lastName, 0, 3))) : null,
        ];
    }

    /**
     * Create a student user
     */
    public function student(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'student',
            'user_type' => 'student',
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
