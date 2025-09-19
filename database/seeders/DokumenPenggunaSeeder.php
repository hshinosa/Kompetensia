<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\UserDocument;
use App\Models\PendaftaranPKL;
use App\Models\User;
use Faker\Factory as Faker;
use Carbon\Carbon;

class DokumenPenggunaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Ambil semua pendaftaran PKL yang disetujui
        $pendaftaranPKLDisetujui = PendaftaranPKL::where('status', 'Disetujui')->get();
        
        $tipeDokumen = ['CV', 'Transkrip Nilai', 'Surat Rekomendasi', 'Portofolio', 'Sertifikat'];
        $kategoriSubmisi = ['laporan', 'tugas'];
        $statusPenilaian = ['menunggu', 'diterima', 'ditolak'];
        $tipeSubmisi = ['dokumen', 'link', 'dokumen_dan_link'];
        
        $judulTugas = [
            'Laporan Mingguan PKL',
            'Analisis Sistem Informasi',
            'Dokumentasi Project',
            'Laporan Akhir PKL',
            'Presentasi Hasil Kerja',
            'Evaluasi Pembelajaran',
            'Studi Kasus Perusahaan',
            'Implementasi Teknologi Baru',
            'Tutorial Penggunaan Framework',
            'Dokumentasi API Integration',
            'Report Performance Testing',
            'Mobile App Development Guide'
        ];
        
        $linkExamples = [
            'https://github.com/username/project-pkl',
            'https://drive.google.com/file/d/example',
            'https://gitlab.com/user/internship-work',
            'https://bitbucket.org/team/pkl-assignment',
            'https://www.figma.com/file/example-design',
            'https://codepen.io/user/pen/example',
            'https://docs.google.com/document/d/example',
            'https://notion.so/workspace/pkl-notes'
        ];
        
        // Buat dokumen umum untuk setiap user
        $users = User::all();
        foreach ($users as $user) {
            // Buat 2-4 dokumen umum per user
            $jumlahDokumen = rand(2, 4);
            for ($i = 0; $i < $jumlahDokumen; $i++) {
                UserDocument::create([
                    'user_id' => $user->id,
                    'jenis_dokumen' => $faker->randomElement($tipeDokumen),
                    'nama_dokumen' => $faker->sentence(3) . '.pdf',
                    'path_file' => 'documents/' . $faker->uuid . '.pdf',
                    'ukuran_file' => rand(50000, 5000000), // 50KB - 5MB
                    'tipe_mime' => 'application/pdf',
                    'terverifikasi' => $faker->boolean(70), // 70% terverifikasi
                    'aktif' => true,
                    'catatan' => $faker->boolean(30) ? $faker->sentence() : null,
                    'tanggal_verifikasi' => $faker->boolean(70) ? $faker->dateTimeBetween('-1 month', 'now') : null,
                    'diverifikasi_oleh' => $faker->boolean(70) ? User::where('role', 'admin')->inRandomOrder()->first()?->id : null,
                ]);
            }
        }
        
        // Buat submisi PKL untuk setiap pendaftaran yang disetujui
        foreach ($pendaftaranPKLDisetujui as $pkl) {
            // Buat 3-8 submisi per PKL
            $jumlahSubmisi = rand(3, 8);
            
            for ($i = 0; $i < $jumlahSubmisi; $i++) {
                $tipeSubmisiRandom = $faker->randomElement($tipeSubmisi);
                $kategoriSubmisiRandom = $faker->randomElement($kategoriSubmisi);
                $statusPenilaianRandom = $faker->randomElement($statusPenilaian);
                
                // Tentukan tanggal submit yang aman
                $tanggalMulai = Carbon::parse($pkl->tanggal_mulai);
                $tanggalSelesai = $pkl->tanggal_selesai ? Carbon::parse($pkl->tanggal_selesai) : null;
                
                // Jika tanggal selesai null atau lebih kecil dari tanggal mulai, set ke 30 hari setelah mulai
                if (!$tanggalSelesai || $tanggalSelesai <= $tanggalMulai) {
                    $tanggalSelesai = $tanggalMulai->copy()->addDays(30);
                }
                
                $tanggalSubmit = $faker->dateTimeBetween($tanggalMulai, $tanggalSelesai);
                
                // Untuk tanggal verifikasi, gunakan tanggal yang aman (antara submit dan sekarang)
                $tanggalVerifikasi = Carbon::parse($tanggalSubmit)->addDays(rand(1, 7));
                
                $dokumen = [
                    'user_id' => $pkl->user_id,
                    'jenis_dokumen' => 'submisi_pkl',
                    'nama_dokumen' => $faker->randomElement($judulTugas),
                    'terverifikasi' => $statusPenilaianRandom === 'diterima',
                    'aktif' => true,
                    
                    // Field submisi PKL
                    'nomor_submisi' => 'PKL-' . $pkl->id . '-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                    'tipe_submisi' => $tipeSubmisiRandom,
                    'kategori_submisi' => $kategoriSubmisiRandom,
                    'judul_tugas' => $faker->randomElement($judulTugas),
                    'deskripsi_tugas' => $faker->paragraph(3),
                    'status_penilaian' => $statusPenilaianRandom,
                    'pendaftaran_pkl_id' => $pkl->id,
                    'tanggal_submit' => $tanggalSubmit,
                ];
                
                // Atur path_file dan/atau link_submisi berdasarkan tipe
                if ($tipeSubmisiRandom === 'dokumen') {
                    // Hanya dokumen
                    $dokumen['path_file'] = 'pkl_submissions/' . $faker->uuid . '.pdf';
                    $dokumen['ukuran_file'] = rand(100000, 10000000); // 100KB - 10MB
                    $dokumen['tipe_mime'] = $faker->randomElement(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
                } elseif ($tipeSubmisiRandom === 'link') {
                    // Hanya link
                    $dokumen['link_submisi'] = $faker->randomElement($linkExamples);
                } else {
                    // Dokumen dan link (dokumen_dan_link)
                    $dokumen['path_file'] = 'pkl_submissions/' . $faker->uuid . '.pdf';
                    $dokumen['ukuran_file'] = rand(100000, 10000000); // 100KB - 10MB
                    $dokumen['tipe_mime'] = $faker->randomElement(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
                    $dokumen['link_submisi'] = $faker->randomElement($linkExamples);
                    
                    // Update tipe_submisi untuk tampilan yang lebih jelas
                    $dokumen['tipe_submisi'] = 'dokumen_dan_link';
                }
                
                // Tambahkan feedback jika sudah dinilai
                if (in_array($statusPenilaianRandom, ['diterima', 'ditolak'])) {
                    if ($statusPenilaianRandom === 'diterima') {
                        $dokumen['feedback_pembimbing'] = $faker->randomElement([
                            'Bagus, lanjutkan dengan konsisten',
                            'Sudah sesuai dengan ekspektasi',
                            'Kerja yang baik, tingkatkan lagi',
                            'Memenuhi standar yang ditetapkan'
                        ]);
                    } else {
                        $dokumen['feedback_pembimbing'] = $faker->randomElement([
                            'Perlu diperbaiki struktur laporannya',
                            'Kurang detail dalam analisis',
                            'Format tidak sesuai dengan panduan',
                            'Perlu tambahan referensi yang relevan'
                        ]);
                    }
                    $dokumen['tanggal_verifikasi'] = $tanggalVerifikasi;
                    $dokumen['diverifikasi_oleh'] = User::where('role', 'admin')->inRandomOrder()->first()?->id;
                }
                
                UserDocument::create($dokumen);
            }
        }
        
        $this->command->info('DokumenPenggunaSeeder berhasil dijalankan!');
        $this->command->info('Total dokumen dibuat: ' . UserDocument::count());
        $this->command->info('Total submisi PKL: ' . UserDocument::where('jenis_dokumen', 'submisi_pkl')->count());
    }
}
