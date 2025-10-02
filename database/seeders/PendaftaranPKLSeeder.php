<?php

namespace Database\Seeders;

use App\Models\PendaftaranPKL;
use App\Models\User;
use App\Models\PosisiPKL;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class PendaftaranPKLSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data to prevent duplicates
        PendaftaranPKL::query()->delete();
        
        $users = User::where('role', 'mahasiswa')->pluck('id')->toArray();
        $posisiPKLIds = PosisiPKL::pluck('id')->toArray();

        if (empty($users) || empty($posisiPKLIds)) {
            $this->command->warn('No users or positions available for seeding PKL registrations');
            return;
        }

        // Only select 45% of users to do PKL (more realistic - not all students do PKL)
        $selectedUsers = collect($users)->random(intval(count($users) * 0.45))->toArray();
        $usedUsers = []; // Track used users to avoid duplicates

        $faker = Faker::create('id_ID');

        $institusiOptions = ['Sekolah', 'Universitas'];
        $statusOptions = ['Pengajuan', 'Disetujui', 'Ditolak'];
        $yaTidakOptions = ['ya', 'tidak'];

        // Sample data pools
        $motivations = [
            'Ingin mendapatkan pengalaman praktis dalam dunia kerja profesional.',
            'Mengasah kemampuan teknis dan soft skills di lingkungan industri.',
            'Menerapkan ilmu yang dipelajari di kampus dalam proyek nyata.',
            'Mempersiapkan diri untuk memasuki dunia kerja setelah lulus.',
            'Memperluas networking dan membangun relasi profesional.',
            'Mengembangkan portfolio dengan proyek-proyek industri.',
            'Belajar budaya kerja dan dinamika tim dalam perusahaan.',
            'Mendalami teknologi dan tools yang digunakan di industri.',
            'Berkontribusi memberikan solusi inovatif untuk perusahaan.',
            'Meningkatkan kemampuan problem solving dalam situasi nyata.'
        ];

        $skillKelebihan = [
            'Mahir menggunakan Adobe Creative Suite (Photoshop, Illustrator, After Effects)',
            'Berpengalaman dalam web development dengan React dan Laravel',
            'Kemampuan analisis data menggunakan Python dan SQL',
            'Komunikasi interpersonal dan presentasi yang baik',
            'Leadership dan kemampuan koordinasi tim',
            'Problem solving dan critical thinking yang kuat',
            'Manajemen waktu dan multitasking yang efektif',
            'Kreatif dalam menghasilkan ide-ide inovatif',
            'Detail oriented dan teliti dalam menyelesaikan tugas',
            'Adaptif terhadap teknologi dan lingkungan kerja baru'
        ];

        $kemampuanDitingkatkan = [
            'Kemampuan komunikasi dan presentasi di depan klien',
            'Skill teknis programming dan framework terbaru',
            'Manajemen waktu dan prioritas tugas',
            'Kemampuan bekerja dalam tim lintas divisi',
            'Kreativitas dan inovasi dalam pemecahan masalah',
            'Kepemimpinan dan koordinasi proyek',
            'Kemampuan negosiasi dan persuasi',
            'Analytical thinking dan data interpretation',
            'Public speaking dan confidence building',
            'Technical writing dan dokumentasi'
        ];

        $nilaiDiri = ['A', 'B', 'C', 'D', 'E'];

        $kemampuanDitingkatkan = [
            'Komunikasi dan Public Speaking',
            'Problem Solving dan Critical Thinking',
            'Kemampuan Teknis Programming',
            'Project Management',
            'Creative Thinking dan Inovasi',
            'Teamwork dan Kolaborasi',
            'Time Management',
            'Digital Marketing',
            'Data Analysis',
            'Leadership Skills'
        ];

        $skillKelebihan = [
            'Mahir dalam Programming (Python, Java, PHP)',
            'Desain Grafis dan UI/UX Design',
            'Video Editing dan Content Creation',
            'Social Media Management',
            'Data Analysis dengan Excel/Google Sheets',
            'Web Development (HTML, CSS, JavaScript)',
            'Digital Marketing dan SEO',
            'Fotografi dan Videografi',
            'Public Speaking dan Presentasi',
            'Project Management Tools (Trello, Asana)'
        ];

        $rejectionNotes = [
            'Kuota posisi sudah terpenuhi. Silakan mendaftar di periode berikutnya.',
            'Skill yang dimiliki belum sesuai dengan requirement posisi.',
            'Jadwal PKL bentrok dengan kalender akademik. Pilih periode yang tepat.',
            'Portfolio yang diserahkan perlu diperkuat dengan project tambahan.',
            'Pengalaman dalam bidang terkait masih kurang mencukupi.',
            'Motivasi yang disampaikan kurang spesifik untuk posisi ini.',
            'Perlu melengkapi sertifikat atau training yang mendukung.',
            'Nilai akademik untuk posisi ini belum mencukupi.'
        ];

        // Available real files in pkl-documents directory
        $availableCVFiles = [
            '1758510023_cv_68d0bbc7b3fcb.pdf',
            '1758513367_cv_68d0c8d70c9bf.pdf',
            '1759106058_cv_68d9d40ae362f.pdf',
            '1759107391_cv_68d9d93f1f846.pdf',
            '1759107970_cv_68d9db82a7eaa.pdf',
            '1759155958_cv_68da96f650909.pdf',
            '1759158443_cv_68daa0abc561e.pdf'
        ];

        $availablePortfolioFiles = [
            '1758510027_portfolio_68d0bbcbd91ce.pdf',
            '1758513371_portfolio_68d0c8dbbeadf.pdf',
            '1759106062_portfolio_68d9d40eee294.pdf',
            '1759107393_portfolio_68d9d941b58b2.pdf',
            '1759107973_portfolio_68d9db85b1a59.pdf',
            '1759155961_portfolio_68da96f952bb4.pdf',
            '1759158447_portfolio_68daa0af10f8d.pdf'
        ];

        for ($i = 0; $i < 70; $i++) {
            // Ensure no duplicate users in PKL registrations
            $availableUsers = array_diff($selectedUsers, $usedUsers);
            if (empty($availableUsers)) {
                // If all selected users are used, break the loop
                break;
            }
            
            $userId = $faker->randomElement($availableUsers);
            $usedUsers[] = $userId;
            
            $posisiPklId = $faker->randomElement($posisiPKLIds);
            $institusiAsal = $faker->randomElement($institusiOptions);
            $status = $faker->randomElement($statusOptions);

            // Generate realistic dates
            $tanggalPendaftaran = $faker->dateTimeBetween('-2 months', 'now');
            $awalPkl = $faker->dateTimeBetween('now', '+1 month');
            $akhirPkl = $faker->dateTimeBetween($awalPkl, '+4 months');

            $data = [
                'user_id' => $userId,
                'posisi_pkl_id' => $posisiPklId,
                'status' => $status,
                'tanggal_pendaftaran' => $tanggalPendaftaran,
                'tanggal_mulai' => $status === 'Disetujui' ? $awalPkl : null,
                'tanggal_selesai' => $status === 'Disetujui' ? $akhirPkl : null,
                
                // Background Pendidikan
                'institusi_asal' => $institusiAsal,
                'asal_sekolah' => $faker->company() . ' ' . ($institusiAsal === 'Sekolah' ? 'SMA' : $institusiAsal),
                'program_studi' => $institusiAsal === 'Universitas' ? $faker->randomElement([
                    'Teknik Informatika', 'Sistem Informasi', 'Ilmu Komputer', 'Teknik Industri',
                    'Manajemen', 'Akuntansi', 'Desain Komunikasi Visual', 'Psikologi'
                ]) : null,
                'jurusan' => $institusiAsal === 'Sekolah' ? $faker->randomElement([
                    'IPA', 'IPS', 'Bahasa', 'Teknik Komputer Jaringan', 'Multimedia'
                ]) : $faker->randomElement([
                    'Teknik Informatika', 'Sistem Informasi', 'Manajemen', 'Akuntansi'
                ]),
                'kelas' => $institusiAsal === 'Sekolah' ? $faker->randomElement(['XI', 'XII']) : null,
                'semester' => $institusiAsal === 'Universitas' ? $faker->numberBetween(3, 8) : null,
                'awal_pkl' => $awalPkl,
                'akhir_pkl' => $akhirPkl,
                
                // Data Diri
                'nama_lengkap' => $faker->name(),
                'tempat_lahir' => $faker->city(),
                'tanggal_lahir' => $faker->dateTimeBetween('-25 years', '-17 years'),
                'email_pendaftar' => $faker->unique()->safeEmail(),
                'nomor_handphone' => '08' . $faker->numerify('##########'),
                'alamat' => $faker->address(),
                'instagram' => '@' . $faker->userName(),
                'tiktok' => '@' . $faker->userName(),
                
                // Persyaratan Khusus
                'memiliki_laptop' => $faker->randomElement($yaTidakOptions),
                'memiliki_kamera_dslr' => $faker->randomElement($yaTidakOptions),
                'transportasi_operasional' => $faker->randomElement([
                    'Motor pribadi', 'Mobil pribadi', 'Transportasi umum', 'Ojek online', 'Sepeda'
                ]),
                'apakah_merokok' => $faker->randomElement($yaTidakOptions),
                'bersedia_ditempatkan' => $faker->randomElement($yaTidakOptions),
                'bersedia_masuk_2_kali' => $faker->randomElement($yaTidakOptions),
                
                // Skill & Minat
                'kemampuan_ditingkatkan' => $faker->randomElement($kemampuanDitingkatkan),
                'skill_kelebihan' => $faker->randomElement($skillKelebihan),
                'pernah_membuat_video' => $faker->randomElement($yaTidakOptions),
                
                // Motivasi & Finalisasi
                'motivasi' => $faker->randomElement($motivations),
                'tingkat_motivasi' => $faker->numberBetween(7, 10),
                'nilai_diri' => $faker->randomElement($nilaiDiri),
                'sudah_melihat_profil' => 'ya',
                
                // Berkas - using real files
                'cv_file_path' => 'pkl-documents/' . $faker->randomElement($availableCVFiles),
                'cv_file_name' => 'CV_' . str_replace(' ', '_', $faker->name()) . '.pdf',
                'portfolio_file_path' => $faker->boolean(80) ? 'pkl-documents/' . $faker->randomElement($availablePortfolioFiles) : null,
                'portfolio_file_name' => $faker->boolean(80) ? 'Portfolio_' . str_replace(' ', '_', $faker->name()) . '.pdf' : null,
                'berkas_persyaratan' => json_encode([
                    'cv' => 'pkl-documents/' . $faker->randomElement($availableCVFiles),
                    'portfolio' => $faker->boolean(80) ? 'pkl-documents/' . $faker->randomElement($availablePortfolioFiles) : null,
                    'surat_pengantar' => null
                ]),
                
                // Admin fields
                'catatan_admin' => $status === 'Ditolak' ? $faker->randomElement($rejectionNotes) : null,
                'tanggal_diproses' => $status !== 'Pengajuan' ? $faker->dateTimeBetween($tanggalPendaftaran, 'now') : null,
                
                'created_at' => $tanggalPendaftaran,
                'updated_at' => $tanggalPendaftaran,
            ];

            PendaftaranPKL::create($data);
        }

        $this->command->info('PendaftaranPKL seeded successfully with comprehensive data!');
    }
}
