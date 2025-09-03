<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Carbon;
use App\Models\User;

class PosisiPKLSeeder extends Seeder
{
    public function run(): void
    {
        if (!$this->shouldSeed()) {
            return;
        }
        $adminId = User::where('role','admin')->value('id') ?? 1;
    DB::table('posisi_pkl')->insert($this->records($adminId));
    }

    protected function shouldSeed(): bool
    {
        return Schema::hasTable('posisi_pkl') && DB::table('posisi_pkl')->count() === 0;
    }

    protected function records(int $adminId): array
    {
        return [
            $this->row(
                'UI/UX Designer',
                'Kreatif',
                'Merancang antarmuka dan pengalaman pengguna yang intuitif untuk aplikasi web & mobile.',
                [
                    'Mahasiswa/fresh graduate Design atau Informatika',
                    'Portfolio design kuat',
                    'Menguasai Figma / Adobe XD',
                    'Pemahaman dasar HTML/CSS',
                    'Komunikasi baik'
                ],
                [
                    'Uang saku',
                    'Sertifikat PKL',
                    'Mentor berpengalaman',
                    'Flexible working hours'
                ],
                'Hybrid', 3, 0, 'Aktif', $adminId
            ),
            $this->row(
                'Frontend Developer',
                'Teknologi',
                'Bertanggung jawab untuk pengembangan antarmuka pengguna aplikasi web.',
                [
                    'Mahasiswa/fresh graduate Teknik Informatika',
                    'Menguasai JavaScript, HTML, dan CSS',
                    'Pengalaman dengan framework seperti React atau Vue.js',
                    'Kemampuan bekerja dalam tim',
                    'Komunikasi baik'
                ],
                [
                    'Uang saku',
                    'Sertifikat PKL',
                    'Mentor berpengalaman',
                    'Flexible working hours'
                ],
                'Hybrid', 3, 0, 'Aktif', $adminId
            ),
            $this->row(
                'Backend Developer',
                'Teknologi',
                'Bertanggung jawab untuk pengembangan sisi server aplikasi web.',
                [
                    'Mahasiswa/fresh graduate Teknik Informatika',
                    'Menguasai PHP, Python, atau Node.js',
                    'Pengalaman dengan database seperti MySQL atau MongoDB',
                    'Kemampuan bekerja dalam tim',
                    'Komunikasi baik'
                ],
                [
                    'Uang saku',
                    'Sertifikat PKL',
                    'Mentor berpengalaman',
                    'Flexible working hours'
                ],
                'Hybrid', 3, 0, 'Aktif', $adminId
            ),
            $this->row(
                'Data Scientist',
                'Teknologi',
                'Bertanggung jawab untuk analisis data dan pengembangan model machine learning.',
                [
                    'Mahasiswa/fresh graduate Statistik, Matematika, atau Informatika',
                    'Menguasai Python dan library seperti Pandas, NumPy, dan Scikit-learn',
                    'Pengalaman dengan database dan SQL',
                    'Kemampuan bekerja dalam tim',
                    'Komunikasi baik'
                ],
                [
                    'Uang saku',
                    'Sertifikat PKL',
                    'Mentor berpengalaman',
                    'Flexible working hours'
                ],
                'Hybrid', 3, 0, 'Aktif', $adminId
            ),
            $this->row(
                'Machine Learning Engineer',
                'Teknologi',
                'Bertanggung jawab untuk pengembangan model machine learning dan analisis data.',
                [
                    'Mahasiswa/fresh graduate Statistik, Matematika, atau Informatika',
                    'Menguasai Python dan library seperti TensorFlow, Keras, dan Scikit-learn',
                    'Pengalaman dengan database dan SQL',
                    'Kemampuan bekerja dalam tim',
                    'Komunikasi baik'
                ],
                [
                    'Uang saku',
                    'Sertifikat PKL',
                    'Mentor berpengalaman',
                    'Flexible working hours'
                ],
                'Hybrid', 3, 0, 'Aktif', $adminId
            ),
            $this->row(
                'AI Engineer',
                'Teknologi',
                'Bertanggung jawab untuk pengembangan dan implementasi solusi AI.',
                [
                    'Mahasiswa/fresh graduate Teknik Informatika, Statistik, atau Matematika',
                    'Menguasai Python dan library AI seperti TensorFlow atau PyTorch',
                    'Pengalaman dengan database dan SQL',
                    'Kemampuan bekerja dalam tim',
                    'Komunikasi baik'
                ],
                [
                    'Uang saku',
                    'Sertifikat PKL',
                    'Mentor berpengalaman',
                    'Flexible working hours'
                ],
                'Hybrid', 3, 0, 'Aktif', $adminId
            )
            ];
    }

    protected function row(
        string $nama,
        string $kategori,
        string $deskripsi,
        array $persyaratan,
        array $benefits,
        string $tipe,
        int $durasi,
        int $jumlah,
        string $status,
        int $createdBy
    ): array {
        return [
            'nama_posisi' => $nama,
            'kategori' => $kategori,
            'deskripsi' => $deskripsi,
            'persyaratan' => json_encode($persyaratan),
            'benefits' => json_encode($benefits),
            'tipe' => $tipe,
            'durasi_bulan' => $durasi,
            'jumlah_pendaftar' => $jumlah,
            'status' => $status,
            'created_by' => $createdBy,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
