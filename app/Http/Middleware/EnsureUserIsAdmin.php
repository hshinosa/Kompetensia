<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Set admin-specific session cookie name
        config(['session.cookie' => 'kompetensia_admin_session']);
        
        // Set the default guard to admin for this request
        Auth::shouldUse('admin');
        
        // Check if user is authenticated with admin guard
        if (!Auth::guard('admin')->check()) {
            return redirect()->route('admin.login')->withErrors([
                'message' => 'Silakan login terlebih dahulu untuk mengakses halaman admin.'
            ]);
        }

        $user = Auth::guard('admin')->user();
        
        if (!$user || $user->role !== 'admin') {
            Auth::guard('admin')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            return redirect()->route('admin.login')->withErrors([
                'email' => 'Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman admin.'
            ]);
        }
        
        // Store guard info in session
        $request->session()->put('auth.guard', 'admin');

        return $next($request);
    }
}
