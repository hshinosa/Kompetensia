<?php

namespace Database\Seeders;

use App\Models\PendaftaranPKL;
use App\Models\User;
use App\Models\PosisiPKL;
use Illuminate\Database\Seeder;

class PendaftaranPKLSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data to prevent duplicates
        PendaftaranPKL::query()->delete();
        
        $students = User::where('role', 'mahasiswa')->get();
        $posisiPKL = PosisiPKL::all();

        if ($students->count() === 0 || $posisiPKL->count() === 0) {
            return;
        }

        // Motivations pool
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

        // Admin notes for rejected applications
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

        foreach ($students as $student) {
            // Determine status based on probability
            $statusRand = rand(1, 100);
            if ($statusRand <= 35) {
                $status = 'Pengajuan';
            } elseif ($statusRand <= 70) {
                $status = 'Disetujui';
            } else {
                $status = 'Ditolak';
            }

            // Random posisi PKL
            $selectedPosisi = $posisiPKL->random();
            
            // Determine registration date (varied timeline)
            $daysAgo = rand(1, 45);
            $registrationDate = now()->subDays($daysAgo);
            
            $data = [
                'user_id' => $student->id,
                'posisi_pkl_id' => $selectedPosisi->id,
                'tanggal_pendaftaran' => $registrationDate,
                'status' => $status,
                'motivasi' => $motivations[array_rand($motivations)],
                'institusi_asal' => $student->institution,
                'program_studi' => $student->major,
                'semester' => $student->semester,
                'created_at' => $registrationDate,
                'updated_at' => $registrationDate,
            ];

            // Add processing details for approved/rejected applications
            if ($status !== 'Pengajuan') {
                $processedDaysAgo = rand(1, $daysAgo - 1);
                $processedDate = now()->subDays($processedDaysAgo);
                
                $data['tanggal_diproses'] = $processedDate;
                $data['updated_at'] = $processedDate;
                
                if ($status === 'Disetujui') {
                    // Add PKL schedule for approved applications
                    $data['tanggal_mulai'] = now()->addDays(rand(7, 30))->format('Y-m-d');
                    $data['tanggal_selesai'] = now()->addDays(rand(90, 120))->format('Y-m-d');
                } elseif ($status === 'Ditolak') {
                    $data['catatan_admin'] = $rejectionNotes[array_rand($rejectionNotes)];
                }
            }

            PendaftaranPKL::create($data);
        }

        // Create some additional registrations for active students (multiple applications)
        $activeStudents = $students->random(min(8, $students->count()));
        foreach ($activeStudents as $student) {
            // Only create second application if first one was approved or rejected
            $existingApplication = PendaftaranPKL::where('user_id', $student->id)->first();
            if ($existingApplication && $existingApplication->status !== 'Pengajuan') {
                
                // Pick different posisi
                $availablePosisi = $posisiPKL->whereNotIn('id', [$existingApplication->posisi_pkl_id]);
                if ($availablePosisi->count() > 0) {
                    $secondPosisi = $availablePosisi->random();
                    
                    $secondStatus = ['Pengajuan', 'Disetujui', 'Ditolak'][array_rand(['Pengajuan', 'Disetujui', 'Ditolak'])];
                    $secondRegDate = now()->subDays(rand(1, 20));
                    
                    $secondData = [
                        'user_id' => $student->id,
                        'posisi_pkl_id' => $secondPosisi->id,
                        'tanggal_pendaftaran' => $secondRegDate,
                        'status' => $secondStatus,
                        'motivasi' => 'Ingin mencoba posisi lain untuk memperluas pengalaman.',
                        'institusi_asal' => $student->institution,
                        'program_studi' => $student->major,
                        'semester' => $student->semester,
                        'created_at' => $secondRegDate,
                        'updated_at' => $secondRegDate,
                    ];

                    if ($secondStatus !== 'Pengajuan') {
                        $secondProcessedDate = now()->subDays(rand(1, 19));
                        $secondData['tanggal_diproses'] = $secondProcessedDate;
                        $secondData['updated_at'] = $secondProcessedDate;
                        
                        if ($secondStatus === 'Disetujui') {
                            $secondData['tanggal_mulai'] = now()->addDays(rand(7, 30))->format('Y-m-d');
                            $secondData['tanggal_selesai'] = now()->addDays(rand(90, 120))->format('Y-m-d');
                        } elseif ($secondStatus === 'Ditolak') {
                            $secondData['catatan_admin'] = $rejectionNotes[array_rand($rejectionNotes)];
                        }
                    }

                    PendaftaranPKL::create($secondData);
                }
            }
        }
    }
}
