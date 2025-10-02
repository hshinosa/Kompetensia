<?php

namespace Database\Seeders;

use App\Models\PendaftaranSertifikasi;
use App\Models\User;
use App\Models\Sertifikasi;
use App\Models\BatchSertifikasi;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class PendaftaranSertifikasiSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks temporarily
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Clear existing data to prevent duplicates
        PendaftaranSertifikasi::truncate();
        
        // Re-enable foreign key checks
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        $users = User::where('role', 'mahasiswa')->pluck('id')->toArray();
        $sertifikasiIds = Sertifikasi::pluck('id')->toArray();
        $batchIds = BatchSertifikasi::pluck('id')->toArray();

        if (empty($users) || empty($sertifikasiIds) || empty($batchIds)) {
            $this->command->warn('No users, certifications, or batches available for seeding');
            return;
        }

        // Only select 60% of users to register for certifications (more realistic)
        $selectedUsers = collect($users)->random(intval(count($users) * 0.6))->toArray();
        $usedUsers = []; // Track used users to avoid duplicates

        $faker = Faker::create('id_ID');

        $statusOptions = ['Pengajuan', 'Disetujui', 'Ditolak'];
        $jenisInstitusiOptions = ['Sekolah', 'Universitas'];
        $yaTidakOptions = ['ya', 'tidak'];

        // Sample data pools
        $motivations = [
            'Ingin meningkatkan kompetensi di bidang teknologi informasi untuk karir yang lebih baik.',
            'Mempersiapkan diri untuk dunia kerja dengan sertifikasi yang diakui industri.',
            'Meningkatkan skill digital marketing untuk mengembangkan bisnis online.',
            'Tertarik mempelajari web development secara mendalam dan profesional.',
            'Ingin menguasai teknologi terbaru dalam pengembangan aplikasi mobile.',
            'Membutuhkan sertifikasi untuk melengkapi portfolio profesional.',
            'Berkeinginan mengembangkan karir di bidang IT dan teknologi.',
            'Ingin menambah pengetahuan tentang data science dan analytics.',
            'Mempersiapkan diri untuk menjadi freelancer di bidang teknologi.',
            'Tertarik dengan perkembangan artificial intelligence dan machine learning.'
        ];

        $sampleTasks = [
            'Implementasi Sistem Manajemen Database dengan MySQL',
            'Pengembangan Aplikasi Web Responsif menggunakan React',
            'Analisis Data dengan Machine Learning Python',
            'Desain Interface User Experience untuk Mobile App',
            'Optimasi Performa Website dan SEO',
            'Integrasi API RESTful Services dengan Laravel',
            'Pembuatan Dashboard Analytics dengan Chart.js',
            'Implementasi Sistem Keamanan Web',
            'Pengembangan Mobile Application dengan Flutter',
            'Automatisasi Testing dan CI/CD Pipeline'
        ];

        $rejectionNotes = [
            'Persyaratan administrasi belum lengkap. Silakan lengkapi dokumen yang diperlukan.',
            'Pengalaman di bidang terkait masih kurang. Disarankan mengikuti kursus dasar terlebih dahulu.',
            'Kapasitas batch sudah penuh. Silakan daftar di periode berikutnya.',
            'Tidak memenuhi kriteria minimum yang ditetapkan untuk program ini.',
            'Portfolio yang diserahkan belum menunjukkan kompetensi yang sesuai.',
            'Jadwal yang dipilih bentrok dengan komitmen akademik. Pilih batch yang sesuai.',
            'Perlu melengkapi pengalaman praktis di bidang terkait.',
            'Motivasi yang disampaikan kurang spesifik dan detail.'
        ];

        for ($i = 0; $i < 85; $i++) {
            // Ensure no duplicate users in registrations
            $availableUsers = array_diff($selectedUsers, $usedUsers);
            if (empty($availableUsers)) {
                // If all selected users are used, break the loop
                break;
            }
            
            $userId = $faker->randomElement($availableUsers);
            $usedUsers[] = $userId;
            
            $sertifikasiId = $faker->randomElement($sertifikasiIds);
            $batchId = $faker->randomElement($batchIds);
            $status = $faker->randomElement($statusOptions);

            // Generate realistic dates
            $tanggalPendaftaran = $faker->dateTimeBetween('-2 months', 'now');

            $data = [
                'user_id' => $userId,
                'sertifikasi_id' => $sertifikasiId,
                'batch_id' => $batchId,
                'status' => $status,
                'tanggal_pendaftaran' => $tanggalPendaftaran,
                
                // Basic Data - only fields that exist in migration
                'nama_lengkap' => $faker->name(),
                'email' => $faker->unique()->safeEmail(),
                'no_telp' => '08' . $faker->numerify('##########'),
                'motivasi' => $faker->randomElement($motivations),
                
                // Berkas persyaratan as JSON
                'berkas_persyaratan' => json_encode([
                    'cv' => 'sertifikasi_documents/' . $faker->uuid() . '_CV.pdf',
                    'portfolio' => 'https://github.com/' . $faker->userName(),
                    'ijazah' => 'sertifikasi_documents/' . $faker->uuid() . '_Ijazah.pdf',
                    'foto' => 'sertifikasi_documents/' . $faker->uuid() . '_Foto.jpg',
                    'judul_tugas' => $faker->randomElement([
                        'Website E-commerce dengan Laravel dan Vue.js',
                        'Mobile Application Design dengan Figma',
                        'Dashboard Analytics dengan Chart.js',
                        'Sistem Manajemen Inventory',
                        'Portfolio Website Personal'
                    ])
                ]),
                
                // Add admin processing data if status is not 'Pengajuan'
                'catatan_admin' => $status !== 'Pengajuan' ? ($status === 'Ditolak' ? $faker->randomElement($rejectionNotes) : null) : null,
                'tanggal_diproses' => $status !== 'Pengajuan' ? $tanggalPendaftaran : null,
            ];

            PendaftaranSertifikasi::create($data);
        }

        $this->command->info('PendaftaranSertifikasi seeded successfully with correct data structure!');
    }
}
