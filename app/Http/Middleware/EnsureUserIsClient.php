<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureUserIsClient
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Set client-specific session cookie name
        config(['session.cookie' => 'kompetensia_client_session']);
        
        // Set the default guard to client for this request
        Auth::shouldUse('client');
        
        // Check if user is authenticated with client guard
        if (!Auth::guard('client')->check()) {
            return redirect()->route('client.login');
        }

        $user = Auth::guard('client')->user();
        
        if (!$user || $user->role !== 'mahasiswa') {
            Auth::guard('client')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            return redirect()->route('client.login')->withErrors([
                'email' => 'Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini.'
            ]);
        }
        
        // Store guard info in session
        $request->session()->put('auth.guard', 'client');

        return $next($request);
    }
}
