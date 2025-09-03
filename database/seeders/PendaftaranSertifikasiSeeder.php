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
        
        $students = User::where('role', 'student')->get();
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
            
            $data = [
                'user_id' => $student->id,
                'sertifikasi_id' => $selectedSertifikasi->id,
                'batch_id' => $selectedBatch->id,
                'tanggal_pendaftaran' => $registrationDate,
                'status' => $status,
                'motivasi' => $motivations[array_rand($motivations)],
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
                    
                    $secondData = [
                        'user_id' => $student->id,
                        'sertifikasi_id' => $secondSertifikasi->id,
                        'batch_id' => $secondBatch->id,
                        'tanggal_pendaftaran' => $secondRegDate,
                        'status' => $secondStatus,
                        'motivasi' => 'Ingin memperluas kompetensi dengan mengikuti sertifikasi tambahan.',
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
