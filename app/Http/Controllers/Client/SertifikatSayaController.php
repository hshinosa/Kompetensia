<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\SertifikatKelulusan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SertifikatSayaController extends Controller
{
    /**
     * Display user's certificates page.
     */
    public function index(): Response
    {
        $user = Auth::guard('client')->user();
        
        \Log::info('Fetching certificates for CLIENT user', [
            'user_id' => $user->id, 
            'user_name' => $user->nama,
            'user_role' => $user->role,
            'guard' => 'client'
        ]);
        
        // Fetch all certificates for the authenticated user
        $certificates = SertifikatKelulusan::where('user_id', $user->id)
            ->with(['penerbit:id,nama,email'])
            ->orderBy('tanggal_selesai', 'desc')
            ->get()
            ->map(function ($cert) {
            return [
                'id' => $cert->id,
                'nama_program' => $cert->nama_program,
                'jenis_program' => ucfirst($cert->jenis_program), // 'sertifikasi' -> 'Sertifikasi', 'pkl' -> 'Pkl'
                'tanggal_selesai' => $cert->tanggal_selesai->format('Y-m-d'),
                'badge_color' => $cert->jenis_program === 'sertifikasi' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-orange-100 text-orange-800',
                'link_sertifikat' => $cert->link_sertifikat,
                'catatan_admin' => $cert->catatan_admin,
                'penerbit' => [
                    'name' => $cert->penerbit->nama ?? 'Admin',
                ],
            ];
        });

        \Log::info('Certificates fetched for client', [
            'count' => $certificates->count(),
            'certificates' => $certificates->toArray()
        ]);

        return Inertia::render('client/sertifikat-saya/index', [
            'certificates' => $certificates,
        ]);
    }
}
