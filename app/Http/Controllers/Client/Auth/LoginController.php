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

        // First, try to find the user and check role before attempting login
        $user = \App\Models\User::where('email', $request->email)->first();
        
        if (!$user || $user->role !== 'mahasiswa') {
            return back()->withErrors([
                'email' => 'Akun ini tidak memiliki akses ke halaman client.',
            ]);
        }

        // Set client-specific session cookie BEFORE login attempt
        config(['session.cookie' => 'kompetensia_client_session']);

        if (Auth::guard('client')->attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            // Regenerate session to prevent fixation attacks
            $request->session()->regenerate();
            
            // Explicitly set the guard in session
            $request->session()->put('auth.guard', 'client');
            
            // Ensure session cookie is properly set after regeneration
            config(['session.cookie' => 'kompetensia_client_session']);

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
        // Set client-specific session cookie before logout
        config(['session.cookie' => 'kompetensia_client_session']);
        
        Auth::guard('client')->logout();

        // Invalidate session first, then regenerate token
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redirect to login page
        return redirect()->route('client.login');
    }
}
