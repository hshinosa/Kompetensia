<?php

namespace Database\Seeders;

use App\Models\Blog;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $entries = [
            [
                'judul' => 'Tips Sukses Mengikuti Sertifikasi Digital Marketing',
                'konten' => 'Artikel tentang tips dan trik untuk sukses dalam sertifikasi digital marketing...',
                'penulis' => 'Admin Kompetensia',
                'jenis_konten' => 'Tutorial',
                'meta_title' => 'Tips Sukses Sertifikasi Digital Marketing',
                'meta_description' => 'Pelajari tips dan trik sukses mengikuti sertifikasi digital marketing.',
            ],
            [
                'judul' => 'Pentingnya PKL dalam Dunia Kerja',
                'konten' => 'Mengapa PKL sangat penting untuk mempersiapkan diri memasuki dunia kerja...',
                'penulis' => 'Admin Kompetensia',
                'jenis_konten' => 'News',
                'meta_title' => 'Pentingnya PKL untuk Dunia Kerja',
                'meta_description' => 'Temukan alasan mengapa PKL penting untuk persiapan kerja.',
            ],
        ];
        foreach ($entries as $data) {
            Blog::create([
                'nama_artikel'      => $data['judul'],
                'jenis_konten'      => $data['jenis_konten'] ?? 'Blog',
                'deskripsi'         => Str::limit(strip_tags($data['konten']), 150),
                'thumbnail'         => null,
                'konten'            => $data['konten'],
                'status'            => 'Publish',
                'penulis'           => $data['penulis'],
                'views'             => 0,
                'featured'          => false,
                'meta_title'        => $data['meta_title'] ?? null,
                'meta_description'  => $data['meta_description'] ?? null,
                'slug'              => Str::slug($data['judul']) . '-' . Str::random(5),
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);
        }
    }
}
