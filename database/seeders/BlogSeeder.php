<?php

namespace Database\Seeders;

use App\Models\Blog;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data
        Blog::truncate();

        $blogEntries = [
            // Blog Category (10 items)
            [
                'judul' => 'Mengapa Sertifikasi Profesional Penting di Era Digital',
                'konten' => 'Di era digital yang terus berkembang pesat, sertifikasi profesional menjadi kunci utama untuk meningkatkan kredibilitas dan daya saing di dunia kerja. Artikel ini membahas berbagai manfaat sertifikasi dan bagaimana cara memilih sertifikasi yang tepat sesuai dengan karier Anda.',
                'penulis' => 'Dr. Sarah Wijaya',
                'jenis_konten' => 'Blog',
                'featured' => true,
                'views' => rand(100, 1000),
            ],
            [
                'judul' => 'Tren Teknologi 2025 yang Wajib Diketahui Profesional IT',
                'konten' => 'Tahun 2025 membawa berbagai inovasi teknologi yang mengubah landscape industri IT. Dari AI generatif hingga quantum computing, profesional IT perlu memahami tren-tren ini untuk tetap relevan di masa depan.',
                'penulis' => 'Ahmad Rizki',
                'jenis_konten' => 'Blog',
                'featured' => false,
                'views' => rand(50, 500),
            ],
            [
                'judul' => 'Strategi Membangun Personal Branding untuk Profesional Muda',
                'konten' => 'Personal branding bukan lagi optional di dunia kerja modern. Artikel ini memberikan panduan lengkap untuk membangun personal branding yang kuat melalui media sosial dan networking profesional.',
                'penulis' => 'Lisa Handayani',
                'jenis_konten' => 'Blog',
                'featured' => true,
                'views' => rand(200, 800),
            ],
            [
                'judul' => 'Work-Life Balance: Kunci Produktivitas Jangka Panjang',
                'konten' => 'Menjaga keseimbangan antara kehidupan pribadi dan profesional bukanlah hal yang mudah, namun sangat penting untuk kesuksesan jangka panjang. Temukan strategi efektif untuk mencapai work-life balance yang ideal.',
                'penulis' => 'Rudi Santoso',
                'jenis_konten' => 'Blog',
                'featured' => false,
                'views' => rand(150, 600),
            ],
            [
                'judul' => 'Mengoptimalkan Produktivitas dengan Tools Digital Terkini',
                'konten' => 'Berbagai tools digital dapat membantu meningkatkan produktivitas kerja. Artikel ini mengulas tools-tools terbaik untuk project management, komunikasi tim, dan automasi workflow.',
                'penulis' => 'Maya Kusuma',
                'jenis_konten' => 'Blog',
                'featured' => false,
                'views' => rand(100, 400),
            ],
            [
                'judul' => 'Soft Skills yang Paling Dicari Employer di 2025',
                'konten' => 'Selain technical skills, soft skills menjadi faktor penentu kesuksesan karier. Pelajari soft skills apa saja yang paling dicari employer dan bagaimana cara mengembangkannya.',
                'penulis' => 'Dina Marlina',
                'jenis_konten' => 'Blog',
                'featured' => false,
                'views' => rand(80, 300),
            ],
            [
                'judul' => 'Remote Work: Tips Sukses Bekerja dari Rumah',
                'konten' => 'Remote work menjadi new normal di banyak perusahaan. Artikel ini memberikan tips praktis untuk tetap produktif dan engaged saat bekerja dari rumah.',
                'penulis' => 'Kevin Pratama',
                'jenis_konten' => 'Blog',
                'featured' => false,
                'views' => rand(120, 450),
            ],
            [
                'judul' => 'Investasi Skill: Cara Cerdas Mengalokasikan Waktu untuk Belajar',
                'konten' => 'Belajar skill baru membutuhkan investasi waktu yang tepat. Temukan strategi efektif untuk mengalokasikan waktu belajar sambil tetap menjalankan pekerjaan sehari-hari.',
                'penulis' => 'Sari Dewi',
                'jenis_konten' => 'Blog',
                'featured' => false,
                'views' => rand(90, 350),
            ],
            [
                'judul' => 'Networking Profesional: Membangun Koneksi yang Bermakna',
                'konten' => 'Networking bukan sekedar mengumpulkan contact, tapi membangun relasi yang saling menguntungkan. Pelajari cara networking yang efektif dan autentik.',
                'penulis' => 'Andi Wijaya',
                'jenis_konten' => 'Blog',
                'featured' => false,
                'views' => rand(110, 420),
            ],
            [
                'judul' => 'Mindset Growth: Kunci Menghadapi Tantangan Karier',
                'konten' => 'Growth mindset membantu profesional menghadapi tantangan dan kegagalan sebagai peluang belajar. Artikel ini membahas cara mengembangkan mindset yang tepat untuk kesuksesan karier.',
                'penulis' => 'Rina Sari',
                'jenis_konten' => 'Blog',
                'featured' => true,
                'views' => rand(200, 700),
            ],

            // Tutorial Category (10 items)
            [
                'judul' => 'Tutorial Lengkap Digital Marketing untuk Pemula',
                'konten' => 'Panduan step-by-step untuk memulai karier di digital marketing. Dari dasar-dasar SEO, social media marketing, hingga email marketing, semua dibahas secara detail dan mudah dipahami.',
                'penulis' => 'Marketer Pro',
                'jenis_konten' => 'Tutorial',
                'featured' => true,
                'views' => rand(300, 1200),
            ],
            [
                'judul' => 'Cara Membuat Website Profesional dengan WordPress',
                'konten' => 'Tutorial lengkap membuat website profesional menggunakan WordPress dari nol hingga online. Termasuk pemilihan hosting, domain, theme, dan optimasi SEO.',
                'penulis' => 'Web Developer',
                'jenis_konten' => 'Tutorial',
                'featured' => false,
                'views' => rand(250, 900),
            ],
            [
                'judul' => 'Menguasai Excel untuk Analisis Data Bisnis',
                'konten' => 'Panduan komprehensif menggunakan Microsoft Excel untuk analisis data bisnis. Dari fungsi dasar hingga pivot table dan data visualization.',
                'penulis' => 'Data Analyst',
                'jenis_konten' => 'Tutorial',
                'featured' => false,
                'views' => rand(200, 800),
            ],
            [
                'judul' => 'Tutorial Python untuk Data Science',
                'konten' => 'Belajar Python dari dasar untuk keperluan data science. Termasuk library pandas, numpy, matplotlib, dan scikit-learn dengan contoh praktis.',
                'penulis' => 'Python Expert',
                'jenis_konten' => 'Tutorial',
                'featured' => true,
                'views' => rand(400, 1500),
            ],
            [
                'judul' => 'Panduan Lengkap Google Ads untuk Bisnis Online',
                'konten' => 'Tutorial step-by-step membuat dan mengoptimalkan kampanye Google Ads. Dari riset keyword hingga analisis ROI dan optimasi budget.',
                'penulis' => 'PPC Specialist',
                'jenis_konten' => 'Tutorial',
                'featured' => false,
                'views' => rand(180, 650),
            ],
            [
                'judul' => 'Cara Membuat Desain Grafis dengan Canva Pro',
                'konten' => 'Tutorial lengkap menggunakan Canva Pro untuk membuat desain grafis profesional. Dari social media post hingga presentasi bisnis.',
                'penulis' => 'Design Guru',
                'jenis_konten' => 'Tutorial',
                'featured' => false,
                'views' => rand(150, 550),
            ],
            [
                'judul' => 'Memulai Karier sebagai Content Creator',
                'konten' => 'Panduan praktis memulai karier sebagai content creator. Dari content planning, video editing, hingga monetisasi konten di berbagai platform.',
                'penulis' => 'Content Master',
                'jenis_konten' => 'Tutorial',
                'featured' => false,
                'views' => rand(220, 750),
            ],
            [
                'judul' => 'Tutorial Cyber Security untuk Pemula',
                'konten' => 'Dasar-dasar cyber security yang wajib dipahami setiap profesional IT. Dari network security hingga ethical hacking basics.',
                'penulis' => 'Security Expert',
                'jenis_konten' => 'Tutorial',
                'featured' => false,
                'views' => rand(160, 600),
            ],
            [
                'judul' => 'Belajar UI/UX Design dari Nol',
                'konten' => 'Tutorial komprehensif belajar UI/UX design untuk pemula. Termasuk design thinking, prototyping, dan user research.',
                'penulis' => 'UX Designer',
                'jenis_konten' => 'Tutorial',
                'featured' => false,
                'views' => rand(280, 850),
            ],
            [
                'judul' => 'Panduan Project Management dengan Agile Methodology',
                'konten' => 'Tutorial lengkap implementasi Agile methodology dalam project management. Dari Scrum framework hingga tools seperti Jira dan Trello.',
                'penulis' => 'Project Manager',
                'jenis_konten' => 'Tutorial',
                'featured' => false,
                'views' => rand(190, 680),
            ],

            // News Category (10 items)
            [
                'judul' => 'Pemerintah Luncurkan Program Sertifikasi Digital Gratis 2025',
                'konten' => 'Pemerintah Indonesia meluncurkan program sertifikasi digital gratis untuk 100,000 peserta di tahun 2025. Program ini bertujuan meningkatkan skill digital workforce Indonesia.',
                'penulis' => 'Tim Redaksi',
                'jenis_konten' => 'News',
                'featured' => true,
                'views' => rand(500, 2000),
            ],
            [
                'judul' => 'Startup Indonesia Raih Pendanaan Series A Tertinggi',
                'konten' => 'Startup teknologi Indonesia berhasil meraih pendanaan Series A sebesar $50 juta, menjadi yang tertinggi di kawasan Asia Tenggara tahun ini.',
                'penulis' => 'Business Reporter',
                'jenis_konten' => 'News',
                'featured' => false,
                'views' => rand(300, 1100),
            ],
            [
                'judul' => 'Tren Remote Work Meningkat 300% di Indonesia',
                'konten' => 'Survei terbaru menunjukkan tren remote work di Indonesia meningkat 300% dibanding tahun lalu. Banyak perusahaan mulai mengadopsi hybrid working model.',
                'penulis' => 'HR Analytics',
                'jenis_konten' => 'News',
                'featured' => false,
                'views' => rand(250, 900),
            ],
            [
                'judul' => 'AI Revolution: 60% Pekerjaan Akan Berubah dalam 5 Tahun',
                'konten' => 'Studi McKinsey terbaru memperkirakan 60% pekerjaan akan mengalami transformasi signifikan akibat adopsi AI dalam 5 tahun mendatang.',
                'penulis' => 'Tech Analyst',
                'jenis_konten' => 'News',
                'featured' => true,
                'views' => rand(400, 1400),
            ],
            [
                'judul' => 'Indonesia Jadi Hub Digital Nomad Terpopuler di Asia',
                'konten' => 'Indonesia dinobatkan sebagai destinasi digital nomad terpopuler di Asia berkat infrastruktur digital yang membaik dan biaya hidup yang terjangkau.',
                'penulis' => 'Travel Tech',
                'jenis_konten' => 'News',
                'featured' => false,
                'views' => rand(200, 800),
            ],
            [
                'judul' => 'Skill Gap Technology Worker Mencapai 40% di Indonesia',
                'konten' => 'Laporan industry menunjukkan skill gap untuk technology worker di Indonesia mencapai 40%, menunjukkan urgensi program reskilling dan upskilling.',
                'penulis' => 'Industry Watch',
                'jenis_konten' => 'News',
                'featured' => false,
                'views' => rand(180, 650),
            ],
            [
                'judul' => 'Gaji Rata-rata Data Scientist Indonesia Naik 35%',
                'konten' => 'Survei gaji tahunan menunjukkan gaji rata-rata Data Scientist di Indonesia naik 35% dibanding tahun lalu, mencerminkan tingginya demand profesi ini.',
                'penulis' => 'Salary Survey',
                'jenis_konten' => 'News',
                'featured' => false,
                'views' => rand(220, 750),
            ],
            [
                'judul' => 'Investasi Pendidikan Online Indonesia Capai $2 Miliar',
                'konten' => 'Total investasi di sektor pendidikan online Indonesia mencapai $2 miliar di tahun 2024, menunjukkan antusiasme tinggi terhadap edtech.',
                'penulis' => 'EdTech News',
                'jenis_konten' => 'News',
                'featured' => false,
                'views' => rand(160, 600),
            ],
            [
                'judul' => 'Cyber Attack Meningkat 200%, Demand Cyber Security Expert Tinggi',
                'konten' => 'Laporan keamanan siber menunjukkan peningkatan cyber attack 200% di Indonesia, mendorong tingginya demand untuk cyber security expert.',
                'penulis' => 'Security News',
                'jenis_konten' => 'News',
                'featured' => false,
                'views' => rand(190, 700),
            ],
            [
                'judul' => 'Program Magang Digital Terbesar Indonesia Dibuka',
                'konten' => 'Program magang digital terbesar Indonesia resmi dibuka dengan 50,000 slot untuk fresh graduate di berbagai perusahaan teknologi terkemuka.',
                'penulis' => 'Career News',
                'jenis_konten' => 'News',
                'featured' => false,
                'views' => rand(280, 950),
            ],
        ];

        foreach ($blogEntries as $data) {
            Blog::create([
                'nama_artikel'      => $data['judul'],
                'jenis_konten'      => $data['jenis_konten'],
                'deskripsi'         => Str::limit(strip_tags($data['konten']), 150),
                'thumbnail'         => null,
                'konten'            => $data['konten'],
                'status'            => 'Publish',
                'penulis'           => $data['penulis'],
                'views'             => $data['views'],
                'featured'          => $data['featured'],
                'meta_title'        => $data['judul'],
                'meta_description'  => Str::limit(strip_tags($data['konten']), 160),
                'slug'              => Str::slug($data['judul']),
                'created_at'        => now()->subDays(rand(1, 30)),
                'updated_at'        => now()->subDays(rand(1, 30)),
            ]);
        }
    }
}
