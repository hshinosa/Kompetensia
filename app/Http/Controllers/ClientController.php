<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Video;
use App\Models\Sertifikasi;
use App\Models\BatchSertifikasi;
use App\Models\PosisiPKL;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function landingPage()
    {
        $featuredBlogs = Blog::published()
            ->featured()
            ->latest()
            ->limit(2)
            ->select('id', 'nama_artikel', 'deskripsi', 'thumbnail', 'penulis', 'created_at', 'slug')
            ->get()
            ->map(function ($blog) {
                return [
                    'id' => $blog->id,
                    'type' => 'blog',
                    'title' => $blog->nama_artikel,
                    'author' => $blog->penulis,
                    'date' => $blog->created_at->locale('id')->isoFormat('D MMMM YYYY'),
                    'img' => $blog->thumbnail_url ?: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
                    'desc' => $blog->excerpt ?: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    'slug' => $blog->slug,
                ];
            });

        // Ambil video featured dan published (maksimal 2)
        $featuredVideos = Video::published()
            ->featured()
            ->latest()
            ->limit(2)
            ->select('id', 'nama_video', 'deskripsi', 'uploader', 'created_at', 'durasi', 'video_url')
            ->get()
            ->map(function ($video) {
                // Extract YouTube video ID from URL
                $videoId = null;
                if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $video->video_url, $matches)) {
                    $videoId = $matches[1];
                }
                
                return [
                    'id' => $video->id,
                    'type' => 'video',
                    'title' => $video->nama_video,
                    'author' => $video->uploader,
                    'date' => $video->created_at->locale('id')->isoFormat('D MMMM YYYY'),
                    'img' => $videoId ? "https://img.youtube.com/vi/{$videoId}/maxresdefault.jpg" : 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=400&q=80',
                    'desc' => $video->deskripsi ?: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    'slug' => '#', // Nanti bisa ditambahkan route untuk video
                    'durasi' => $video->durasi ?? null,
                ];
            });

        // Gabungkan blog dan video
        $featuredContent = $featuredBlogs->concat($featuredVideos);

        // Jika konten kurang dari 4, ambil konten published terbaru
        if ($featuredContent->count() < 4) {
            $remainingCount = 4 - $featuredContent->count();
            $halfRemaining = ceil($remainingCount / 2);
            
            // Ambil blog tambahan
            $additionalBlogs = Blog::published()
                ->latest()
                ->whereNotIn('id', $featuredBlogs->pluck('id'))
                ->limit($halfRemaining)
                ->select('id', 'nama_artikel', 'deskripsi', 'thumbnail', 'penulis', 'created_at', 'slug')
                ->get()
                ->map(function ($blog) {
                    return [
                        'id' => $blog->id,
                        'type' => 'blog',
                        'title' => $blog->nama_artikel,
                        'author' => $blog->penulis,
                        'date' => $blog->created_at->locale('id')->isoFormat('D MMMM YYYY'),
                        'img' => $blog->thumbnail_url ?: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
                        'desc' => $blog->excerpt ?: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                        'slug' => $blog->slug,
                    ];
                });

            // Ambil video tambahan
            $additionalVideos = Video::published()
                ->latest()
                ->whereNotIn('id', $featuredVideos->pluck('id'))
                ->limit($remainingCount - $halfRemaining)
                ->select('id', 'nama_video', 'deskripsi', 'uploader', 'created_at', 'durasi', 'video_url')
                ->get()
                ->map(function ($video) {
                    // Extract YouTube video ID from URL
                    $videoId = null;
                    if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $video->video_url, $matches)) {
                        $videoId = $matches[1];
                    }
                    
                    return [
                        'id' => $video->id,
                        'type' => 'video',
                        'title' => $video->nama_video,
                        'author' => $video->uploader,
                        'date' => $video->created_at->locale('id')->isoFormat('D MMMM YYYY'),
                        'img' => $videoId ? "https://img.youtube.com/vi/{$videoId}/maxresdefault.jpg" : 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=400&q=80',
                        'desc' => $video->deskripsi ?: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                        'slug' => '#',
                        'durasi' => $video->durasi ?? null,
                    ];
                });
            
            $featuredContent = $featuredContent->concat($additionalBlogs)->concat($additionalVideos);
        }

        // Acak urutan dan ambil 4 teratas
        $featuredContent = $featuredContent->shuffle()->take(4);

        // Ambil sertifikasi populer (maksimal 4)
        $popularSertifikasi = Sertifikasi::with(['batch' => function($query) {
                $query->where('status', 'Aktif')->latest();
            }])
            ->where('status', 'Aktif')
            ->withCount(['pendaftaran as peserta_count'])
            ->orderByDesc('peserta_count')
            ->limit(4)
            ->get()
            ->map(function ($sertifikasi) {
                $activeBatch = $sertifikasi->batch->first();
                $thumbnail = $sertifikasi->thumbnail ? asset('storage/' . $sertifikasi->thumbnail) : 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80';
                
                return [
                    'id' => $sertifikasi->id,
                    'title' => $sertifikasi->nama_sertifikasi,
                    'batch' => $activeBatch ? $activeBatch->nama_batch : 'Batch akan segera dibuka',
                    'date' => $activeBatch ? $activeBatch->tanggal_mulai->locale('id')->isoFormat('D MMMM YYYY') : 'TBA',
                    'rating' => '4.8',
                    'peserta' => $sertifikasi->peserta_count,
                    'kategori' => ucfirst($sertifikasi->jenis_sertifikasi),
                    'img' => $thumbnail,
                    'mentor' => $activeBatch ? $activeBatch->instruktur : 'Instruktur Profesional',
                    'slug' => $sertifikasi->slug,
                ];
            });

        return Inertia::render('client/LandingPage', [
            'featuredBlogs' => $featuredContent,
            'popularSertifikasi' => $popularSertifikasi,
        ]);
    }

    public function previewSertifikasi($slug)
    {
        // Ambil detail sertifikasi berdasarkan slug
        $sertifikasi = Sertifikasi::findBySlug($slug);
        
        if (!$sertifikasi || $sertifikasi->status !== 'Aktif') {
            abort(404);
        }

        // Load relasi yang diperlukan
        $sertifikasi->load([
            'batch' => function($query) {
                $query->where('status', 'Aktif')->latest();
            },
            'modul' => function($query) {
                $query->orderBy('urutan', 'asc');
            },
            'asesor'
        ]);

        $activeBatch = $sertifikasi->batch->first();

        // Format data sertifikasi untuk frontend
        $sertifikasiData = [
            'id' => $sertifikasi->id,
            'nama_sertifikasi' => $sertifikasi->nama_sertifikasi,
            'jenis_sertifikasi' => $sertifikasi->jenis_sertifikasi,
            'deskripsi' => $sertifikasi->deskripsi,
            'thumbnail' => $sertifikasi->thumbnail_url,
            'tipe_sertifikat' => $sertifikasi->tipe_sertifikat,
            'status' => $sertifikasi->status,
            'batch' => $activeBatch ? [
                'id' => $activeBatch->id,
                'nama_batch' => $activeBatch->nama_batch,
                'tanggal_mulai' => $activeBatch->tanggal_mulai,
                'tanggal_selesai' => $activeBatch->tanggal_selesai,
                'jumlah_pendaftar' => $activeBatch->jumlah_pendaftar,
                'status' => $activeBatch->status,
                'instruktur' => $activeBatch->instruktur,
                'catatan' => $activeBatch->catatan,
            ] : null,
            'moduls' => $sertifikasi->modul->map(function($modul) {
                return [
                    'id' => $modul->id,
                    'judul' => $modul->judul,
                    'deskripsi' => $modul->deskripsi,
                    'poin_pembelajaran' => $modul->poin_pembelajaran,
                    'urutan' => $modul->urutan,
                ];
            }),
            'asesor' => $sertifikasi->asesor ? [
                'nama' => $sertifikasi->asesor->nama_asesor,
                'keahlian' => $sertifikasi->asesor->jabatan_asesor,
                'pengalaman' => $sertifikasi->asesor->instansi_asesor,
                'kontak' => $sertifikasi->asesor->nama_asesor, // Bisa diganti dengan email jika ada
                'foto' => $sertifikasi->asesor->foto_asesor_url,
            ] : null,
        ];

        // Ambil sertifikasi rekomendasi (selain yang sedang dilihat)
        $rekomendasiSertifikasi = Sertifikasi::where('status', 'Aktif')
            ->where('id', '!=', $sertifikasi->id)
            ->with(['batch' => function($query) {
                $query->where('status', 'Aktif')->latest();
            }])
            ->withCount(['pendaftaran as peserta_count'])
            ->limit(4)
            ->get()
            ->map(function ($sertifikasi) {
                $activeBatch = $sertifikasi->batch->first();
                return [
                    'id' => $sertifikasi->id,
                    'title' => $sertifikasi->nama_sertifikasi,
                    'batch' => $activeBatch ? $activeBatch->nama_batch : 'Batch akan segera dibuka',
                    'date' => $activeBatch ? $activeBatch->tanggal_mulai->locale('id')->isoFormat('D MMMM YYYY') : 'TBA',
                    'rating' => '4.8',
                    'peserta' => $sertifikasi->peserta_count,
                    'kategori' => ucfirst($sertifikasi->jenis_sertifikasi),
                    'img' => $sertifikasi->thumbnail_url ?: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
                    'mentor' => $activeBatch ? $activeBatch->instruktur : 'Instruktur Profesional',
                    'slug' => $sertifikasi->slug,
                ];
            });

        return Inertia::render('client/PreviewSertifikasi', [
            'sertifikasi' => $sertifikasiData,
            'rekomendasiSertifikasi' => $rekomendasiSertifikasi,
        ]);
    }

    public function pklPage()
    {
        // Ambil semua posisi PKL yang aktif
        $posisiPKL = PosisiPKL::active()
            ->with('creator')
            ->withCount(['pendaftaran as jumlah_pendaftar'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($posisi) {
                return [
                    'id' => $posisi->id,
                    'nama_posisi' => $posisi->nama_posisi,
                    'kategori' => $posisi->kategori,
                    'deskripsi' => $posisi->deskripsi,
                    'persyaratan' => $posisi->persyaratan ?? [],
                    'benefits' => $posisi->benefits ?? [],
                    'tipe' => $posisi->tipe,
                    'durasi_bulan' => $posisi->durasi_bulan,
                    'jumlah_pendaftar' => $posisi->jumlah_pendaftar,
                    'status' => $posisi->status,
                ];
            });

        return Inertia::render('client/PKLPage', [
            'posisiPKL' => $posisiPKL,
        ]);
    }
}
