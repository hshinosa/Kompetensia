<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    /**
     * Get current user profile data
     */
    public function getProfile()
    {
        $user = Auth::guard('client')->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan. Silakan login kembali.'
            ], 401);
        }
        
        // Generate foto profil URL
        $fotoProfil = null;
        if ($user->foto_profil) {
            $filename = basename($user->foto_profil);
            $fotoProfil = url('/api/settings/foto-profil/' . $filename);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'nama' => $user->nama ?? '',
                'nama_lengkap' => $user->nama_lengkap ?? '',
                'email' => $user->email ?? '',
                'nomor_telepon' => $user->telepon ?? '',
                'tempat_lahir' => $user->tempat_lahir ?? '',
                'tanggal_lahir' => $user->tanggal_lahir ? $user->tanggal_lahir->format('Y-m-d') : '',
                'jenis_kelamin' => $user->gender ?? '',
                'alamat' => $user->alamat ?? '',
                'foto_profil' => $fotoProfil,
            ]
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::guard('client')->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan. Silakan login kembali.'
            ], 401);
        }
        
        $validated = $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'nomor_telepon' => ['required', 'string', 'max:15'],
            'tempat_lahir' => ['nullable', 'string', 'max:255'],
            'tanggal_lahir' => ['required', 'date', 'before:today'],
            'jenis_kelamin' => ['required', 'in:Laki-laki,Perempuan'],
            'alamat' => ['nullable', 'string', 'max:500'],
        ]);

        try {
            DB::beginTransaction();

            $user->update([
                'nama_lengkap' => $validated['nama_lengkap'],
                'telepon' => $validated['nomor_telepon'],
                'tempat_lahir' => $validated['tempat_lahir'] ?? null,
                'tanggal_lahir' => $validated['tanggal_lahir'],
                'gender' => $validated['jenis_kelamin'],
                'alamat' => $validated['alamat'] ?? null,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Profil berhasil diperbarui',
                'data' => [
                    'nama_lengkap' => $user->nama_lengkap,
                    'email' => $user->email,
                    'nomor_telepon' => $user->telepon,
                    'tempat_lahir' => $user->tempat_lahir,
                    'tanggal_lahir' => $user->tanggal_lahir ? $user->tanggal_lahir->format('Y-m-d') : '',
                    'jenis_kelamin' => $user->gender,
                    'alamat' => $user->alamat,
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Error updating profile: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui profil: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change user email
     */
    public function changeEmail(Request $request)
    {
        $user = Auth::guard('client')->user();
        
        $validated = $request->validate([
            'new_email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'current_password' => ['required', 'string'],
        ]);

        // Verify current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Kata sandi saat ini tidak benar'
            ], 422);
        }

        try {
            DB::beginTransaction();

            $user->update([
                'email' => $validated['new_email'],
                'email_verified_at' => null, // Reset verification
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Email berhasil diubah. Silakan verifikasi email baru Anda.',
                'data' => [
                    'email' => $user->email
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change user password
     */
    public function changePassword(Request $request)
    {
        $user = Auth::guard('client')->user();
        
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        // Verify current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Kata sandi saat ini tidak benar'
            ], 422);
        }

        // Check if new password is same as current
        if (Hash::check($validated['new_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Kata sandi baru tidak boleh sama dengan kata sandi saat ini'
            ], 422);
        }

        try {
            DB::beginTransaction();

            $user->update([
                'password' => Hash::make($validated['new_password']),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Kata sandi berhasil diubah'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah kata sandi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload foto profil
     */
    public function uploadFotoProfil(Request $request)
    {
        $user = Auth::guard('client')->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan. Silakan login kembali.'
            ], 401);
        }

        $validated = $request->validate([
            'foto_profil' => ['required', 'image', 'mimes:jpeg,jpg,png', 'max:2048'], // max 2MB
        ]);

        try {
            DB::beginTransaction();

            // Delete old photo if exists
            if ($user->foto_profil && Storage::disk('public')->exists($user->foto_profil)) {
                Storage::disk('public')->delete($user->foto_profil);
            }

            // Store new photo
            $path = $request->file('foto_profil')->store('profile-photos', 'public');

            $user->update([
                'foto_profil' => $path,
            ]);

            DB::commit();

            // Generate foto profil URL
            $filename = basename($path);
            $fotoProfil = url('/api/settings/foto-profil/' . $filename);

            return response()->json([
                'success' => true,
                'message' => 'Foto profil berhasil diupload',
                'data' => [
                    'foto_profil' => $fotoProfil
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Error uploading profile photo: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupload foto profil: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete foto profil
     */
    public function deleteFotoProfil()
    {
        $user = Auth::guard('client')->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan. Silakan login kembali.'
            ], 401);
        }

        try {
            DB::beginTransaction();

            // Delete photo from storage
            if ($user->foto_profil && Storage::disk('public')->exists($user->foto_profil)) {
                Storage::disk('public')->delete($user->foto_profil);
            }

            $user->update([
                'foto_profil' => null,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Foto profil berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus foto profil: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Serve foto profil (untuk menghindari 403 Forbidden)
     */
    public function serveFotoProfil($filename)
    {
        $path = 'profile-photos/' . $filename;
        
        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'Foto tidak ditemukan');
        }

        $file = Storage::disk('public')->get($path);
        $mimeType = Storage::disk('public')->mimeType($path);

        return response($file, 200)->header('Content-Type', $mimeType);
    }
}
