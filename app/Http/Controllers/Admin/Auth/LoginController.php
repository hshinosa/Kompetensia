<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Display the admin login view.
     */
    public function create()
    {
        return Inertia::render('admin/auth/Login');
    }

    /**
     * Handle an incoming admin authentication request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // First, try to find the user and check role before attempting login
        $user = \App\Models\User::where('email', $request->email)->first();
        
        if (!$user || $user->role !== 'admin') {
            return back()->withErrors([
                'email' => 'Akun ini tidak memiliki akses ke halaman admin.',
            ]);
        }

        // Now attempt login with admin guard
        if (Auth::guard('admin')->attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            // Regenerate session to prevent fixation attacks
            $request->session()->regenerate();
            
            // Explicitly set the guard in session
            $request->session()->put('auth.guard', 'admin');
            
            // Set admin-specific session cookie
            config(['session.cookie' => 'kompetensia_admin_session']);

            return redirect()->intended(route('admin.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Email atau password tidak valid.',
        ]);
    }

    /**
     * Destroy an authenticated admin session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('admin')->logout();

        // Regenerate token first before invalidating session
        $request->session()->regenerateToken();
        $request->session()->invalidate();

        // Return success response - frontend will handle redirect
        return response()->json(['redirect' => route('admin.login')]);
    }
}
