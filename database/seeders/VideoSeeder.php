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
                'judul' => 'Trackmania Turbo Platinum Trophy',
                'deskripsi' => 'Trackmania Turbo Platinum Trophy tested my PATIENCE!!!',
                'thumbnail' => 'videos/trackmania.jpg',
                'link_video' => 'https://www.youtube.com/watch?v=5t-cEMD3Of0',
                'status' => 'Publish',
                'penulis' => 'Admin',
                'featured' => true,
                'views' => 120,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Tutorial React Dasar',
                'deskripsi' => 'Belajar React dari nol untuk pemula.',
                'thumbnail' => 'videos/react.jpg',
                'link_video' => 'https://www.youtube.com/watch?v=dGcsHMXbSOA',
                'status' => 'Draft',
                'penulis' => 'Budi',
                'featured' => false,
                'views' => 45,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Laravel Eloquent Relationships',
                'deskripsi' => 'Penjelasan relasi Eloquent di Laravel.',
                'thumbnail' => 'videos/laravel.jpg',
                'link_video' => 'https://www.youtube.com/watch?v=ImtZ5yENzgE',
                'status' => 'Publish',
                'penulis' => 'Siti',
                'featured' => false,
                'views' => 78,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];
        foreach ($entries as $data) {
            Video::create($data);
        }
    }
}
