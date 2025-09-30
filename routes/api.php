<?php

use App\Http\Controllers\Admin\AsesorController;
use App\Http\Controllers\Admin\SertifikasiController;
use App\Http\Controllers\Admin\PKLController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\VideoController;
use App\Http\Controllers\Api\PendaftaranSertifikasiController;
use App\Http\Controllers\Api\PendaftaranPKLController;
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

    // Pendaftaran Sertifikasi API routes
    Route::prefix('pendaftaran-sertifikasi')->group(function () {
        Route::get('/', [PendaftaranSertifikasiController::class, 'index'])->name('api.pendaftaran-sertifikasi.index');
        Route::post('/', [PendaftaranSertifikasiController::class, 'store'])->name('api.pendaftaran-sertifikasi.store');
        Route::get('/{id}', [PendaftaranSertifikasiController::class, 'show'])->name('api.pendaftaran-sertifikasi.show');
        Route::put('/{id}', [PendaftaranSertifikasiController::class, 'update'])->name('api.pendaftaran-sertifikasi.update');
        Route::delete('/{id}', [PendaftaranSertifikasiController::class, 'destroy'])->name('api.pendaftaran-sertifikasi.destroy');
        Route::patch('/{id}/status', [PendaftaranSertifikasiController::class, 'updateStatus'])->name('api.pendaftaran-sertifikasi.update-status');
        Route::get('/user/{userId}', [PendaftaranSertifikasiController::class, 'getByUser'])->name('api.pendaftaran-sertifikasi.by-user');
        Route::get('/sertifikasi/{sertifikasiId}', [PendaftaranSertifikasiController::class, 'getBySertifikasi'])->name('api.pendaftaran-sertifikasi.by-sertifikasi');
    });

    // Pendaftaran PKL API routes
    Route::prefix('pendaftaran-pkl')->group(function () {
        Route::get('/', [PendaftaranPKLController::class, 'index'])->name('api.pendaftaran-pkl.index');
        Route::post('/', [PendaftaranPKLController::class, 'store'])->name('api.pendaftaran-pkl.store');
        Route::get('/statistics', [PendaftaranPKLController::class, 'getStatistics'])->name('api.pendaftaran-pkl.statistics');
        Route::get('/{id}', [PendaftaranPKLController::class, 'show'])->name('api.pendaftaran-pkl.show');
        Route::put('/{id}', [PendaftaranPKLController::class, 'update'])->name('api.pendaftaran-pkl.update');
        Route::delete('/{id}', [PendaftaranPKLController::class, 'destroy'])->name('api.pendaftaran-pkl.destroy');
        Route::patch('/{id}/status', [PendaftaranPKLController::class, 'updateStatus'])->name('api.pendaftaran-pkl.update-status');
        Route::get('/user/{userId}', [PendaftaranPKLController::class, 'getByUser'])->name('api.pendaftaran-pkl.by-user');
        Route::get('/posisi/{posisiId}', [PendaftaranPKLController::class, 'getByPosisi'])->name('api.pendaftaran-pkl.by-posisi');
        Route::get('/{id}/download/{type}', [PendaftaranPKLController::class, 'downloadBerkas'])->name('api.pendaftaran-pkl.download-berkas');
    });
});

// Document upload and download for PKL registration (client routes)  
Route::middleware(['web'])->group(function () {
    Route::post('/upload-document', [PendaftaranPKLController::class, 'uploadDocument'])->name('api.upload-document');
    Route::get('/pendaftaran-pkl/{id}/download/{type}', [PendaftaranPKLController::class, 'downloadBerkas'])->name('api.pendaftaran-pkl.download-berkas-public');
});