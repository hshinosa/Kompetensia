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
            // Technology & IT
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
                    'Uang saku Rp 2.500.000/bulan',
                    'Sertifikat PKL',
                    'Mentor berpengalaman',
                    'Flexible working hours',
                    'Certificate of completion'
                ],
                'Hybrid', 3, 0, 'Aktif', $adminId
            ),
            $this->row(
                'Frontend Developer',
                'Teknologi',
                'Bertanggung jawab untuk pengembangan antarmuka pengguna aplikasi web menggunakan React.js.',
                [
                    'Mahasiswa/fresh graduate Teknik Informatika',
                    'Menguasai JavaScript, HTML, dan CSS',
                    'Pengalaman dengan framework React.js',
                    'Kemampuan bekerja dalam tim',
                    'Komunikasi baik'
                ],
                [
                    'Uang saku Rp 3.000.000/bulan',
                    'Sertifikat PKL',
                    'Mentor berpengalaman',
                    'Flexible working hours',
                    'Project portfolio'
                ],
                'Hybrid', 3, 0, 'Aktif', $adminId
            ),
            $this->row(
                'Backend Developer',
                'Teknologi',
                'Bertanggung jawab untuk pengembangan sisi server aplikasi web menggunakan Laravel/PHP.',
                [
                    'Mahasiswa/fresh graduate Teknik Informatika',
                    'Menguasai PHP, MySQL, dan Laravel',
                    'Pengalaman dengan REST API',
                    'Kemampuan bekerja dalam tim',
                    'Komunikasi baik'
                ],
                [
                    'Uang saku Rp 3.000.000/bulan',
                    'Sertifikat PKL',
                    'Mentor berpengalaman',
                    'Flexible working hours',
                    'Real project experience'
                ],
                'Hybrid', 3, 0, 'Aktif', $adminId
            ),
            $this->row(
                'Mobile App Developer (Flutter)',
                'Teknologi',
                'Pengembangan aplikasi mobile cross-platform menggunakan Flutter dan Dart.',
                [
                    'Mahasiswa Teknik Informatika',
                    'Menguasai Dart dan Flutter',
                    'Pengalaman dengan Firebase',
                    'Kreatif dan inovatif',
                    'Team player'
                ],
                [
                    'Uang saku Rp 3.500.000/bulan',
                    'Sertifikat PKL',
                    'App store publishing experience',
                    'Flexible working hours',
                    'Modern tech stack'
                ],
                'Remote', 4, 0, 'Aktif', $adminId
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
                    'Uang saku Rp 3.500.000/bulan',
                    'Sertifikat PKL',
                    'Mentor berpengalaman',
                    'Flexible working hours',
                    'Big data exposure'
                ],
                'Hybrid', 3, 0, 'Aktif', $adminId
            ),
            $this->row(
                'DevOps Engineer',
                'Teknologi',
                'Bertanggung jawab untuk CI/CD pipeline, containerization, dan infrastructure automation.',
                [
                    'Mahasiswa Teknik Informatika',
                    'Menguasai Docker, Kubernetes, dan AWS',
                    'Pengalaman dengan Jenkins/GitLab CI',
                    'Linux system administration',
                    'Scripting skills (Bash/Python)'
                ],
                [
                    'Uang saku Rp 4.000.000/bulan',
                    'Sertifikat PKL',
                    'Cloud certification support',
                    'Flexible working hours',
                    'Modern infrastructure exposure'
                ],
                'Remote', 4, 0, 'Aktif', $adminId
            ),

            // Marketing & Business
            $this->row(
                'Digital Marketing Specialist',
                'Marketing',
                'Bertanggung jawab untuk strategi pemasaran digital, content creation, dan campaign management.',
                [
                    'Mahasiswa Ilmu Komunikasi atau Marketing',
                    'Menguasai social media marketing',
                    'Pengalaman dengan Canva/Adobe Creative Suite',
                    'Analytical thinking',
                    'Creative and communicative'
                ],
                [
                    'Uang saku Rp 2.800.000/bulan',
                    'Sertifikat PKL',
                    'Campaign management experience',
                    'Flexible working hours',
                    'Portfolio development'
                ],
                'Hybrid', 3, 0, 'Aktif', $adminId
            ),
            $this->row(
                'Content Creator',
                'Marketing',
                'Pembuatan konten kreatif untuk berbagai platform media sosial dan website.',
                [
                    'Mahasiswa Ilmu Komunikasi atau Desain',
                    'Kreatif dan inovatif',
                    'Menguasai Adobe Premiere/CapCut',
                    'Pengalaman social media',
                    'Good storytelling skills'
                ],
                [
                    'Uang saku Rp 2.500.000/bulan',
                    'Sertifikat PKL',
                    'Content portfolio',
                    'Flexible working hours',
                    'Creative freedom'
                ],
                'Hybrid', 3, 0, 'Aktif', $adminId
            ),
            $this->row(
                'E-Commerce Specialist',
                'Business',
                'Pengelolaan toko online, marketplace management, dan customer service e-commerce.',
                [
                    'Mahasiswa Manajemen atau Informatika',
                    'Pengalaman e-commerce platform',
                    'Customer service skills',
                    'Data analysis capabilities',
                    'Communication skills'
                ],
                [
                    'Uang saku Rp 2.800.000/bulan',
                    'Sertifikat PKL',
                    'E-commerce certification',
                    'Flexible working hours',
                    'Business development exposure'
                ],
                'Remote', 3, 0, 'Aktif', $adminId
            ),

            // Design & Creative
            $this->row(
                'Graphic Designer',
                'Kreatif',
                'Pembuatan desain grafis untuk branding, marketing materials, dan digital content.',
                [
                    'Mahasiswa Desain Komunikasi Visual',
                    'Menguasai Adobe Creative Suite',
                    'Portfolio yang kuat',
                    'Kreatif dan detail-oriented',
                    'Understanding of branding'
                ],
                [
                    'Uang saku Rp 2.500.000/bulan',
                    'Sertifikat PKL',
                    'Design portfolio enhancement',
                    'Flexible working hours',
                    'Creative workspace'
                ],
                'Hybrid', 3, 0, 'Aktif', $adminId
            ),
            $this->row(
                'Video Editor',
                'Kreatif',
                'Editing video untuk content marketing, tutorials, dan promotional materials.',
                [
                    'Mahasiswa Film/DKV atau Multimedia',
                    'Menguasai Adobe Premiere/After Effects',
                    'Pengalaman video editing',
                    'Color grading skills',
                    'Creative storytelling'
                ],
                [
                    'Uang saku Rp 2.800.000/bulan',
                    'Sertifikat PKL',
                    'Video portfolio',
                    'Flexible working hours',
                    'Professional equipment access'
                ],
                'Hybrid', 3, 0, 'Aktif', $adminId
            ),

            // Business & Administration
            $this->row(
                'Business Analyst',
                'Business',
                'Analisis kebutuhan bisnis, proses improvement, dan sistem requirements gathering.',
                [
                    'Mahasiswa Sistem Informasi atau Manajemen',
                    'Analytical thinking',
                    'Pengalaman dengan Excel/Google Sheets',
                    'Communication skills',
                    'Problem-solving abilities'
                ],
                [
                    'Uang saku Rp 3.000.000/bulan',
                    'Sertifikat PKL',
                    'Business analysis certification prep',
                    'Flexible working hours',
                    'Corporate experience'
                ],
                'Full-time', 3, 0, 'Aktif', $adminId
            ),
            $this->row(
                'HR Administration Assistant',
                'Business',
                'Bantuan administrasi HR, recruitment support, dan employee engagement activities.',
                [
                    'Mahasiswa Psikologi atau Manajemen SDM',
                    'Communication skills',
                    'Administrative capabilities',
                    'People-oriented personality',
                    'Detail-oriented'
                ],
                [
                    'Uang saku Rp 2.500.000/bulan',
                    'Sertifikat PKL',
                    'HR certification support',
                    'Flexible working hours',
                    'People management exposure'
                ],
                'Full-time', 3, 0, 'Aktif', $adminId
            ),

            // Education & Training
            $this->row(
                'Learning Content Developer',
                'Education',
                'Pengembangan materi pembelajaran digital dan e-learning content.',
                [
                    'Mahasiswa Pendidikan Teknologi Informasi',
                    'Content creation skills',
                    'Pengalaman dengan LMS platforms',
                    'Educational background',
                    'Creative writing skills'
                ],
                [
                    'Uang saku Rp 2.800.000/bulan',
                    'Sertifikat PKL',
                    'E-learning portfolio',
                    'Flexible working hours',
                    'Educational impact'
                ],
                'Remote', 3, 0, 'Aktif', $adminId
            ),

            // Research & Development
            $this->row(
                'Research Assistant',
                'Research',
                'Bantuan penelitian, data collection, dan analisis untuk berbagai project R&D.',
                [
                    'Mahasiswa sesuai bidang penelitian',
                    'Research methodology knowledge',
                    'Data analysis skills',
                    'Academic writing abilities',
                    'Attention to detail'
                ],
                [
                    'Uang saku Rp 2.500.000/bulan',
                    'Sertifikat PKL',
                    'Research publication opportunity',
                    'Flexible working hours',
                    'Academic networking'
                ],
                'Hybrid', 4, 0, 'Aktif', $adminId
            ),

            // Quality Assurance
            $this->row(
                'Quality Assurance Tester',
                'Teknologi',
                'Testing software, bug reporting, dan quality assurance untuk aplikasi digital.',
                [
                    'Mahasiswa Teknik Informatika',
                    'Detail-oriented personality',
                    'Basic programming knowledge',
                    'Testing methodology understanding',
                    'Documentation skills'
                ],
                [
                    'Uang saku Rp 2.800.000/bulan',
                    'Sertifikat PKL',
                    'QA certification prep',
                    'Flexible working hours',
                    'Software testing exposure'
                ],
                'Remote', 3, 0, 'Aktif', $adminId
            ),

            // Customer Service
            $this->row(
                'Customer Service Representative',
                'Business',
                'Penanganan customer inquiry, support ticketing, dan customer satisfaction improvement.',
                [
                    'Mahasiswa Ilmu Komunikasi atau Psikologi',
                    'Excellent communication skills',
                    'Customer service oriented',
                    'Problem-solving abilities',
                    'Multilingual capabilities (preferred)'
                ],
                [
                    'Uang saku Rp 2.500.000/bulan',
                    'Sertifikat PKL',
                    'Customer service certification',
                    'Flexible working hours',
                    'Communication skills development'
                ],
                'Remote', 3, 0, 'Aktif', $adminId
            ),

            // Finance & Accounting
            $this->row(
                'Finance Administration Assistant',
                'Business',
                'Bantuan administrasi keuangan, budgeting support, dan financial reporting.',
                [
                    'Mahasiswa Akuntansi atau Manajemen',
                    'Basic accounting knowledge',
                    'Excel proficiency',
                    'Detail-oriented',
                    'Analytical thinking'
                ],
                [
                    'Uang saku Rp 2.800.000/bulan',
                    'Sertifikat PKL',
                    'Finance certification prep',
                    'Flexible working hours',
                    'Corporate finance exposure'
                ],
                'Full-time', 3, 0, 'Aktif', $adminId
            ),

            // Healthcare & Wellness
            $this->row(
                'Health Content Writer',
                'Content',
                'Pembuatan konten kesehatan, wellness tips, dan educational medical content.',
                [
                    'Mahasiswa Kedokteran atau Ilmu Komunikasi',
                    'Medical knowledge background',
                    'Writing and communication skills',
                    'Research capabilities',
                    'Health-conscious personality'
                ],
                [
                    'Uang saku Rp 2.500.000/bulan',
                    'Sertifikat PKL',
                    'Health writing portfolio',
                    'Flexible working hours',
                    'Healthcare industry exposure'
                ],
                'Remote', 3, 0, 'Aktif', $adminId
            ),

            // Environmental & Sustainability
            $this->row(
                'Sustainability Coordinator',
                'Business',
                'Koordinasi program sustainability, environmental reporting, dan green initiatives.',
                [
                    'Mahasiswa Environmental Science atau Business',
                    'Sustainability knowledge',
                    'Project coordination skills',
                    'Communication abilities',
                    'Environmental awareness'
                ],
                [
                    'Uang saku Rp 2.800.000/bulan',
                    'Sertifikat PKL',
                    'Sustainability certification',
                    'Flexible working hours',
                    'Corporate social responsibility exposure'
                ],
                'Hybrid', 4, 0, 'Aktif', $adminId
            ),

            // Advanced Technology Positions
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
                    'Uang saku Rp 4.000.000/bulan',
                    'Sertifikat PKL',
                    'Mentor berpengalaman',
                    'Flexible working hours',
                    'AI/ML project experience'
                ],
                'Hybrid', 4, 0, 'Aktif', $adminId
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
                    'Uang saku Rp 4.500.000/bulan',
                    'Sertifikat PKL',
                    'Mentor berpengalaman',
                    'Flexible working hours',
                    'Cutting-edge AI exposure'
                ],
                'Remote', 4, 0, 'Aktif', $adminId
            ),
            $this->row(
                'Blockchain Developer',
                'Teknologi',
                'Pengembangan aplikasi berbasis blockchain dan smart contracts.',
                [
                    'Mahasiswa Teknik Informatika',
                    'Menguasai Solidity dan Web3.js',
                    'Pengalaman dengan Ethereum',
                    'Cryptography knowledge',
                    'Security-focused mindset'
                ],
                [
                    'Uang saku Rp 4.500.000/bulan',
                    'Sertifikat PKL',
                    'Blockchain certification',
                    'Flexible working hours',
                    'Crypto industry exposure'
                ],
                'Remote', 4, 0, 'Aktif', $adminId
            ),
            $this->row(
                'IoT Developer',
                'Teknologi',
                'Pengembangan perangkat Internet of Things dan embedded systems.',
                [
                    'Mahasiswa Teknik Elektro/Informatika',
                    'Menguasai Arduino/Raspberry Pi',
                    'Embedded programming skills',
                    'Sensor integration experience',
                    'Hardware-software integration'
                ],
                [
                    'Uang saku Rp 3.500.000/bulan',
                    'Sertifikat PKL',
                    'IoT project portfolio',
                    'Flexible working hours',
                    'Hardware prototyping access'
                ],
                'Hybrid', 4, 0, 'Aktif', $adminId
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
