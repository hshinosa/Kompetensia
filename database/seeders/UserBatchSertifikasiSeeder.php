<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\BatchSertifikasi;
use App\Models\PendaftaranSertifikasi;
use Illuminate\Database\Seeder;

class UserBatchSertifikasiSeeder extends Seeder
{
    public function run(): void
    {
        // Get all users except admin
        $users = User::where('role', '!=', 'admin')->get();
        
        // Get all active batches
        $batches = BatchSertifikasi::where('status', 'Aktif')->get();
        
        if ($users->count() === 0 || $batches->count() === 0) {
            return;
        }

        $pendaftaranData = [];
        
        // For each user, randomly assign them to 1-3 different batches
        foreach ($users as $user) {
            // Random number of certifications per user (1-3)
            $numCertifications = rand(1, 3);
            
            // Get random batches for this user
            $userBatches = $batches->random(min($numCertifications, $batches->count()));
            
            foreach ($userBatches as $batch) {
                // Generate realistic registration data
                $registrationDate = $this->getRegistrationDate($batch);
                $status = $this->getRegistrationStatus($batch, $registrationDate);
                
                $pendaftaranData[] = [
                    'user_id' => $user->id,
                    'sertifikasi_id' => $batch->sertifikasi_id,
                    'batch_id' => $batch->id,
                    'tanggal_pendaftaran' => $registrationDate->toDateString(),
                    'nama_lengkap' => $user->nama,
                    'email' => $user->email,
                    'no_telp' => '08' . rand(10000000, 99999999),
                    'motivasi' => $this->getMotivation(),
                    'status' => $status,
                    'catatan_admin' => $this->getAdminNote($status),
                    'tanggal_diproses' => $status != 'Pengajuan' ? $registrationDate : null,
                    'created_at' => $registrationDate,
                    'updated_at' => now(),
                ];
            }
        }

        // Clear existing registration data (handle foreign key constraints)
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        PendaftaranSertifikasi::truncate();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        // Insert new data
        foreach ($pendaftaranData as $data) {
            PendaftaranSertifikasi::create($data);
        }
        
        // Update batch pendaftar count
        $this->updateBatchPendaftarCount();
    }
    
    private function getRegistrationDate($batch)
    {
        $batchStart = \Carbon\Carbon::parse($batch->tanggal_mulai);
        
        // Registration should be before batch starts
        if ($batchStart->isFuture()) {
            // Batch hasn't started - registration can be recent
            return now()->subDays(rand(1, 15));
        } else {
            // Batch already started - registration must be before start date
            return $batchStart->subDays(rand(5, 30));
        }
    }
    
    private function getRegistrationStatus($batch, $registrationDate)
    {
        $batchStart = \Carbon\Carbon::parse($batch->tanggal_mulai);
        
        // Most registrations are approved
        $rand = rand(1, 100);
        
        if ($batchStart->isPast()) {
            // For batches that already started
            if ($rand <= 85) return 'Disetujui'; // 85% approved
            elseif ($rand <= 95) return 'Ditolak'; // 10% rejected
            else return 'Pengajuan'; // 5% still pending
        } else {
            // For future batches
            if ($rand <= 70) return 'Disetujui'; // 70% approved
            elseif ($rand <= 85) return 'Ditolak'; // 15% rejected
            else return 'Pengajuan'; // 15% still pending
        }
    }
    
    private function getMotivation()
    {
        $motivations = [
            'Saya ingin mengembangkan keterampilan profesional untuk meningkatkan karir saya di bidang ini.',
            'Program ini sangat sesuai dengan goals karir jangka panjang saya dalam industri teknologi.',
            'Saya tertarik untuk memperdalam pengetahuan dan mendapatkan sertifikasi yang diakui industri.',
            'Ingin mengupgrade skill set saya agar lebih kompetitif di pasar kerja saat ini.',
            'Program ini akan membantu saya transisi karir ke bidang yang lebih saya minati.',
            'Saya ingin belajar dari praktisi berpengalaman dan networking dengan professionals.',
            'Pengetahuan dari program ini akan saya aplikasikan langsung di pekerjaan saat ini.',
            'Saya ingin memulai bisnis sendiri dan program ini memberikan foundation yang kuat.',
            'Tertarik dengan kurikulum yang up-to-date dan sesuai kebutuhan industri terkini.',
            'Ingin meningkatkan value diri dan membuka peluang karir yang lebih luas.'
        ];
        
        return $motivations[array_rand($motivations)];
    }
    
    private function getAdminNote($status)
    {
        $notes = [
            'Disetujui' => [
                'Persyaratan lengkap dan memenuhi kriteria',
                'Background pendidikan sesuai dengan program',
                'Dokumen valid dan lengkap',
                'Pengalaman yang relevan',
                'Motivasi dan tujuan yang jelas'
            ],
            'Ditolak' => [
                'Dokumen tidak lengkap',
                'Background tidak sesuai requirement',
                'Sudah mencapai batas maksimal peserta',
                'Tidak memenuhi persyaratan minimum',
                'Jadwal bentrok dengan komitmen lain'
            ],
            'Pengajuan' => [
                'Sedang dalam proses verifikasi dokumen',
                'Menunggu konfirmasi dari pihak terkait',
                'Dalam antrian review',
                'Perlu klarifikasi tambahan',
                'Menunggu pembayaran'
            ]
        ];
        
        return $notes[$status][array_rand($notes[$status])];
    }
    
    private function updateBatchPendaftarCount()
    {
        $batches = BatchSertifikasi::all();
        
        foreach ($batches as $batch) {
            $count = PendaftaranSertifikasi::where('batch_id', $batch->id)
                                         ->where('status', 'Disetujui')
                                         ->count();
            $batch->update(['jumlah_pendaftar' => $count]);
        }
    }
}