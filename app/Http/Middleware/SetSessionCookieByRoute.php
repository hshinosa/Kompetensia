<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetSessionCookieByRoute
{
    /**
     * Handle an incoming request.
     * 
     * Sets appropriate session cookie name based on route prefix
     * to allow simultaneous admin and client sessions.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Determine session cookie based on route
        if ($request->is('admin/*') || $request->is('admin')) {
            config(['session.cookie' => 'kompetensia_admin_session']);
        } elseif (
            $request->is('client/*') || 
            $request->is('client') || 
            $request->is('dashboard') || 
            $request->is('dashboard/*') ||
            $request->is('sertifikasi') ||
            $request->is('pkl') ||
            $request->is('artikel') ||
            $request->is('artikel/*') ||
            $request->is('video') ||
            $request->is('video/*') ||
            $request->is('pendaftaran-pkl') ||
            $request->is('detailsertifikasi/*') ||
            $request->is('/') ||
            $request->is('')
        ) {
            config(['session.cookie' => 'kompetensia_client_session']);
        }
        // Default session for other routes (auth, settings, etc.)
        // will use the default cookie name from config

        return $next($request);
    }
}
