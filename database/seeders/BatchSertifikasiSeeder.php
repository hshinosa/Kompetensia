<?php

namespace Database\Seeders;

use App\Models\BatchSertifikasi;
use App\Models\Sertifikasi;
use Illuminate\Database\Seeder;

class BatchSertifikasiSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing batch data to avoid duplicates (handle foreign key constraints)
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        BatchSertifikasi::truncate();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        $sertifikasi = Sertifikasi::all();

        if ($sertifikasi->count() === 0) {
            return;
        }

        $batches = [];
        $batchVariations = [
            [
                'suffix' => ' (Available Now)',
                'start_days' => [-2, -1, 0], // Started 2 days ago to today
                'duration_days' => [30, 35, 40, 45],
                'status' => 'Aktif',
                'note' => 'Pendaftaran terbuka - Kelas sedang berjalan, masih bisa bergabung'
            ],
            [
                'suffix' => ' (Starting Soon)',
                'start_days' => [1, 2, 3, 5], // Starting in 1-5 days
                'duration_days' => [35, 40, 45, 50],
                'status' => 'Aktif',
                'note' => 'Kelas akan dimulai segera - Tempat terbatas'
            ],
            [
                'suffix' => ' (Weekend Batch)',
                'start_days' => [7, 14, 21], // Starting next week
                'duration_days' => [60, 70, 80], // Weekend batches are longer
                'status' => 'Aktif',
                'note' => 'Kelas khusus weekend - Jadwal fleksibel untuk pekerja'
            ],
            [
                'suffix' => ' (Intensive)',
                'start_days' => [10, 15, 20], // Starting in 2-3 weeks
                'duration_days' => [21, 28, 35], // Shorter but intensive
                'status' => 'Akan Datang',
                'note' => 'Program intensif dengan jadwal padat - Hasil cepat'
            ]
        ];
        
        // Create unique batches for each certification
        foreach ($sertifikasi as $index => $sert) {
            // Create 2-3 different batches per certification to make it more realistic
            $numBatches = $index < 5 ? 3 : 2; // First 5 get 3 batches, rest get 2
            
            for ($i = 0; $i < $numBatches; $i++) {
                $variation = $batchVariations[$i];
                $startDay = $variation['start_days'][array_rand($variation['start_days'])];
                $duration = $variation['duration_days'][array_rand($variation['duration_days'])];
                
                $batches[] = [
                    'sertifikasi_id' => $sert->id,
                    'nama_batch' => 'Batch ' . ($i + 1) . ' - ' . $sert->nama_sertifikasi . $variation['suffix'],
                    'tanggal_mulai' => now()->addDays($startDay)->toDateString(),
                    'tanggal_selesai' => now()->addDays($startDay + $duration)->toDateString(),
                    'jumlah_pendaftar' => rand(5, 25),
                    'status' => $variation['status'],
                    'instruktur' => $this->getInstructor(($index * 4) + $i),
                    'catatan' => $variation['note'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        foreach ($batches as $batch) {
            BatchSertifikasi::create($batch);
        }
    }

    private function getInstructor($index): string
    {
        $instructors = [
            'Pak Ahmad Santoso, M.Kom',
            'Bu Sarah Wijaya, S.T.',
            'Dr. Budi Raharjo',
            'Bu Lisa Handayani, M.T.',
            'Pak Doni Pratama, S.Kom',
            'Bu Maya Sari, M.M.',
            'Pak Rizki Firmansyah, M.T.',
            'Bu Dewi Lestari, S.T.',
            'Pak Andi Wijaya, M.Kom',
            'Bu Sinta Maharani, M.M.',
            'Pak Yoga Pratama, S.Kom',
            'Bu Nina Safitri, M.T.',
            'Dr. Hendra Gunawan',
            'Bu Rika Permata, S.T.',
            'Pak Fajar Ramadhan, M.Kom',
            'Bu Indah Sari, M.M.',
            'Pak Dimas Prasetyo, S.T.',
            'Bu Ratna Dewi, M.T.',
            'Pak Wahyu Hidayat, M.Kom',
            'Bu Putri Rahayu, S.Kom'
        ];
        
        return $instructors[$index % count($instructors)];
    }
}
