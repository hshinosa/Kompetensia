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
        if (!Auth::guard('client')->check()) {
            return redirect()->route('client.login');
        }

        if (Auth::guard('client')->user()->role !== 'mahasiswa') {
            Auth::guard('client')->logout();
            return redirect()->route('client.login')->withErrors([
                'email' => 'Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini.'
            ]);
        }

        return $next($request);
    }
}
