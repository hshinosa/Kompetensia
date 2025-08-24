<?php

namespace Database\Seeders;

use App\Models\Video;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class VideoSeeder extends Seeder
{
    public function run(): void
    {
        $entries = [
            [
                'judul' => 'Pengenalan Digital Marketing untuk Pemula',
                'deskripsi' => 'Video tutorial dasar digital marketing untuk pemula.',
                'url_video' => 'https://www.youtube.com/watch?v=example1',
                'durasi' => 1800, // 30 minutes
            ],
            [
                'judul' => 'Dasar-dasar Web Development',
                'deskripsi' => 'Video pembelajaran tentang fundamental web development.',
                'url_video' => 'https://www.youtube.com/watch?v=example2',
                'durasi' => 2700, // 45 minutes
            ],
        ];
        foreach ($entries as $data) {
            Video::create([
                'nama_video' => $data['judul'],
                'deskripsi' => $data['deskripsi'],
                'video_url' => $data['url_video'],
                'durasi' => $data['durasi'],
                'views' => 0,
                'featured' => false,
                'status' => 'Publish',
                'uploader' => 'Admin Kompetensia',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
