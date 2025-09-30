<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PendaftaranSertifikasi;
use App\Models\PendaftaranPKL;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::guard('client')->user();
        
        // Get dashboard statistics
        $stats = [
            'sertifikasi_selesai' => PendaftaranSertifikasi::where('user_id', $user->id)
                ->where('status', 'selesai')
                ->count(),
            'program_aktif' => PendaftaranSertifikasi::where('user_id', $user->id)
                ->whereIn('status', ['diterima', 'sedang_berlangsung'])
                ->count() + 
                PendaftaranPKL::where('user_id', $user->id)
                ->whereIn('status', ['diterima', 'sedang_berlangsung'])
                ->count(),
            'pengajuan_diproses' => PendaftaranSertifikasi::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'sedang_diverifikasi'])
                ->count() + 
                PendaftaranPKL::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'sedang_diverifikasi'])
                ->count(),
            'total_program' => PendaftaranSertifikasi::where('user_id', $user->id)->count() + 
                PendaftaranPKL::where('user_id', $user->id)->count()
        ];

        // Get recent program registrations
        $program_saya = collect();
        
        // Get sertifikasi programs
        $sertifikasi = PendaftaranSertifikasi::where('user_id', $user->id)
            ->with('sertifikasi')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->sertifikasi->nama_sertifikasi ?? 'Sertifikasi Tidak Ditemukan',
                    'jenis' => 'Sertifikasi Kompetensi',
                    'tanggal_mulai' => $item->created_at->format('d-m-Y'),
                    'tanggal_selesai' => $item->updated_at->format('d-m-Y'),
                    'status' => $this->getStatusDisplay($item->status),
                    'deskripsi' => $item->sertifikasi->deskripsi ?? null
                ];
            });

        // Get PKL programs
        $pkl = PendaftaranPKL::where('user_id', $user->id)
            ->with('posisiPKL')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->posisiPKL->nama_posisi ?? 'PKL Tidak Ditemukan',
                    'jenis' => 'Praktik Kerja Lapangan',
                    'tanggal_mulai' => $item->created_at->format('d-m-Y'),
                    'tanggal_selesai' => $item->updated_at->format('d-m-Y'),
                    'status' => $this->getStatusDisplay($item->status),
                    'deskripsi' => $item->posisiPKL->deskripsi ?? null
                ];
            });

        $program_saya = $sertifikasi->concat($pkl)->sortByDesc('tanggal_mulai')->take(5)->values();

        // Get recent application history
        $riwayat_pengajuan = collect();
        
        $sertifikasi_riwayat = PendaftaranSertifikasi::where('user_id', $user->id)
            ->with('sertifikasi')
            ->latest()
            ->limit(3)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'tanggal' => $item->created_at->format('d-m-Y'),
                    'jenis_pengajuan' => 'Sertifikasi Kompetensi',
                    'nama' => $item->sertifikasi->nama_sertifikasi ?? 'Sertifikasi Tidak Ditemukan',
                    'status' => $this->getStatusDisplay($item->status)
                ];
            });

        $pkl_riwayat = PendaftaranPKL::where('user_id', $user->id)
            ->with('posisiPKL')
            ->latest()
            ->limit(3)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'tanggal' => $item->created_at->format('d-m-Y'),
                    'jenis_pengajuan' => 'Praktik Kerja Lapangan',
                    'nama' => $item->posisiPKL->nama_posisi ?? 'PKL Tidak Ditemukan',
                    'status' => $this->getStatusDisplay($item->status)
                ];
            });

        $riwayat_pengajuan = $sertifikasi_riwayat->concat($pkl_riwayat)->sortByDesc('tanggal')->take(3)->values();

        return Inertia::render('client/dashboard', [
            'user' => [
                'id' => $user->id,
                'nama' => $user->nama,
                'nama_lengkap' => $user->nama_lengkap,
                'email' => $user->email,
                'institusi' => $user->institusi,
                'jurusan' => $user->jurusan,
                'semester' => $user->semester,
                'foto_profil' => $user->foto_profil,
                'profile_completion_percentage' => $user->profile_completion_percentage ?? $this->calculateProfileCompletion($user),
                'status_akun' => $user->status_akun,
                'role' => $user->role
            ],
            'stats' => $stats,
            'riwayat_pengajuan' => $riwayat_pengajuan,
            'program_saya' => $program_saya
        ]);
    }

    private function getStatusDisplay($status)
    {
        $statusMap = [
            'pending' => 'Sedang Diverifikasi',
            'sedang_diverifikasi' => 'Sedang Diverifikasi',
            'diterima' => 'Disetujui',
            'ditolak' => 'Ditolak',
            'sedang_berlangsung' => 'Aktif',
            'selesai' => 'Selesai'
        ];

        return $statusMap[$status] ?? ucfirst($status);
    }

    private function calculateProfileCompletion($user)
    {
        $requiredFields = [
            'nama_lengkap', 'email', 'telepon', 'alamat',
            'tanggal_lahir', 'tempat_lahir', 'jenis_kelamin', 'institusi',
            'jurusan', 'semester'
        ];
        
        $filledFields = 0;
        foreach ($requiredFields as $field) {
            if (!empty($user->getAttribute($field))) {
                $filledFields++;
            }
        }
        
        return round(($filledFields / count($requiredFields)) * 100);
    }
}
