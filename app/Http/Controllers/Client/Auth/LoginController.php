<?php

namespace App\Http\Controllers\Client\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Display the login view.
     */
    public function create()
    {
        return Inertia::render('client/auth/Login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::guard('client')->attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $user = Auth::guard('client')->user();
            
            // Check if user is a client/mahasiswa
            if ($user->role !== 'mahasiswa') {
                Auth::guard('client')->logout();
                return back()->withErrors([
                    'email' => 'Akun ini tidak memiliki akses ke halaman client.',
                ]);
            }

            $request->session()->regenerate();

            return redirect()->intended(route('client.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Email atau password tidak valid.',
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('client')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
