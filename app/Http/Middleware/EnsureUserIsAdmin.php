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
        if (!Auth::guard('admin')->check()) {
            return redirect()->route('admin.login');
        }

        if (Auth::guard('admin')->user()->role !== 'admin') {
            Auth::guard('admin')->logout();
            return redirect()->route('admin.login')->withErrors([
                'email' => 'Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman admin.'
            ]);
        }

        return $next($request);
    }
}
