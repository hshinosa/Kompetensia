<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PKL;
use Carbon\Carbon;

class PKLSeeder extends Seeder
{
    public function run(): void
    {
        $pklData = [
            [
                'nama_program' => 'Program PKL Web Development',
                'deskripsi' => 'Mengembangkan aplikasi web menggunakan Laravel dan React. Bekerja dengan tim development untuk membuat fitur-fitur baru.',
                'durasi_minggu' => 12,
                'peserta_terdaftar' => 0,
                'status' => 'Aktif',
                'persyaratan' => [
                    'Mahasiswa semester 5-7',
                    'Memahami HTML, CSS, JavaScript',
                    'Familiar dengan framework Laravel atau React',
                    'IPK minimal 3.0'
                ],
                'benefit' => [
                    'Uang saku Rp 1.500.000/bulan',
                    'Sertifikat PKL',
                    'Mentor berpengalaman',
                    'Flexible working hours'
                ]
            ],
            [
                'nama_program' => 'Program PKL Mobile Development',
                'deskripsi' => 'Mengembangkan aplikasi mobile untuk Android dan iOS menggunakan React Native atau Flutter.',
                'durasi_minggu' => 16,
                'peserta_terdaftar' => 0,
                'status' => 'Aktif',
                'persyaratan' => [
                    'Mahasiswa semester 4-8',
                    'Memahami Java/Kotlin atau Swift',
                    'Pengalaman dengan React Native/Flutter lebih disukai',
                    'IPK minimal 2.75'
                ],
                'benefit' => [
                    'Uang saku Rp 1.200.000/bulan',
                    'Sertifikat PKL',
                    'Training mobile development',
                    'Akses ke device testing'
                ]
            ],
            [
                'nama_program' => 'Program PKL Data Analytics',
                'deskripsi' => 'Menganalisis data bisnis, membuat dashboard, dan memberikan insights untuk pengambilan keputusan.',
                'durasi_minggu' => 12,
                'peserta_terdaftar' => 0,
                'status' => 'Aktif',
                'persyaratan' => [
                    'Mahasiswa semester 5-7',
                    'Memahami Python/R dan SQL',
                    'Familiar dengan Excel/Google Sheets',
                    'Pengalaman dengan visualization tools (Tableau/Power BI) lebih disukai'
                ],
                'benefit' => [
                    'Uang saku Rp 1.300.000/bulan',
                    'Sertifikat PKL',
                    'Training data analysis',
                    'Akses ke tools premium'
                ]
            ],
            [
                'nama_program' => 'Program PKL UI/UX Design',
                'deskripsi' => 'Mendesain user interface dan user experience untuk aplikasi web dan mobile.',
                'durasi_minggu' => 12,
                'peserta_terdaftar' => 0,
                'status' => 'Aktif',
                'persyaratan' => [
                    'Mahasiswa semester 4-8',
                    'Menguasai Figma/Adobe XD',
                    'Memahami prinsip design',
                    'Portfolio design yang baik'
                ],
                'benefit' => [
                    'Uang saku Rp 1.100.000/bulan',
                    'Sertifikat PKL',
                    'Mentoring dari senior designer',
                    'Akses ke design tools premium'
                ]
            ],
            [
                'nama_program' => 'Program PKL Digital Marketing',
                'deskripsi' => 'Mengelola kampanye digital marketing, social media management, dan content creation.',
                'durasi_minggu' => 12,
                'peserta_terdaftar' => 0,
                'status' => 'Aktif',
                'persyaratan' => [
                    'Mahasiswa semester 3-7',
                    'Memahami social media platforms',
                    'Kemampuan content creation',
                    'Familiar dengan Google Analytics/Ads'
                ],
                'benefit' => [
                    'Uang saku Rp 1.000.000/bulan',
                    'Sertifikat PKL',
                    'Training digital marketing',
                    'Networking opportunities'
                ]
            ]
        ];

        foreach ($pklData as $data) {
            PKL::create($data);
        }

        $this->command->info('PKL positions seeded successfully!');
    }
}
