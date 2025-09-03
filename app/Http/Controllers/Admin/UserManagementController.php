<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PendaftaranSertifikasi;
use App\Models\PendaftaranPKL;
use App\Models\PenilaianPKL;
use App\Models\UserActivity;
use App\Models\UserDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search', '');
        $userType = $request->get('user_type', '');
        $accountStatus = $request->get('account_status', '');
    // Fetch all users for client-side pagination

        $users = User::query()
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('full_name', 'like', "%{$search}%")
                      ->orWhere('phone_number', 'like', "%{$search}%")
                      ->orWhere('school_university', 'like', "%{$search}%");
                });
            })
            ->when($userType, function ($query, $userType) {
                return $query->where('user_type', $userType);
            })
            ->when($accountStatus, function ($query, $accountStatus) {
                return $query->where('account_status', $accountStatus);
            })
            ->with(['activities' => function($query) {
                $query->latest()->limit(3);
            }])
            ->orderBy('created_at', 'desc')
                ->get();

        // Add counts separately to avoid errors if relations don't exist
        foreach ($users as $user) {
            try {
                $user->pendaftaran_sertifikasi_count = $user->pendaftaranSertifikasi()->count();
                $user->pendaftaran_p_k_l_count = $user->pendaftaranPKL()->count();
                $user->activities_count = $user->activities()->count();
            } catch (\Exception $e) {
                $user->pendaftaran_sertifikasi_count = 0;
                $user->pendaftaran_p_k_l_count = 0;
                $user->activities_count = 0;
            }
        }

        // Statistics
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'students' => User::where('role', 'student')->count(),
            'admins' => User::where('role', 'admin')->count(),
            'pending_users' => User::where('account_status', 'pending')->count(),
        ];

        return Inertia::render('admin/user-management', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'user_type' => $userType,
                'account_status' => $accountStatus,
            ],
            'stats' => $stats,
        ]);
    }

    public function show($id)
    {
        $user = User::with([
            'pendaftaranSertifikasi.sertifikasi',
            'pendaftaranPKL.posisiPKL',
            'activities' => function($query) {
                $query->latest()->limit(20);
            },
            'documents'
        ])->findOrFail($id);

        // Debug: Log user data untuk melihat field apa yang benar-benar ada
        \Log::info('User detail data for debugging:', [
            'user_id' => $id,
            'name' => $user->name,
            'email' => $user->email,
            'full_name' => $user->full_name,
            'phone' => $user->phone,
            'gender' => $user->gender,
            'place_of_birth' => $user->place_of_birth,
            'date_of_birth' => $user->date_of_birth,
            'birth_place' => $user->birth_place ?? 'NOT_SET',
            'birth_date' => $user->birth_date ?? 'NOT_SET',
            'address' => $user->address,
            'all_attributes' => array_keys($user->getAttributes())
        ]);

        // Get detailed statistics
        $userStats = [
            'sertifikasi_count' => $user->pendaftaranSertifikasi->count(),
            'pkl_count' => $user->pendaftaranPKL->count(),
            'documents_count' => $user->documents->count(),
            'activities_count' => $user->activities->count(),
            'profile_completion' => $user->calculateProfileCompletion(),
        ];

        return Inertia::render('admin/user-detail', [
            'user' => $user,
            'userStats' => $userStats,
        ]);
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('admin/user-edit', [
            'user' => $user,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:admin,user',
            'user_type' => 'required|in:student,instructor,assessor,admin',
        ]);

                $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'user_type' => $request->user_type,
            'full_name' => $request->name, // Use name as full_name for admin
            'is_active' => true,
            'account_status' => 'active',
        ]);

        // Log activity
        $user->logActivity('user_created', 'User account created by admin', [
            'created_by' => auth()->id(),
            'user_type' => $request->user_type,
        ], request()->ip(), request()->userAgent());

        return redirect()->back()->with('message', 'User berhasil dibuat.');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'required|in:admin,user',
            'user_type' => 'required|in:student,instructor,assessor,admin',
            'account_status' => 'required|in:active,suspended,pending,banned',
            'is_active' => 'boolean',
            'full_name' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'gender' => 'nullable|in:L,P',
            'place_of_birth' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
            'school_university' => 'nullable|string|max:255',
            'major_concentration' => 'nullable|string|max:255',
            'class_semester' => 'nullable|string|max:255',
            'instagram_handle' => 'nullable|string|max:255',
            'tiktok_handle' => 'nullable|string|max:255',
            'transportation' => 'nullable|in:punya,tidak,transportasi_umum',
            'preferred_field' => 'nullable|in:teknologi,marketing,desain,bisnis,pendidikan,kesehatan,media,keuangan,lainnya',
            'preferred_field_type' => 'nullable|in:kreatif,analitis,teknis,komunikasi,manajemen,riset,sales,operasional,lainnya',
            'motivation_level' => 'nullable|integer|min:1|max:10',
            'self_rating' => 'nullable|in:A,B,C,D',
            'has_laptop' => 'nullable|boolean',
            'has_dslr' => 'nullable|boolean',
            'has_video_review_experience' => 'nullable|boolean',
            'interested_in_content_creation' => 'nullable|boolean',
            'has_viewed_company_profile' => 'nullable|boolean',
            'is_smoker' => 'nullable|boolean',
            'agrees_to_school_return_if_violation' => 'nullable|boolean',
            'agrees_to_return_if_absent_twice' => 'nullable|boolean',
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['confirmed', Rules\Password::defaults()];
        }

        $validated = $request->validate($rules);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        // Log activity
        $user->logActivity('user_updated', 'User data updated by admin', [
            'updated_by' => auth()->id(),
            'updated_fields' => array_keys($validated),
        ], request()->ip(), request()->userAgent());

        return redirect()->back()->with('message', 'Data user berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->id === auth()->id()) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak dapat menghapus akun sendiri.']);
        }

        // Log activity before deletion
        UserActivity::create([
            'user_id' => $user->id,
            'activity_type' => 'user_deleted',
            'description' => 'User account deleted by admin',
            'metadata' => [
                'deleted_by' => auth()->id(),
                'user_data' => $user->only(['name', 'email', 'user_type']),
            ],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        $user->delete();

        return redirect()->back()->with('message', 'User berhasil dihapus.');
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        $newStatus = $user->is_active ? false : true;
        
        $user->update(['is_active' => $newStatus]);

        // Log activity
        $user->logActivity(
            $newStatus ? 'user_activated' : 'user_deactivated',
            $newStatus ? 'User account activated by admin' : 'User account deactivated by admin',
            ['changed_by' => auth()->id()],
            request()->ip(),
            request()->userAgent()
        );

        return redirect()->back()->with('message', 'Status user berhasil diperbarui.');
    }

    public function getUserSertifikasi($id)
    {
        $user = User::findOrFail($id);
        
        $sertifikasi = $user->pendaftaranSertifikasi()
            ->with(['sertifikasi', 'penilaian'])
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        return response()->json($sertifikasi);
    }

    public function getUserPKL($id)
    {
        $user = User::findOrFail($id);
        
        $pkl = $user->pendaftaranPKL()
            ->with(['posisiPKL', 'penilaian'])
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        return response()->json($pkl);
    }

    public function getUserActivities($id)
    {
        $user = User::findOrFail($id);
        
        $activities = $user->activities()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($activities);
    }
}
