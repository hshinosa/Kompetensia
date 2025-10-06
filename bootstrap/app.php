<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('web')
                ->group(base_path('routes/auth.php'));
            Route::middleware('web')
                ->prefix('admin')
                ->name('admin.')
                ->group(base_path('routes/admin.php'));
            Route::middleware(['web', 'auth'])
                ->prefix('settings')
                ->name('settings.')
                ->group(base_path('routes/settings.php'));
            Route::middleware('web')
                ->group(base_path('routes/client.php'));
        },
    )
    ->withProviders([
        App\Providers\RepositoryServiceProvider::class,
    ])
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            \App\Http\Middleware\SetSessionCookieByRoute::class,
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            'client' => \App\Http\Middleware\EnsureUserIsClient::class,
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
            'admin.guest' => \App\Http\Middleware\AdminGuest::class,
            'client.guest' => \App\Http\Middleware\ClientGuest::class,
        ]);
    })
    ->withExceptions(function () {
        //
    })->create();
