<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UploadTugasSertifikasi;
use App\Models\PendaftaranSertifikasi;
use App\Models\User;

class UploadTugasSertifikasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil semua pendaftaran sertifikasi yang sudah ada
        $pendaftaranSertifikasi = PendaftaranSertifikasi::with('user')->get();

        if ($pendaftaranSertifikasi->isEmpty()) {
            $this->command->info('No Sertifikasi registrations found. Please run PendaftaranSertifikasiSeeder first.');
            return;
        }

        $tugasTypes = [
            'Tugas Praktik HTML & CSS',
            'Implementasi JavaScript Interaktif',
            'Project Bootstrap Responsive',
            'Pengembangan API dengan Laravel',
            'Database Design dan Query',
            'Testing dan Quality Assurance',
            'Deployment dan Hosting',
            'Security Implementation',
            'Performance Optimization',
            'Final Project Portfolio'
        ];

        $statuses = ['pending', 'approved', 'rejected'];
        $assessors = ['Dr. Budi Santoso', 'Prof. Andi Kurniawan', 'Dewi Maharani, M.Kom', 'Reza Pratama, S.T'];

        foreach ($pendaftaranSertifikasi as $pendaftaran) {
            // Untuk setiap pendaftaran, buat 3-6 upload tugas
            $numTasks = rand(3, 6);
            
            for ($i = 0; $i < $numTasks; $i++) {
                $judulTugas = $tugasTypes[array_rand($tugasTypes)];
                $status = $statuses[array_rand($statuses)];
                $isLinkSubmission = rand(0, 1); // 50% chance untuk link submission
                $assessorUser = User::where('role', 'admin')->inRandomOrder()->first();
                
                UploadTugasSertifikasi::create([
                    'user_id' => $pendaftaran->user_id,
                    'sertifikasi_id' => $pendaftaran->sertifikasi_id,
                    'pendaftaran_id' => $pendaftaran->id,
                    'judul_tugas' => $judulTugas,
                    'link_url' => $isLinkSubmission ? $this->generateLinkUrl($judulTugas) : null,
                    'nama_file' => !$isLinkSubmission ? $this->generateFileName($judulTugas, $pendaftaran->user->name) : null,
                    'path_file' => !$isLinkSubmission ? '/storage/sertifikasi_documents/' . $pendaftaran->id . '/' . $i . '_' . time() . '.zip' : null,
                    'ukuran_file' => !$isLinkSubmission ? rand(1000000, 10000000) : null, // dalam bytes
                    'tipe_mime' => !$isLinkSubmission ? 'application/zip' : null,
                    'status' => $status,
                    'feedback' => $status !== 'pending' ? $this->generateFeedback($status, $judulTugas) : null,
                    'dinilai_oleh' => $status !== 'pending' && $assessorUser ? $assessorUser->id : null,
                    'tanggal_upload' => now()->subDays(rand(1, 45)),
                    'tanggal_penilaian' => $status !== 'pending' ? now()->subDays(rand(1, 30)) : null,
                    'created_at' => now()->subDays(rand(1, 45)),
                    'updated_at' => now()->subDays(rand(1, 30)),
                ]);
            }
        }

        $this->command->info('UploadTugasSertifikasi seeded successfully with sample tasks!');
    }

    private function generateDeskripsiTugas($judulTugas): string
    {
        $deskripsiTemplates = [
            'Tugas Praktik HTML & CSS' => 'Buat halaman web responsive menggunakan HTML5 dan CSS3 dengan menerapkan semantic markup dan modern CSS techniques.',
            'Implementasi JavaScript Interaktif' => 'Develop interactive web components menggunakan vanilla JavaScript atau framework pilihan dengan fokus pada user experience.',
            'Project Bootstrap Responsive' => 'Implementasikan design responsive menggunakan Bootstrap framework dengan grid system dan component library.',
            'Pengembangan API dengan Laravel' => 'Buat RESTful API menggunakan Laravel dengan authentication, validation, dan proper error handling.',
            'Database Design dan Query' => 'Design database schema yang optimal dan implementasikan complex queries untuk sistem informasi.',
            'Testing dan Quality Assurance' => 'Implementasikan unit testing, integration testing, dan automated testing untuk memastikan kualitas aplikasi.',
            'Deployment dan Hosting' => 'Deploy aplikasi ke production environment dengan konfigurasi server yang optimal dan secure.',
            'Security Implementation' => 'Implementasikan security best practices termasuk authentication, authorization, dan data protection.',
            'Performance Optimization' => 'Optimize aplikasi untuk performance dengan teknik caching, query optimization, dan asset optimization.',
            'Final Project Portfolio' => 'Develop portfolio project yang comprehensive sebagai capstone project untuk demonstrasi skills.'
        ];

        return $deskripsiTemplates[$judulTugas] ?? 'Tugas praktik untuk menguji pemahaman dan kemampuan implementasi konsep yang telah dipelajari.';
    }

    private function generateLinkUrl($judulTugas): string
    {
        $linkTemplates = [
            'https://github.com/username/html-css-project',
            'https://codepen.io/username/pen/responsive-design',
            'https://github.com/username/javascript-interactive',
            'https://netlify.app/bootstrap-project',
            'https://github.com/username/laravel-api',
            'https://vercel.app/portfolio-project',
            'https://heroku.app/web-application',
            'https://github.com/username/testing-suite'
        ];

        return $linkTemplates[array_rand($linkTemplates)];
    }

    private function generateFileName($judulTugas, $userName): string
    {
        $cleanName = str_replace(' ', '_', strtolower($userName));
        $cleanTask = str_replace([' ', '&'], ['_', 'and'], strtolower($judulTugas));
        $timestamp = date('Ymd');
        
        return $cleanName . '_' . substr($cleanTask, 0, 20) . '_' . $timestamp . '.zip';
    }

    private function generateFeedback($status, $judulTugas): string
    {
        if ($status === 'approved') {
            $approvedFeedback = [
                'Excellent work! Implementasi sudah sesuai dengan requirement dan best practices.',
                'Great job! Code quality sangat baik dan dokumentasi lengkap.',
                'Outstanding! Creativity dan technical implementation sangat impressive.',
                'Perfect execution! Semua kriteria penilaian terpenuhi dengan baik.',
                'Approved with distinction. Project ini bisa menjadi reference untuk peserta lain.'
            ];
            return $approvedFeedback[array_rand($approvedFeedback)];
        } else {
            $rejectedFeedback = [
                'Code perlu improvement pada bagian structure dan organization. Silakan review best practices.',
                'Functionality belum complete sesuai requirement. Mohon perbaiki fitur yang missing.',
                'Performance dan optimization masih perlu ditingkatkan. Gunakan profiling tools.',
                'Security implementation kurang. Tambahkan validation dan sanitization.',
                'Documentation masih minimal. Tambahkan comments dan README yang comprehensive.',
                'Testing coverage masih rendah. Implementasikan unit tests yang adequate.'
            ];
            return $rejectedFeedback[array_rand($rejectedFeedback)];
        }
    }
}