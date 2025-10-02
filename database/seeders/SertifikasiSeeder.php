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
        
        // Seeder berdasarkan struktur tabel yang benar dengan 25+ sertifikasi praktis dan relevan
        $sertifikasiData = [
            // Digital Marketing & Business
            [
                'nama_sertifikasi' => 'Digital Marketing Specialist',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Program sertifikasi komprehensif untuk menguasai strategi pemasaran digital modern. Peserta akan mempelajari SEO, SEM, social media marketing, content marketing, email marketing, dan analytics. Cocok untuk marketer, entrepreneur, dan profesional yang ingin meningkatkan skill digital marketing.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Profesi']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[0] ?? null,
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
                'asesor_id' => $asesorIds[1] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Social Media Marketing Expert',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Sertifikasi spesialis pemasaran media sosial untuk berbagai platform. Materi meliputi content strategy, community management, influencer marketing, paid ads, dan analytics untuk Instagram, TikTok, Facebook, LinkedIn, dan YouTube.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Pelatihan']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[2] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],

            // Programming & Development
            [
                'nama_sertifikasi' => 'Full Stack Web Developer',
                'jenis_sertifikasi' => 'BNSP',
                'deskripsi' => 'Sertifikasi pengembangan web lengkap dari frontend hingga backend. Materi meliputi HTML5, CSS3, JavaScript ES6+, React.js, Node.js, Express.js, MongoDB, dan deployment. Program ini dirancang untuk menghasilkan developer yang siap kerja di industri teknologi.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Keahlian']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[0] ?? null,
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
                'asesor_id' => $asesorIds[1] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Python Programming for Data Science',
                'jenis_sertifikasi' => 'BNSP',
                'deskripsi' => 'Sertifikasi programming Python khusus untuk data science. Materi mencakup Python fundamentals, pandas, numpy, matplotlib, seaborn, dan machine learning dasar menggunakan scikit-learn.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Keahlian']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[2] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'JavaScript & React Developer',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Sertifikasi pengembangan frontend modern dengan JavaScript dan React. Peserta akan belajar ES6+, React hooks, Redux, Next.js, dan best practices untuk membangun aplikasi web yang scalable.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Profesi']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[0] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],

            // Design & Creative
            [
                'nama_sertifikasi' => 'UI/UX Designer Professional',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Program sertifikasi desain antarmuka dan pengalaman pengguna. Peserta akan mempelajari design thinking, user research, wireframing, prototyping, visual design, dan usability testing menggunakan tools seperti Figma, Adobe XD, dan Sketch.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Profesi']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[1] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Graphic Design with Adobe Creative Suite',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Sertifikasi desain grafis profesional menggunakan Adobe Creative Suite. Materi meliputi Photoshop, Illustrator, InDesign untuk branding, print design, digital graphics, dan motion graphics.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Pelatihan']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[2] ?? null,
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
                'asesor_id' => $asesorIds[0] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],

            // Data & Analytics
            [
                'nama_sertifikasi' => 'Data Analyst with Python',
                'jenis_sertifikasi' => 'BNSP',
                'deskripsi' => 'Sertifikasi analisis data menggunakan Python untuk mengolah dan menganalisis big data. Materi mencakup Python programming, pandas, numpy, matplotlib, seaborn, SQL, dan machine learning dasar. Ideal untuk yang ingin berkarir sebagai data analyst.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Keahlian']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[1] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Business Intelligence & Tableau',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Sertifikasi business intelligence menggunakan Tableau untuk data visualization dan dashboard creation. Peserta akan belajar data modeling, dashboard design, storytelling with data, dan advanced analytics.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Profesi']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[2] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'SQL Database Administrator',
                'jenis_sertifikasi' => 'BNSP',
                'deskripsi' => 'Sertifikasi administrasi database dengan fokus pada SQL dan database management. Materi meliputi database design, query optimization, backup & recovery, security, dan performance tuning untuk MySQL, PostgreSQL, dan SQL Server.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Keahlian']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[0] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],

            // Cybersecurity & Infrastructure
            [
                'nama_sertifikasi' => 'Cybersecurity Fundamentals',
                'jenis_sertifikasi' => 'BNSP',
                'deskripsi' => 'Program sertifikasi keamanan siber yang mengajarkan dasar-dasar cybersecurity, network security, ethical hacking, penetration testing, dan incident response. Peserta akan belajar menggunakan tools seperti Kali Linux, Wireshark, dan Nmap.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Pelatihan']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[1] ?? null,
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
                'asesor_id' => $asesorIds[2] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'DevOps Engineer',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Sertifikasi DevOps yang mencakup CI/CD, containerization dengan Docker, orchestration dengan Kubernetes, infrastructure as code dengan Terraform, dan monitoring dengan Prometheus dan Grafana.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Profesi']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[0] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],

            // Business & Management
            [
                'nama_sertifikasi' => 'Project Management Professional',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Sertifikasi manajemen proyek yang mengajarkan metodologi Agile, Scrum, Kanban, dan traditional project management. Peserta akan belajar planning, execution, monitoring, dan closing projects menggunakan tools seperti Jira dan Trello.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Profesi']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[1] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Digital Entrepreneurship',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Sertifikasi kewirausahaan digital yang mengajarkan cara memulai dan mengelola bisnis online. Materi meliputi business model canvas, market research, financial planning, digital marketing, dan scaling strategies.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Profesi']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[2] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Customer Service Excellence',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Sertifikasi layanan pelanggan yang mengajarkan teknik komunikasi efektif, handling difficult customers, CRM systems, dan strategi untuk meningkatkan customer satisfaction dan loyalty.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Pelatihan']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[0] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],

            // Emerging Technologies
            [
                'nama_sertifikasi' => 'Artificial Intelligence & Machine Learning',
                'jenis_sertifikasi' => 'BNSP',
                'deskripsi' => 'Sertifikasi kecerdasan buatan dan machine learning untuk pemula hingga menengah. Materi meliputi supervised/unsupervised learning, neural networks, deep learning, computer vision, dan NLP menggunakan Python dan TensorFlow.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Keahlian']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[1] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Blockchain & Cryptocurrency',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Sertifikasi teknologi blockchain dan cryptocurrency. Peserta akan mempelajari konsep blockchain, smart contracts dengan Solidity, DeFi, NFT, dan pengembangan dApps untuk Ethereum network.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Profesi']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[2] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Internet of Things (IoT)',
                'jenis_sertifikasi' => 'BNSP',
                'deskripsi' => 'Sertifikasi Internet of Things yang mencakup sensor programming, microcontroller (Arduino/Raspberry Pi), wireless communication, cloud integration, dan development of IoT applications untuk smart home dan industry 4.0.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Keahlian']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[0] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],

            // Specialized Skills
            [
                'nama_sertifikasi' => 'SEO & Content Marketing',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Sertifikasi optimasi mesin pencari dan pemasaran konten. Materi meliputi on-page/off-page SEO, keyword research, content strategy, technical SEO, dan analytics menggunakan Google Analytics dan Search Console.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Pelatihan']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[1] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Game Development with Unity',
                'jenis_sertifikasi' => 'Industri',
                'deskripsi' => 'Sertifikasi pengembangan game menggunakan Unity engine. Peserta akan belajar C# programming, 2D/3D game development, physics, animation, UI systems, dan publishing games ke berbagai platform.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Profesi']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[2] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'nama_sertifikasi' => 'Quality Assurance & Software Testing',
                'jenis_sertifikasi' => 'BNSP',
                'deskripsi' => 'Sertifikasi quality assurance dan software testing. Materi meliputi manual testing, automated testing dengan Selenium, API testing, performance testing, dan test management menggunakan Jira dan TestRail.',
                'thumbnail' => null,
                'tipe_sertifikat' => json_encode(['Sertifikat Keahlian']),
                'status' => 'Aktif',
                'asesor_id' => $asesorIds[0] ?? null,
                'created_by' => 1,
                'updated_by' => 1,
            ],
        ];

        foreach ($sertifikasiData as $data) {
            Sertifikasi::create($data);
        }

        // Automatically seed batch sertifikasi after creating sertifikasi
        $this->call(BatchSertifikasiSeeder::class);

        echo "Sertifikasi and Batch seeded successfully!\n";
    }
}
