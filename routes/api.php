<?php

use App\Http\Controllers\Admin\AsesorController;
use App\Http\Controllers\Admin\SertifikasiController;
use App\Http\Controllers\Admin\PKLController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\VideoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->group(function () {
    // Asesor API routes
    Route::prefix('asesor')->group(function () {
        Route::get('/search', [AsesorController::class, 'search'])->name('api.asesor.search');
        Route::get('/', [AsesorController::class, 'index'])->name('api.asesor.index');
        Route::post('/', [AsesorController::class, 'store'])->name('api.asesor.store');
        Route::get('/{asesor}', [AsesorController::class, 'show'])->name('api.asesor.show');
        Route::put('/{asesor}', [AsesorController::class, 'update'])->name('api.asesor.update');
        Route::delete('/{asesor}', [AsesorController::class, 'destroy'])->name('api.asesor.destroy');
    });

    // Sertifikasi API routes
    Route::prefix('sertifikasi')->group(function () {
        Route::get('/', [SertifikasiController::class, 'apiIndex'])->name('api.sertifikasi.index');
        Route::get('/{id}', [SertifikasiController::class, 'apiShow'])->name('api.sertifikasi.show');
    });

    // PKL API routes  
    Route::prefix('pkl')->group(function () {
        Route::get('/', [PKLController::class, 'apiIndex'])->name('api.pkl.index');
        Route::post('/', [PKLController::class, 'apiStore'])->name('api.pkl.store');
        Route::put('/{id}', [PKLController::class, 'apiUpdate'])->name('api.pkl.update');
    });

    // Blog API routes
    Route::prefix('blog')->group(function () {
        Route::get('/', [BlogController::class, 'apiIndex'])->name('api.blog.index');
    });

    // Video API routes
    Route::prefix('video')->group(function () {
        Route::get('/', [VideoController::class, 'apiIndex'])->name('api.video.index');
    });
});
