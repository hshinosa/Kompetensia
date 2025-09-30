<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UserActivity;
use App\Models\User;

class UserActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'mahasiswa')->get();

        if ($users->isEmpty()) {
            $this->command->info('No mahasiswa users found. Please run UserSeeder first.');
            return;
        }

        $activityTypes = [
            'registration' => [
                'Login ke sistem',
                'Mendaftar program sertifikasi',
                'Mendaftar program PKL',
                'Update profil pengguna',
                'Mengunggah dokumen pendaftaran',
            ],
            'learning' => [
                'Mengakses materi pembelajaran',
                'Menonton video tutorial',
                'Membaca artikel blog',
                'Download materi sertifikasi',
                'Mengerjakan quiz online',
            ],
            'submission' => [
                'Upload tugas sertifikasi',
                'Submit laporan PKL',
                'Upload dokumen proposal',
                'Revisi tugas berdasarkan feedback',
                'Submit laporan akhir PKL',
            ],
            'communication' => [
                'Mengirim pesan ke pembimbing',
                'Konsultasi dengan asesor',
                'Diskusi di forum',
                'Update status progress',
                'Konfirmasi jadwal assessment',
            ],
            'achievement' => [
                'Menyelesaikan modul sertifikasi',
                'Lulus assessment sertifikasi',
                'Menyelesaikan periode PKL',
                'Mendapat sertifikat kompetensi',
                'Achievement unlock: First submission',
            ]
        ];

        foreach ($users as $user) {
            // Generate 10-25 aktivitas per user
            $numActivities = rand(10, 25);
            
            for ($i = 0; $i < $numActivities; $i++) {
                $activityCategory = array_rand($activityTypes);
                $activities = $activityTypes[$activityCategory];
                $selectedActivity = $activities[array_rand($activities)];
                
                UserActivity::create([
                    'user_id' => $user->id,
                    'jenis_aktivitas' => $activityCategory,
                    'deskripsi' => $selectedActivity,
                    'metadata' => json_encode([
                        'category' => $activityCategory,
                        'timestamp' => now()->toISOString(),
                        'session_id' => 'sess_' . uniqid()
                    ]),
                    'alamat_ip' => $this->generateRandomIP(),
                    'user_agent' => $this->generateRandomUserAgent(),
                    'created_at' => now()->subDays(rand(1, 90))->subHours(rand(0, 23))->subMinutes(rand(0, 59)),
                    'updated_at' => now()->subDays(rand(1, 90))->subHours(rand(0, 23))->subMinutes(rand(0, 59)),
                ]);
            }
        }

        $this->command->info('UserActivity seeded successfully with ' . UserActivity::count() . ' activities!');
    }

    private function generateRandomIP(): string
    {
        return rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255);
    }

    private function generateRandomUserAgent(): string
    {
        $userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
            'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0'
        ];

        return $userAgents[array_rand($userAgents)];
    }
}