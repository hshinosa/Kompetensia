<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PenggunaController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->select('id', 'nama', 'nama_lengkap', 'email', 'telepon', 'role', 'status_akun', 'aktif', 'created_at')
            ->with(['aktivitas' => function($query) {
                $query->latest()->limit(3);
            }]);

        // Filter berdasarkan role
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Filter berdasarkan status
        if ($request->filled('status')) {
            $query->where('status_akun', $request->status);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $pengguna = $query->paginate(15);

        return Inertia::render('admin/user-management', [
            'pengguna' => $pengguna,
            'filters' => $request->only(['role', 'status', 'search']),
            'stats' => [
                'total' => User::count(),
                'admin' => User::where('role', 'admin')->count(),
                'mahasiswa' => User::where('role', 'mahasiswa')->count(),
                'aktif' => User::where('aktif', true)->count(),
                'nonaktif' => User::where('aktif', false)->count(),
            ]
        ]);
    }

    public function show(User $pengguna)
    {
        $pengguna->load([
            'aktivitas' => function($query) {
                $query->latest()->limit(10);
            },
            // 'dokumen' => function($query) {
            //     $query->latest();
            // },
            'pendaftaranPKL.posisiPKL',
            'pendaftaranSertifikasi.sertifikasi'
        ]);

        return Inertia::render('admin/user-detail', [
            'pengguna' => $pengguna, // Changed from 'user' to 'pengguna' to match frontend
            'userStats' => [
                'sertifikasi_count' => $pengguna->pendaftaranSertifikasi->count(),
                'pkl_count' => $pengguna->pendaftaranPKL->count(),
                // 'documents_count' => $pengguna->dokumen->count(),
                'documents_count' => 0, // Temporary placeholder
                'activities_count' => $pengguna->aktivitas->count(),
                'profile_completion' => 75 // You can calculate this based on filled fields
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Pengguna/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'nama_lengkap' => 'nullable|string|max:255',
            'telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'tempat_lahir' => 'nullable|string|max:255',
            'institusi' => 'nullable|string|max:255',
            'jurusan' => 'nullable|string|max:255',
            'semester' => 'nullable|integer|min:1|max:14',
            'role' => 'required|in:mahasiswa,instruktur,asesor,admin',
            'status_akun' => 'required|in:aktif,ditangguhkan,pending,diblokir',
        ]);

        $pengguna = User::create([
            'nama' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'nama_lengkap' => $request->nama_lengkap,
            'telepon' => $request->telepon,
            'alamat' => $request->alamat,
            'tanggal_lahir' => $request->tanggal_lahir,
            'tempat_lahir' => $request->tempat_lahir,
            'institusi' => $request->institusi,
            'jurusan' => $request->jurusan,
            'semester' => $request->semester,
            'role' => $request->role,
            'tipe_pengguna' => $request->role,
            'status_akun' => $request->status_akun,
            'aktif' => true,
            'email_diverifikasi_pada' => now(),
        ]);

        // Log activity
        UserActivity::catat(
            auth()->id(),
            'pengguna_dibuat',
            "Membuat pengguna baru: {$pengguna->nama} ({$pengguna->email})",
            ['user_id' => $pengguna->id],
            $request->ip(),
            $request->userAgent()
        );

        return redirect()
            ->route('admin.pengguna.index')
            ->with('success', 'Pengguna berhasil dibuat.');
    }

    public function edit(User $pengguna)
    {
        // Load all user data with proper relationships if needed
        $pengguna->load([]);
        
        return Inertia::render('admin/user-edit', [
            'pengguna' => $pengguna->toArray()
        ]);
    }

    public function update(Request $request, User $pengguna)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $pengguna->id,
            'nama_lengkap' => 'nullable|string|max:255',
            'telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'tempat_lahir' => 'nullable|string|max:255',
            'gender' => 'nullable|in:Laki-laki,Perempuan',
            'role' => 'required|in:mahasiswa,admin',
            'aktif' => 'required|boolean',
        ]);

        $oldData = $pengguna->toArray();

        $pengguna->update([
            'nama' => $request->nama,
            'email' => $request->email,
            'nama_lengkap' => $request->nama_lengkap,
            'telepon' => $request->telepon,
            'alamat' => $request->alamat,
            'tanggal_lahir' => $request->tanggal_lahir,
            'tempat_lahir' => $request->tempat_lahir,
            'gender' => $request->gender,
            'role' => $request->role,
            'aktif' => $request->aktif,
        ]);

        // Update password jika diisi
        if ($request->filled('password')) {
            $request->validate(['password' => 'string|min:8']);
            $pengguna->update(['password' => Hash::make($request->password)]);
        }

        // Log activity
        UserActivity::catat(
            auth()->id(),
            'pengguna_diupdate',
            "Mengupdate data pengguna: {$pengguna->nama} ({$pengguna->email})",
            [
                'user_id' => $pengguna->id,
                'old_data' => $oldData,
                'new_data' => $pengguna->fresh()->toArray()
            ],
            $request->ip(),
            $request->userAgent()
        );

        return redirect()
            ->route('admin.pengguna.show', $pengguna)
            ->with('success', 'Data pengguna berhasil diperbarui.');
    }

    public function destroy(User $pengguna)
    {
        // Cegah penghapusan admin terakhir
        if ($pengguna->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            return back()->with('error', 'Tidak dapat menghapus admin terakhir.');
        }

        // Cegah penghapusan diri sendiri
        if ($pengguna->id === auth()->id()) {
            return back()->with('error', 'Tidak dapat menghapus akun sendiri.');
        }

        $userData = $pengguna->toArray();

        // Hapus dokumen terkait
        // $pengguna->dokumen()->each(function($dokumen) {
        //     $dokumen->delete(); // Akan menghapus file fisik juga
        // });

        $pengguna->delete();

        // Log activity
        UserActivity::catat(
            auth()->id(),
            'pengguna_dihapus',
            "Menghapus pengguna: {$userData['nama']} ({$userData['email']})",
            ['deleted_user' => $userData],
            request()->ip(),
            request()->userAgent()
        );

        return redirect()
            ->route('admin.pengguna.index')
            ->with('success', 'Pengguna berhasil dihapus.');
    }

    public function updateStatus(Request $request, User $pengguna)
    {
        $request->validate([
            'status_akun' => 'required|in:aktif,ditangguhkan,pending,diblokir',
            'aktif' => 'boolean',
            'catatan' => 'nullable|string'
        ]);

        $oldStatus = $pengguna->status_akun;
        $oldAktif = $pengguna->aktif;

        $pengguna->update([
            'status_akun' => $request->status_akun,
            'aktif' => $request->boolean('aktif', true)
        ]);

        // Log activity
        UserActivity::catat(
            auth()->id(),
            'status_pengguna_diubah',
            "Mengubah status pengguna {$pengguna->nama}: {$oldStatus} -> {$request->status_akun}",
            [
                'user_id' => $pengguna->id,
                'old_status' => $oldStatus,
                'new_status' => $request->status_akun,
                'old_aktif' => $oldAktif,
                'new_aktif' => $request->boolean('aktif', true),
                'catatan' => $request->catatan
            ],
            $request->ip(),
            $request->userAgent()
        );

        return back()->with('success', 'Status pengguna berhasil diperbarui.');
    }

    public function aktivitas(User $pengguna)
    {
        $aktivitas = $pengguna->aktivitas()
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Pengguna/Aktivitas', [
            'pengguna' => $pengguna,
            'aktivitas' => $aktivitas
        ]);
    }

    public function dokumen(User $pengguna)
    {
        $dokumen = $pengguna->dokumen()
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Pengguna/Dokumen', [
            'pengguna' => $pengguna,
            'dokumen' => $dokumen
        ]);
    }

    // Method untuk compatibility dengan UserManagementController
    public function toggleStatus(User $pengguna)
    {
        $newStatus = !$pengguna->aktif;
        
        $pengguna->update([
            'aktif' => $newStatus,
            'status_akun' => $newStatus ? 'aktif' : 'ditangguhkan'
        ]);

        // Log activity
        UserActivity::catat(
            auth()->id(),
            $newStatus ? 'pengguna_diaktifkan' : 'pengguna_dinonaktifkan',
            "Mengubah status aktif pengguna {$pengguna->nama} menjadi " . ($newStatus ? 'aktif' : 'nonaktif'),
            ['user_id' => $pengguna->id, 'new_status' => $newStatus],
            request()->ip(),
            request()->userAgent()
        );

        return back()->with('success', 'Status pengguna berhasil diperbarui.');
    }

    public function getUserSertifikasi(User $pengguna)
    {
        $sertifikasi = $pengguna->pendaftaranSertifikasi()
            ->with(['sertifikasi', 'penilaian'])
            ->latest()
            ->paginate(5);

        return response()->json($sertifikasi);
    }

    public function getUserPKL(User $pengguna)
    {
        $pkl = $pengguna->pendaftaranPKL()
            ->with(['posisiPKL', 'penilaian'])
            ->latest()
            ->paginate(5);

        return response()->json($pkl);
    }

    public function getUserActivities(User $pengguna)
    {
        $aktivitas = $pengguna->aktivitas()
            ->latest()
            ->paginate(20);

        return response()->json($aktivitas);
    }
}
