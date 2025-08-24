<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SertifikasiController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\VideoController;
use App\Http\Controllers\Admin\PKLController;
use App\Http\Controllers\Admin\PenilaianSertifikasiController;
use App\Http\Controllers\Admin\UserManagementController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified','role:admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/pendaftaran/{type}/{id}', [DashboardController::class, 'pendaftaranDetail'])->name('pendaftaran.detail');
    Route::patch('/pendaftaran/{type}/{id}/approve', [DashboardController::class, 'approvePendaftaran'])->name('pendaftaran.approve');

    Route::get('/sertifikasi-kompetensi', [SertifikasiController::class, 'index'])->name('sertifikasi-kompetensi');
    Route::get('/sertifikasi/create', [SertifikasiController::class, 'create'])->name('sertifikasi.create');
    Route::post('/sertifikasi', [SertifikasiController::class, 'store'])->name('sertifikasi.store');
    Route::get('/sertifikasi/{id}', [SertifikasiController::class, 'show'])->name('sertifikasi.show');
    Route::get('/sertifikasi/{id}/edit', [SertifikasiController::class, 'edit'])->name('sertifikasi.edit');
    Route::put('/sertifikasi/{id}', [SertifikasiController::class, 'update'])->name('sertifikasi.update');
    Route::delete('/sertifikasi/{id}', [SertifikasiController::class, 'destroy'])->name('sertifikasi.destroy');

    $formSertifikasi = '/form-sertifikasi';
    Route::get($formSertifikasi, [SertifikasiController::class, 'create'])->name('form-sertifikasi');
    Route::get($formSertifikasi.'/{id}', [SertifikasiController::class, 'edit'])->name('form-sertifikasi.edit');
    Route::get('/detail-sertifikasi/{id}', [SertifikasiController::class, 'show'])->name('detail-sertifikasi');

    // Blog routes
    // Alias route so redirects using name 'admin.manajemen-blog' work and sidebar path /admin/manajemen-blog is valid
    Route::get('/manajemen-blog', [BlogController::class, 'index'])->name('manajemen-blog');
    Route::prefix('blog')->name('blog.')->group(function(){
        Route::get('/manage', [BlogController::class, 'index'])->name('manage');
        Route::get('/create', [BlogController::class, 'create'])->name('create');
        Route::post('/', [BlogController::class, 'store'])->name('store');
        Route::get('/{id}', [BlogController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [BlogController::class, 'edit'])->name('edit');
        Route::put('/{id}', [BlogController::class, 'update'])->name('update');
        Route::delete('/{id}', [BlogController::class, 'destroy'])->name('destroy');
    });

    // Video routes
    // Alias route for UI path /admin/manajemen-video
    Route::get('/manajemen-video', [VideoController::class, 'index'])->name('manajemen-video');
    Route::prefix('video')->name('video.')->group(function(){
        Route::get('/manage', [VideoController::class, 'index'])->name('manage');
        Route::get('/create', [VideoController::class, 'create'])->name('create');
        Route::post('/', [VideoController::class, 'store'])->name('store');
        Route::get('/{id}', [VideoController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [VideoController::class, 'edit'])->name('edit');
        Route::put('/{id}', [VideoController::class, 'update'])->name('update');
        Route::delete('/{id}', [VideoController::class, 'destroy'])->name('destroy');
    });

    // PKL routes
    Route::get('/praktik-kerja-lapangan', [PKLController::class, 'index'])->name('praktik-kerja-lapangan');
    Route::prefix('pkl')->name('pkl.')->group(function(){
        Route::get('/', [PKLController::class, 'index'])->name('index');
        Route::get('/create', [PKLController::class, 'create'])->name('create');
        Route::post('/', [PKLController::class, 'store'])->name('store');
        Route::get('/{id}', [PKLController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [PKLController::class, 'edit'])->name('edit');
        Route::put('/{id}', [PKLController::class, 'update'])->name('update');
        Route::delete('/{id}', [PKLController::class, 'destroy'])->name('destroy');
    });

    // Posisi PKL routes
    Route::prefix('praktik-kerja-lapangan')->name('praktik-kerja-lapangan.')->group(function(){
        Route::post('/posisi', [PKLController::class, 'storePosisi'])->name('posisi.store');
        Route::get('/posisi/{id}', [PKLController::class, 'showPosisi'])->name('posisi.show');
        Route::put('/posisi/{id}', [PKLController::class, 'updatePosisi'])->name('posisi.update');
        Route::delete('/posisi/{id}', [PKLController::class, 'destroyPosisi'])->name('posisi.destroy');
    });

    Route::get('/penilaian-pkl', [PKLController::class, 'penilaianIndex'])->name('penilaian-pkl');
    Route::get('/penilaian-pkl/overview', [PKLController::class, 'penilaianOverview'])->name('penilaian-pkl.overview');
    Route::get('/penilaian-pkl/{id}', [PKLController::class, 'penilaianShow'])->name('detail-penilaian-pkl');
    Route::post('/penilaian-pkl/{pendaftaranId}', [PKLController::class, 'penilaianStore'])->name('penilaian-pkl.store');

    Route::get('/penilaian-sertifikasi', [PenilaianSertifikasiController::class, 'index'])->name('penilaian-sertifikasi');
    Route::get('/penilaian-sertifikasi/{id}', [PenilaianSertifikasiController::class, 'show'])->name('detail-penilaian-sertifikasi');
    Route::post('/penilaian-sertifikasi/{pendaftaranId}', [PenilaianSertifikasiController::class, 'store'])->name('penilaian-sertifikasi.store');
    Route::get('/penilaian-sertifikasi/{sertifikasiId}/batch/{batchId}', [PenilaianSertifikasiController::class, 'batchPenilaian'])->name('batch-penilaian-sertifikasi');
    Route::post('/penilaian-sertifikasi/{sertifikasiId}/batch/{batchId}', [PenilaianSertifikasiController::class, 'batchStore'])->name('batch-penilaian-sertifikasi.store');

    // User Management routes
    Route::prefix('users')->name('users.')->group(function(){
        Route::get('/', [UserManagementController::class, 'index'])->name('index');
        Route::post('/', [UserManagementController::class, 'store'])->name('store');
        Route::get('/{id}', [UserManagementController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [UserManagementController::class, 'edit'])->name('edit');
        Route::put('/{id}', [UserManagementController::class, 'update'])->name('update');
        Route::delete('/{id}', [UserManagementController::class, 'destroy'])->name('destroy');
        Route::patch('/{id}/toggle-status', [UserManagementController::class, 'toggleStatus'])->name('toggle-status');
        Route::get('/{id}/sertifikasi', [UserManagementController::class, 'getUserSertifikasi'])->name('sertifikasi');
        Route::get('/{id}/pkl', [UserManagementController::class, 'getUserPKL'])->name('pkl');
        Route::get('/{id}/activities', [UserManagementController::class, 'getUserActivities'])->name('activities');
    });
    Route::get('/user-management', [UserManagementController::class, 'index'])->name('user-management');
});
