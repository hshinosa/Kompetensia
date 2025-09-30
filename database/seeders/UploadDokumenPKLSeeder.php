<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UploadDokumenPKL;
use App\Models\PendaftaranPKL;
use App\Models\User;

class UploadDokumenPKLSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data
        UploadDokumenPKL::truncate();
        
        // Ambil semua pendaftaran PKL yang sudah ada
        $pendaftaranPKL = PendaftaranPKL::with('user')->get();

        if ($pendaftaranPKL->isEmpty()) {
            $this->command->info('No PKL registrations found. Please run PendaftaranPKLSeeder first.');
            return;
        }

        $dokumenTypes = ['proposal', 'laporan-mingguan', 'laporan-akhir', 'evaluasi'];
        $statuses = ['pending', 'approved', 'rejected'];
        $assessors = ['Dr. John Doe', 'Prof. Jane Smith', 'Ahmad Rahman, M.Kom', 'Siti Nurhaliza, S.T'];

        foreach ($pendaftaranPKL as $pendaftaran) {
            // Untuk setiap pendaftaran, buat beberapa upload dokumen
            $numDocuments = rand(2, 4); // 2-4 dokumen per pendaftaran
            
            for ($i = 0; $i < $numDocuments; $i++) {
                $jenisDoc = $dokumenTypes[array_rand($dokumenTypes)];
                $status = $statuses[array_rand($statuses)];
                
                UploadDokumenPKL::create([
                    'pendaftaran_id' => $pendaftaran->id,
                    'user_id' => $pendaftaran->user_id,
                    'jenis_dokumen' => $jenisDoc,
                    'judul_tugas' => $this->generateJudulTugas($jenisDoc),
                    'link_url' => $jenisDoc === 'proposal' ? 'https://drive.google.com/file/d/1234567890/view' : null,
                    'file_name' => $this->generateFileName($jenisDoc, $pendaftaran->user->name),
                    'file_path' => '/storage/pkl_documents/' . $pendaftaran->id . '/' . $jenisDoc . '_' . time() . '.pdf',
                    'file_size' => rand(500000, 5000000), // Random size in bytes (500KB - 5MB)
                    'file_type' => 'application/pdf',
                    'status' => $status,
                    'keterangan' => $this->generateKeterangan($jenisDoc),
                    'feedback' => $status !== 'pending' ? $this->generateFeedback($status) : null,
                    'assessor' => $status !== 'pending' ? $assessors[array_rand($assessors)] : null,
                    'tanggal_upload' => now()->subDays(rand(1, 30)),
                    'tanggal_review' => $status !== 'pending' ? now()->subDays(rand(1, 15)) : null,
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now()->subDays(rand(1, 15)),
                ]);
            }
        }

        $this->command->info('UploadDokumenPKL seeded successfully with sample documents!');
    }

    private function generateJudulTugas($jenisDoc): string
    {
        $judulTemplates = [
            'proposal' => [
                'Proposal Sistem Informasi Manajemen',
                'Rancangan Aplikasi Mobile E-Commerce',
                'Proposal Pengembangan Website Portfolio',
                'Desain Sistem Database Perpustakaan'
            ],
            'laporan-mingguan' => [
                'Laporan Minggu ke-1: Pengenalan Lingkungan Kerja',
                'Laporan Minggu ke-2: Analisis Kebutuhan Sistem',
                'Laporan Minggu ke-3: Implementasi Fitur Login',
                'Laporan Minggu ke-4: Testing dan Debugging'
            ],
            'laporan-akhir' => [
                'Laporan Akhir: Pengembangan Sistem Inventory',
                'Laporan Akhir: Implementasi Dashboard Analytics',
                'Laporan Akhir: Optimasi Performa Database',
                'Laporan Akhir: Integrasi Payment Gateway'
            ],
            'evaluasi' => [
                'Evaluasi Pembelajaran PKL Bidang Web Development',
                'Evaluasi Kinerja Tim Development',
                'Evaluasi Implementasi Metodologi Scrum',
                'Evaluasi Penggunaan Framework Laravel'
            ]
        ];

        $templates = $judulTemplates[$jenisDoc] ?? ['Dokumen ' . ucfirst($jenisDoc)];
        return $templates[array_rand($templates)];
    }

    private function generateFileName($jenisDoc, $userName): string
    {
        $cleanName = str_replace(' ', '_', strtolower($userName));
        $timestamp = date('Ymd');
        
        return $cleanName . '_' . $jenisDoc . '_' . $timestamp . '.pdf';
    }

    private function generateKeterangan($jenisDoc): string
    {
        $keteranganTemplates = [
            'proposal' => 'Proposal kegiatan PKL untuk periode 3 bulan dengan fokus pada pengembangan aplikasi web.',
            'laporan-mingguan' => 'Laporan progress mingguan yang mencakup aktivitas dan pencapaian selama seminggu.',
            'laporan-akhir' => 'Laporan komprehensif hasil kegiatan PKL selama 3 bulan dengan dokumentasi lengkap.',
            'evaluasi' => 'Evaluasi diri terhadap proses pembelajaran dan pencapaian selama PKL.'
        ];

        return $keteranganTemplates[$jenisDoc] ?? 'Dokumen terkait kegiatan PKL.';
    }

    private function generateFeedback($status): string
    {
        if ($status === 'approved') {
            $approvedFeedback = [
                'Dokumen sudah sesuai dengan standar yang ditetapkan. Lanjutkan dengan tahap berikutnya.',
                'Excellent work! Dokumentasi sangat lengkap dan terstruktur dengan baik.',
                'Approved. Semua requirement sudah terpenuhi dengan baik.',
                'Good job! Format dan konten sudah sesuai dengan guidelines PKL.'
            ];
            return $approvedFeedback[array_rand($approvedFeedback)];
        } else {
            $rejectedFeedback = [
                'Mohon perbaiki format penulisan dan tambahkan detail pada bagian metodologi.',
                'Dokumen perlu revisi pada bagian analisis. Silakan konsultasi dengan pembimbing.',
                'Format belum sesuai template. Mohon gunakan template yang telah disediakan.',
                'Konten masih kurang lengkap. Tambahkan dokumentasi pada bagian implementasi.'
            ];
            return $rejectedFeedback[array_rand($rejectedFeedback)];
        }
    }
}