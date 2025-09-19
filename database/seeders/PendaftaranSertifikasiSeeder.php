<?php

namespace Database\Seeders;

use App\Models\PendaftaranSertifikasi;
use App\Models\User;
use App\Models\Sertifikasi;
use App\Models\BatchSertifikasi;
use Illuminate\Database\Seeder;

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
        
        $students = User::where('role', 'mahasiswa')->get();
        $sertifikasi = Sertifikasi::all();
        $batches = BatchSertifikasi::all();

        if ($students->count() === 0 || $sertifikasi->count() === 0 || $batches->count() === 0) {
            return;
        }

        // Status options with different probabilities
        $statusOptions = [
            'Pengajuan' => 40,     // 40% pending applications
            'Disetujui' => 35,     // 35% approved
            'Ditolak' => 25        // 25% rejected
        ];

        // Motivations pool
        $motivations = [
            'Ingin meningkatkan kompetensi di bidang teknologi informasi.',
            'Mempersiapkan diri untuk dunia kerja dengan sertifikasi yang diakui industri.',
            'Meningkatkan skill digital marketing untuk mengembangkan bisnis.',
            'Tertarik mempelajari web development secara mendalam.',
            'Ingin menguasai teknologi terbaru dalam pengembangan aplikasi.',
            'Membutuhkan sertifikasi untuk melengkapi portfolio profesional.',
            'Berkeinginan mengembangkan karir di bidang IT.',
            'Ingin menambah pengetahuan tentang data science dan analytics.',
            'Mempersiapkan diri untuk menjadi freelancer di bidang teknologi.',
            'Tertarik dengan perkembangan artificial intelligence dan machine learning.'
        ];

        // Admin notes for rejected applications
        $rejectionNotes = [
            'Persyaratan administrasi belum lengkap. Silakan lengkapi dokumen yang diperlukan.',
            'Pengalaman di bidang terkait masih kurang. Disarankan mengikuti kursus dasar terlebih dahulu.',
            'Kapasitas batch sudah penuh. Silakan daftar di periode berikutnya.',
            'Tidak memenuhi kriteria minimum GPA yang ditetapkan.',
            'Portfolio yang diserahkan belum menunjukkan kompetensi yang sesuai.',
            'Jadwal yang dipilih bentrok dengan komitmen akademik. Pilih batch yang sesuai.',
            'Perlu melengkapi pengalaman praktis di bidang terkait.',
            'Motivasi yang disampaikan kurang spesifik dan detail.'
        ];

        // Sample file types for berkas_persyaratan
        $sampleFiles = [
            'CV_Updated.pdf',
            'Transkrip_Nilai.pdf',
            'Portfolio_Project.pdf',
            'Sertifikat_Kursus.pdf',
            'Ijazah_Diploma.pdf',
            'KTP_Scan.pdf',
            'Foto_Formal.jpg',
            'Surat_Rekomendasi.pdf',
            'Proposal_Project.docx',
            'Screenshot_Achievement.png'
        ];

        // Sample URLs for portfolio links
        $sampleUrls = [
            'https://github.com/username/portfolio',
            'https://linkedin.com/in/username',
            'https://behance.net/username',
            'https://dribbble.com/username',
            'https://gitlab.com/username/projects',
            'https://codepen.io/username',
            'https://figma.com/@username',
            'https://personal-website.com',
            'https://medium.com/@username',
            'https://dev.to/username'
        ];

        foreach ($students as $index => $student) {
            // Determine status based on weighted probability
            $statusRand = rand(1, 100);
            if ($statusRand <= 40) {
                $status = 'Pengajuan';
            } elseif ($statusRand <= 75) {
                $status = 'Disetujui';
            } else {
                $status = 'Ditolak';
            }

            // Random sertifikasi and batch
            $selectedSertifikasi = $sertifikasi->random();
            $selectedBatch = $batches->random();
            
            // Determine registration date (varied timeline)
            $daysAgo = rand(1, 60);
            $registrationDate = now()->subDays($daysAgo);
            
            // Generate berkas_persyaratan
            $berkasPersyaratan = [];
            
            // Always include required documents
            $berkasPersyaratan['cv'] = 'sertifikasi_documents/' . uniqid() . '_' . $sampleFiles[array_rand($sampleFiles)];
            $berkasPersyaratan['transkrip'] = 'sertifikasi_documents/' . uniqid() . '_' . $sampleFiles[array_rand($sampleFiles)];
            
            // Add optional documents (70% chance each)
            if (rand(1, 100) <= 70) {
                $berkasPersyaratan['portfolio'] = $sampleUrls[array_rand($sampleUrls)];
            }
            if (rand(1, 100) <= 70) {
                $berkasPersyaratan['sertifikat_pendukung'] = 'sertifikasi_documents/' . uniqid() . '_' . $sampleFiles[array_rand($sampleFiles)];
            }
            if (rand(1, 100) <= 50) {
                $berkasPersyaratan['surat_rekomendasi'] = 'sertifikasi_documents/' . uniqid() . '_' . $sampleFiles[array_rand($sampleFiles)];
            }
            if (rand(1, 100) <= 40) {
                $berkasPersyaratan['portfolio_link'] = $sampleUrls[array_rand($sampleUrls)];
            }
            
            $data = [
                'user_id' => $student->id,
                'sertifikasi_id' => $selectedSertifikasi->id,
                'batch_id' => $selectedBatch->id,
                'tanggal_pendaftaran' => $registrationDate,
                'status' => $status,
                'motivasi' => $motivations[array_rand($motivations)],
                'berkas_persyaratan' => $berkasPersyaratan,
                'created_at' => $registrationDate,
                'updated_at' => $registrationDate,
            ];

            // Add processing date and admin notes for processed applications
            if ($status !== 'Pengajuan') {
                $processedDaysAgo = rand(1, $daysAgo - 1);
                $processedDate = now()->subDays($processedDaysAgo);
                
                $data['tanggal_diproses'] = $processedDate;
                $data['updated_at'] = $processedDate;
                
                if ($status === 'Ditolak') {
                    $data['catatan_admin'] = $rejectionNotes[array_rand($rejectionNotes)];
                }
            }

            PendaftaranSertifikasi::create($data);
        }

        // Create some additional registrations for active students (multiple applications)
        $activeStudents = $students->random(min(5, $students->count()));
        foreach ($activeStudents as $student) {
            // Only create second application if first one was approved or rejected
            $existingApplication = PendaftaranSertifikasi::where('user_id', $student->id)->first();
            if ($existingApplication && $existingApplication->status !== 'Pengajuan') {
                
                // Pick different sertifikasi
                $availableSertifikasi = $sertifikasi->whereNotIn('id', [$existingApplication->sertifikasi_id]);
                if ($availableSertifikasi->count() > 0) {
                    $secondSertifikasi = $availableSertifikasi->random();
                    $secondBatch = $batches->random();
                    
                    $secondStatus = ['Pengajuan', 'Disetujui', 'Ditolak'][array_rand(['Pengajuan', 'Disetujui', 'Ditolak'])];
                    $secondRegDate = now()->subDays(rand(1, 30));
                    
                    // Generate berkas for second application
                    $secondBerkas = [];
                    $secondBerkas['cv'] = 'sertifikasi_documents/' . uniqid() . '_' . $sampleFiles[array_rand($sampleFiles)];
                    $secondBerkas['transkrip'] = 'sertifikasi_documents/' . uniqid() . '_' . $sampleFiles[array_rand($sampleFiles)];
                    if (rand(1, 100) <= 80) {
                        $secondBerkas['portfolio'] = $sampleUrls[array_rand($sampleUrls)];
                    }
                    if (rand(1, 100) <= 60) {
                        $secondBerkas['pengalaman_tambahan'] = 'sertifikasi_documents/' . uniqid() . '_' . $sampleFiles[array_rand($sampleFiles)];
                    }
                    
                    $secondData = [
                        'user_id' => $student->id,
                        'sertifikasi_id' => $secondSertifikasi->id,
                        'batch_id' => $secondBatch->id,
                        'tanggal_pendaftaran' => $secondRegDate,
                        'status' => $secondStatus,
                        'motivasi' => 'Ingin memperluas kompetensi dengan mengikuti sertifikasi tambahan.',
                        'berkas_persyaratan' => $secondBerkas,
                        'created_at' => $secondRegDate,
                        'updated_at' => $secondRegDate,
                    ];

                    if ($secondStatus !== 'Pengajuan') {
                        $secondProcessedDate = now()->subDays(rand(1, 29));
                        $secondData['tanggal_diproses'] = $secondProcessedDate;
                        $secondData['updated_at'] = $secondProcessedDate;
                        
                        if ($secondStatus === 'Ditolak') {
                            $secondData['catatan_admin'] = $rejectionNotes[array_rand($rejectionNotes)];
                        }
                    }

                    PendaftaranSertifikasi::create($secondData);
                }
            }
        }
    }
}
