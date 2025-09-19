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

        // Sample files for CV
        $sampleFiles = [
            'CV_Updated.pdf',
            'Curriculum_Vitae.pdf',
            'Resume_Latest.pdf',
            'CV_Student.pdf',
            'My_CV.pdf',
            'Professional_CV.pdf'
        ];

        // Sample URLs for portfolio
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

        foreach ($students as $student) {
            // Determine status based on probability - ensure more approved for testing
            $statusRand = rand(1, 100);
            if ($statusRand <= 20) {
                $status = 'Pengajuan';
            } elseif ($statusRand <= 75) {  // 55% chance of approval
                $status = 'Disetujui';
            } else {
                $status = 'Ditolak';
            }

            // Random posisi PKL
            $selectedPosisi = $posisiPKL->random();
            
            // Determine registration date (varied timeline)
            $daysAgo = rand(1, 45);
            $registrationDate = now()->subDays($daysAgo);
            
            // Generate berkas_persyaratan untuk PKL (CV wajib + Portfolio opsional)
            $berkasPersyaratan = [
                'cv' => 'pkl_documents/' . uniqid() . '_' . $sampleFiles[array_rand($sampleFiles)]
            ];
            
            // 70% kemungkinan memiliki portfolio
            if (rand(1, 100) <= 70) {
                $berkasPersyaratan['portfolio'] = $sampleUrls[array_rand($sampleUrls)];
            }
            
            $data = [
                'user_id' => $student->id,
                'posisi_pkl_id' => $selectedPosisi->id,
                'tanggal_pendaftaran' => $registrationDate,
                'status' => $status,
                'motivasi' => $motivations[array_rand($motivations)],
                'berkas_persyaratan' => $berkasPersyaratan,
                'institusi_asal' => $student->institusi ?? $student->institution ?? 'Institusi tidak tersedia',
                'program_studi' => $student->jurusan ?? $student->major ?? 'Program studi tidak tersedia',
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
                    // SEMUA yang disetujui HARUS memiliki tanggal magang - NO EXCEPTIONS
                    $scheduleType = rand(1, 4);
                    
                    // Initialize default dates first
                    $startDate = now()->addDays(7);
                    $endDate = now()->addDays(67);
                    
                    if ($scheduleType === 1) {
                        // Already finished (sudah selesai) - started 60-90 days ago, ended 1-15 days ago
                        $startDate = now()->subDays(rand(60, 90));
                        $endDate = now()->subDays(rand(1, 15));
                    } elseif ($scheduleType === 2) {
                        // Currently running (sedang berjalan) - started 1-30 days ago, ends in 30-60 days
                        $startDate = now()->subDays(rand(1, 30));
                        $endDate = now()->addDays(rand(30, 60));
                    } elseif ($scheduleType === 3) {
                        // Starting soon (akan dimulai) - will start in 1-7 days
                        $startDate = now()->addDays(rand(1, 7));
                        $endDate = $startDate->copy()->addDays(rand(60, 90));
                    } else {
                        // Starting next month (bulan depan)
                        $startDate = now()->addDays(rand(25, 35));
                        $endDate = $startDate->copy()->addDays(rand(60, 90));
                    }
                    
                    // FORCE set tanggal untuk SEMUA yang disetujui - WAJIB TIDAK BOLEH NULL
                    $data['tanggal_mulai'] = $startDate->format('Y-m-d');
                    $data['tanggal_selesai'] = $endDate->format('Y-m-d');
                    
                    // Validate that dates are actually set
                    if (empty($data['tanggal_mulai']) || empty($data['tanggal_selesai'])) {
                        // Fallback: force set dates if somehow still empty
                        $data['tanggal_mulai'] = now()->addDays(7)->format('Y-m-d');
                        $data['tanggal_selesai'] = now()->addDays(67)->format('Y-m-d');
                    }
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
                    
                    // Generate berkas_persyaratan untuk aplikasi kedua
                    $secondBerkas = [
                        'cv' => 'pkl_documents/' . uniqid() . '_' . $sampleFiles[array_rand($sampleFiles)]
                    ];
                    
                    // 70% kemungkinan memiliki portfolio
                    if (rand(1, 100) <= 70) {
                        $secondBerkas['portfolio'] = $sampleUrls[array_rand($sampleUrls)];
                    }
                    
                    $secondData = [
                        'user_id' => $student->id,
                        'posisi_pkl_id' => $secondPosisi->id,
                        'tanggal_pendaftaran' => $secondRegDate,
                        'status' => $secondStatus,
                        'motivasi' => 'Ingin mencoba posisi lain untuk memperluas pengalaman.',
                        'berkas_persyaratan' => $secondBerkas,
                        'institusi_asal' => $student->institusi ?? $student->institution ?? 'Institusi tidak tersedia',
                        'program_studi' => $student->jurusan ?? $student->major ?? 'Program studi tidak tersedia',
                        'semester' => $student->semester,
                        'created_at' => $secondRegDate,
                        'updated_at' => $secondRegDate,
                    ];

                    if ($secondStatus !== 'Pengajuan') {
                        $secondProcessedDate = now()->subDays(rand(1, 19));
                        $secondData['tanggal_diproses'] = $secondProcessedDate;
                        $secondData['updated_at'] = $secondProcessedDate;
                        
                        if ($secondStatus === 'Disetujui') {
                            // SEMUA aplikasi kedua yang disetujui HARUS memiliki tanggal magang - NO EXCEPTIONS
                            $secondScheduleType = rand(1, 4);
                            
                            // Initialize default dates first
                            $secondStartDate = now()->addDays(7);
                            $secondEndDate = now()->addDays(67);
                            
                            if ($secondScheduleType === 1) {
                                // Already finished (sudah selesai) - started 60-90 days ago, ended 1-15 days ago
                                $secondStartDate = now()->subDays(rand(60, 90));
                                $secondEndDate = now()->subDays(rand(1, 15));
                            } elseif ($secondScheduleType === 2) {
                                // Currently running (sedang berjalan) - started 1-30 days ago, ends in 30-60 days
                                $secondStartDate = now()->subDays(rand(1, 30));
                                $secondEndDate = now()->addDays(rand(30, 60));
                            } elseif ($secondScheduleType === 3) {
                                // Starting soon (akan dimulai) - will start in 1-7 days
                                $secondStartDate = now()->addDays(rand(1, 7));
                                $secondEndDate = $secondStartDate->copy()->addDays(rand(60, 90));
                            } else {
                                // Starting next month (bulan depan)
                                $secondStartDate = now()->addDays(rand(25, 35));
                                $secondEndDate = $secondStartDate->copy()->addDays(rand(60, 90));
                            }
                            
                            // FORCE set tanggal untuk SEMUA aplikasi kedua yang disetujui - WAJIB TIDAK BOLEH NULL
                            $secondData['tanggal_mulai'] = $secondStartDate->format('Y-m-d');
                            $secondData['tanggal_selesai'] = $secondEndDate->format('Y-m-d');
                            
                            // Validate that dates are actually set
                            if (empty($secondData['tanggal_mulai']) || empty($secondData['tanggal_selesai'])) {
                                // Fallback: force set dates if somehow still empty
                                $secondData['tanggal_mulai'] = now()->addDays(7)->format('Y-m-d');
                                $secondData['tanggal_selesai'] = now()->addDays(67)->format('Y-m-d');
                            }
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
