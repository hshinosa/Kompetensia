<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sertifikasi;
use App\Models\Asesor;

class SertifikasiSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus data lama dengan menghapus foreign key dependencies dulu
        \Illuminate\Support\Facades\DB::table('modul_sertifikasi')->delete();
        \Illuminate\Support\Facades\DB::table('batch_sertifikasi')->delete();
        \Illuminate\Support\Facades\DB::table('pendaftaran_sertifikasi')->delete();
        \Illuminate\Support\Facades\DB::table('sertifikasi')->delete();
        
        // Pastikan asesor sudah ada sebelum menambahkan sertifikasi
        if (Asesor::count() == 0) {
            $this->call(AsesorSeeder::class);
        }
        
        // Ambil ID asesor yang tersedia
        $asesorIds = Asesor::pluck('id')->toArray();
        
        // Seeder berdasarkan struktur tabel yang benar dengan 10 sertifikasi praktis
        $sertifikasiData = [
            [
                'nama_sertifikasi' => 'Digital Marketing Specialist',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Program sertifikasi komprehensif untuk menguasai strategi pemasaran digital modern. Peserta akan mempelajari SEO, SEM, social media marketing, content marketing, email marketing, dan analytics. Cocok untuk marketer, entrepreneur, dan profesional yang ingin meningkatkan skill digital marketing.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Profesi']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[0] ?? null, // Asesor pertama
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Full Stack Web Developer',
                'jenis_sertifikasi' => 'BNSP',
                'deskripsi' => 'Sertifikasi pengembangan web lengkap dari frontend hingga backend. Materi meliputi HTML5, CSS3, JavaScript ES6+, React.js, Node.js, Express.js, MongoDB, dan deployment. Program ini dirancang untuk menghasilkan developer yang siap kerja di industri teknologi.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Keahlian']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[1] ?? null, // Asesor kedua
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'UI/UX Designer Professional',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Program sertifikasi desain antarmuka dan pengalaman pengguna. Peserta akan mempelajari design thinking, user research, wireframing, prototyping, visual design, dan usability testing menggunakan tools seperti Figma, Adobe XD, dan Sketch.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Profesi']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[2] ?? null, // Asesor ketiga
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Data Analyst with Python',
                'jenis_sertifikasi' => 'BNSP',
                'deskripsi' => 'Sertifikasi analisis data menggunakan Python untuk mengolah dan menganalisis big data. Materi mencakup Python programming, pandas, numpy, matplotlib, seaborn, SQL, dan machine learning dasar. Ideal untuk yang ingin berkarir sebagai data analyst.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Keahlian']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[0] ?? null, // Rotasi kembali ke asesor pertama
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Cybersecurity Fundamentals',
                'jenis_sertifikasi' => 'BNSP',
                'deskripsi' => 'Program sertifikasi keamanan siber yang mengajarkan dasar-dasar cybersecurity, network security, ethical hacking, penetration testing, dan incident response. Peserta akan belajar menggunakan tools seperti Kali Linux, Wireshark, dan Nmap.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Pelatihan']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[1] ?? null, // Asesor kedua
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Mobile App Development (Flutter)',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Sertifikasi pengembangan aplikasi mobile cross-platform menggunakan Flutter dan Dart. Materi meliputi widget, state management, API integration, database, dan publishing ke Google Play Store dan App Store.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Profesi']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[2] ?? null, // Asesor ketiga
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Cloud Computing with AWS',
                'jenis_sertifikasi' => 'BNSP',
                'deskripsi' => 'Program sertifikasi cloud computing menggunakan Amazon Web Services. Peserta akan mempelajari EC2, S3, RDS, Lambda, CloudFormation, dan best practices untuk membangun aplikasi scalable di cloud.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Keahlian']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[0] ?? null, // Asesor pertama
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Project Management Professional',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Sertifikasi manajemen proyek yang mengajarkan metodologi Agile, Scrum, Kanban, dan traditional project management. Peserta akan belajar planning, execution, monitoring, dan closing projects menggunakan tools seperti Jira dan Trello.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Profesi']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[1] ?? null, // Asesor kedua
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Content Creator & Video Editing',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Program sertifikasi untuk content creator yang ingin mahir dalam video editing dan content production. Materi meliputi Adobe Premiere Pro, After Effects, storytelling, cinematography, dan strategi content untuk berbagai platform social media.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Pelatihan']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[2] ?? null, // Asesor ketiga
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'E-Commerce & Online Business',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Sertifikasi bisnis online yang mengajarkan cara membangun dan mengelola toko online. Peserta akan mempelajari marketplace management, dropshipping, inventory management, customer service, dan digital payment systems.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Profesi']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[0] ?? null, // Asesor pertama
                'created_by' => 1,
                'updated_by' => 1,
            ]
        ];

        foreach ($sertifikasiData as $data) {
            Sertifikasi::create($data);
        }

        // Automatically seed batch sertifikasi after creating sertifikasi
        $this->call(BatchSertifikasiSeeder::class);

        echo "Sertifikasi and Batch seeded successfully!\n";
    }
}
