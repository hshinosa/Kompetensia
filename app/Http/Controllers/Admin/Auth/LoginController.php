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

        if (Auth::guard('admin')->attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $user = Auth::guard('admin')->user();
            
            // Check if user is an admin
            if ($user->role !== 'admin') {
                Auth::guard('admin')->logout();
                return back()->withErrors([
                    'email' => 'Akun ini tidak memiliki akses ke halaman admin.',
                ]);
            }

            $request->session()->regenerate();

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

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/admin/login');
    }
}
