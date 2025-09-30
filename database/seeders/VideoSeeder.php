<?php

namespace Database\Seeders;

use App\Models\Video;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class VideoSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data
        Video::truncate();

        $videoEntries = [
            // Tutorial Category (10 items)
            [
                'nama' => 'Tutorial Complete Digital Marketing 2025',
                'deskripsi' => 'Pelajari digital marketing dari dasar hingga mahir dalam video tutorial lengkap ini. Mencakup SEO, SEM, social media marketing, email marketing, dan analytics.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 3600, // 1 hour
                'uploader' => 'Digital Marketing Pro',
                'featured' => true,
                'views' => rand(500, 2000),
            ],
            [
                'nama' => 'Belajar Python untuk Data Science - Full Course',
                'deskripsi' => 'Tutorial lengkap Python untuk data science dari nol hingga mahir. Termasuk pandas, numpy, matplotlib, dan machine learning basics.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 7200, // 2 hours
                'uploader' => 'Python Expert',
                'featured' => true,
                'views' => rand(800, 3000),
            ],
            [
                'nama' => 'Web Development dengan React JS - Panduan Lengkap',
                'deskripsi' => 'Tutorial komprehensif belajar React JS dari basic hingga advanced. Termasuk hooks, context API, dan best practices.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 5400, // 1.5 hours
                'uploader' => 'React Developer',
                'featured' => false,
                'views' => rand(400, 1500),
            ],
            [
                'nama' => 'UI/UX Design Masterclass - From Zero to Hero',
                'deskripsi' => 'Belajar UI/UX design dari dasar hingga professional level. Mencakup design thinking, wireframing, prototyping, dan usability testing.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 4800, // 1 hour 20 minutes
                'uploader' => 'UX Master',
                'featured' => false,
                'views' => rand(300, 1200),
            ],
            [
                'nama' => 'Excel Advanced - Data Analysis dan Visualization',
                'deskripsi' => 'Tutorial Excel level advanced untuk data analysis dan visualization. Pivot tables, advanced functions, macros, dan dashboard creation.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 3900, // 1 hour 5 minutes
                'uploader' => 'Excel Guru',
                'featured' => false,
                'views' => rand(250, 1000),
            ],
            [
                'nama' => 'Cyber Security Fundamentals - Ethical Hacking',
                'deskripsi' => 'Dasar-dasar cyber security dan ethical hacking. Network security, penetration testing, dan security best practices.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 4200, // 1 hour 10 minutes
                'uploader' => 'Security Expert',
                'featured' => false,
                'views' => rand(350, 1400),
            ],
            [
                'nama' => 'Content Creation Strategy untuk Social Media',
                'deskripsi' => 'Strategi content creation yang efektif untuk berbagai platform social media. Video editing, copywriting, dan engagement optimization.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 2700, // 45 minutes
                'uploader' => 'Content Strategist',
                'featured' => false,
                'views' => rand(200, 800),
            ],
            [
                'nama' => 'Project Management dengan Agile Methodology',
                'deskripsi' => 'Tutorial lengkap project management menggunakan Agile methodology. Scrum framework, sprint planning, dan team collaboration.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 3300, // 55 minutes
                'uploader' => 'Agile Coach',
                'featured' => false,
                'views' => rand(180, 700),
            ],
            [
                'nama' => 'Google Ads Mastery - ROI Optimization',
                'deskripsi' => 'Master Google Ads untuk maksimalkan ROI. Keyword research, ad copywriting, bidding strategies, dan conversion tracking.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 4500, // 1 hour 15 minutes
                'uploader' => 'PPC Specialist',
                'featured' => false,
                'views' => rand(220, 900),
            ],
            [
                'nama' => 'AWS Cloud Computing untuk Pemula',
                'deskripsi' => 'Tutorial AWS cloud computing dari basic hingga intermediate. EC2, S3, RDS, Lambda, dan cloud architecture best practices.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 5100, // 1 hour 25 minutes
                'uploader' => 'Cloud Architect',
                'featured' => true,
                'views' => rand(400, 1600),
            ],

            // Webinar Category (10 items)
            [
                'nama' => 'Future of Work: AI dan Automation Impact',
                'deskripsi' => 'Webinar ekslusif tentang dampak AI dan automation terhadap dunia kerja masa depan. Diskusi dengan para industry leader.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 3600, // 1 hour
                'uploader' => 'Future Work Summit',
                'featured' => true,
                'views' => rand(600, 2500),
            ],
            [
                'nama' => 'Startup Funding Strategy - From Seed to Series A',
                'deskripsi' => 'Webinar dengan founder dan investor sukses membahas strategi funding startup dari seed hingga Series A.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 4800, // 1 hour 20 minutes
                'uploader' => 'Startup Conference',
                'featured' => false,
                'views' => rand(300, 1200),
            ],
            [
                'nama' => 'Digital Transformation untuk UMKM',
                'deskripsi' => 'Webinar khusus UMKM tentang digital transformation. E-commerce, digital marketing, dan online business strategy.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 2700, // 45 minutes
                'uploader' => 'UMKM Digital',
                'featured' => false,
                'views' => rand(250, 1000),
            ],
            [
                'nama' => 'Leadership in Remote Work Era',
                'deskripsi' => 'Webinar tentang leadership challenges dan strategies di era remote work. Managing distributed teams dan virtual collaboration.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 3300, // 55 minutes
                'uploader' => 'Leadership Institute',
                'featured' => false,
                'views' => rand(180, 800),
            ],
            [
                'nama' => 'Women in Tech: Breaking Barriers',
                'deskripsi' => 'Webinar inspiratif dengan women leaders di industri teknologi. Career journey, challenges, dan tips untuk women in tech.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 3900, // 1 hour 5 minutes
                'uploader' => 'Tech Diversity',
                'featured' => true,
                'views' => rand(400, 1500),
            ],
            [
                'nama' => 'Sustainable Business Strategy in Digital Age',
                'deskripsi' => 'Webinar tentang sustainable business practices di era digital. ESG, green technology, dan responsible innovation.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 4200, // 1 hour 10 minutes
                'uploader' => 'Sustainability Summit',
                'featured' => false,
                'views' => rand(200, 900),
            ],
            [
                'nama' => 'Fintech Revolution di Indonesia',
                'deskripsi' => 'Webinar tentang perkembangan fintech di Indonesia. Regulasi, inovasi, dan opportunity untuk digital financial services.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 3600, // 1 hour
                'uploader' => 'Fintech Indonesia',
                'featured' => false,
                'views' => rand(220, 850),
            ],
            [
                'nama' => 'Mental Health untuk Profesional Modern',
                'deskripsi' => 'Webinar penting tentang mental health di workplace modern. Stress management, work-life balance, dan psychological wellbeing.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 2400, // 40 minutes
                'uploader' => 'Wellness Institute',
                'featured' => false,
                'views' => rand(160, 700),
            ],
            [
                'nama' => 'E-commerce Growth Strategy 2025',
                'deskripsi' => 'Webinar tentang strategi growth e-commerce di tahun 2025. Marketplace optimization, social commerce, dan customer retention.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 3900, // 1 hour 5 minutes
                'uploader' => 'E-commerce Summit',
                'featured' => false,
                'views' => rand(280, 1100),
            ],
            [
                'nama' => 'Blockchain Technology dan Cryptocurrency Future',
                'deskripsi' => 'Webinar mendalam tentang blockchain technology dan masa depan cryptocurrency. Use cases, regulation, dan investment perspective.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 4500, // 1 hour 15 minutes
                'uploader' => 'Blockchain Conference',
                'featured' => false,
                'views' => rand(350, 1300),
            ],

            // Tips Category (10 items)
            [
                'nama' => '10 Tips Produktivitas untuk Remote Worker',
                'deskripsi' => 'Tips praktis meningkatkan produktivitas saat bekerja dari rumah. Time management, workspace setup, dan work-life balance.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 900, // 15 minutes
                'uploader' => 'Productivity Expert',
                'featured' => false,
                'views' => rand(200, 800),
            ],
            [
                'nama' => '5 Kesalahan Fatal dalam Digital Marketing',
                'deskripsi' => 'Kesalahan-kesalahan umum yang harus dihindari dalam digital marketing campaign. Budget optimization dan targeting yang efektif.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 720, // 12 minutes
                'uploader' => 'Marketing Guru',
                'featured' => true,
                'views' => rand(300, 1200),
            ],
            [
                'nama' => 'Cara Cepat Belajar Programming Language Baru',
                'deskripsi' => 'Tips efektif untuk mempelajari programming language baru dengan cepat. Learning resources, practice methods, dan project ideas.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 1080, // 18 minutes
                'uploader' => 'Code Master',
                'featured' => false,
                'views' => rand(250, 1000),
            ],
            [
                'nama' => 'Networking Tips untuk Introvert',
                'deskripsi' => 'Tips networking yang efektif untuk personality introvert. Online networking, one-on-one meetings, dan authentic relationship building.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 840, // 14 minutes
                'uploader' => 'Career Coach',
                'featured' => false,
                'views' => rand(180, 700),
            ],
            [
                'nama' => 'Resume Writing Tips yang ATS Friendly',
                'deskripsi' => 'Tips menulis resume yang ATS friendly dan eye-catching untuk recruiter. Keyword optimization dan format yang tepat.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 960, // 16 minutes
                'uploader' => 'HR Specialist',
                'featured' => false,
                'views' => rand(220, 900),
            ],
            [
                'nama' => 'Investment Tips untuk Young Professional',
                'deskripsi' => 'Tips investasi untuk young professional. Financial planning, portfolio diversification, dan long-term wealth building.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 1200, // 20 minutes
                'uploader' => 'Financial Advisor',
                'featured' => false,
                'views' => rand(160, 600),
            ],
            [
                'nama' => 'Time Management Hacks for Busy Entrepreneur',
                'deskripsi' => 'Time management hacks khusus untuk entrepreneur yang sibuk. Prioritization, delegation, dan automation strategies.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 780, // 13 minutes
                'uploader' => 'Business Coach',
                'featured' => false,
                'views' => rand(190, 750),
            ],
            [
                'nama' => 'Public Speaking Tips untuk Presentasi Profesional',
                'deskripsi' => 'Tips public speaking untuk presentasi profesional yang impactful. Body language, voice control, dan audience engagement.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 1020, // 17 minutes
                'uploader' => 'Communication Expert',
                'featured' => false,
                'views' => rand(210, 850),
            ],
            [
                'nama' => 'Social Media Strategy untuk Personal Branding',
                'deskripsi' => 'Tips membangun personal branding yang kuat melalui social media. Content strategy, engagement, dan professional image.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 900, // 15 minutes
                'uploader' => 'Brand Strategist',
                'featured' => true,
                'views' => rand(280, 1100),
            ],
            [
                'nama' => 'Stress Management untuk High Achiever',
                'deskripsi' => 'Tips mengelola stress untuk high achiever dan perfectionist. Mindfulness, self-care, dan sustainable performance.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'durasi' => 1140, // 19 minutes
                'uploader' => 'Wellness Coach',
                'featured' => false,
                'views' => rand(170, 650),
            ],
        ];

        foreach ($videoEntries as $data) {
            Video::create([
                'nama_video'    => $data['nama'],
                'deskripsi'     => $data['deskripsi'],
                'video_url'     => $data['video_url'],
                'durasi'        => $data['durasi'],
                'views'         => $data['views'],
                'featured'      => $data['featured'],
                'status'        => 'Publish',
                'uploader'      => $data['uploader'],
                'slug'          => Str::slug($data['nama']),
                'created_at'    => now()->subDays(rand(1, 30)),
                'updated_at'    => now()->subDays(rand(1, 30)),
            ]);
        }
    }
}
