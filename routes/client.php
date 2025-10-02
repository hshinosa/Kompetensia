<?php

use App\Http\Controllers\Client\DashboardController;
use App\Http\Controllers\Client\PKLController;
use App\Http\Controllers\Client\SertifikasiController;
use App\Http\Controllers\Client\SertifikatSayaController;
use App\Http\Controllers\Client\Auth\LoginController;
use App\Http\Controllers\Client\Auth\RegisterController;
use App\Http\Controllers\Client\ArtikelController;
use App\Http\Controllers\Client\VideoController;
use App\Http\Controllers\Api\PendaftaranSertifikasiController;
use App\Http\Controllers\Api\PendaftaranPKLController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// CSRF token route untuk client
Route::get('/client/csrf-token', function () {
    return response()->json(['token' => csrf_token()]);
});

// Public route untuk serve foto profil (tidak perlu auth)
Route::get('/api/settings/foto-profil/{filename}', [SettingsController::class, 'serveFotoProfil'])->name('api.settings.serve-foto-public');

// Client auth routes (guest only)
Route::middleware('client.guest')->group(function () {
    Route::get('/client/login', [LoginController::class, 'create'])->name('client.login');
    Route::post('/client/login', [LoginController::class, 'store']);
    Route::get('/client/register', [RegisterController::class, 'create'])->name('client.register');
    Route::post('/client/register', [RegisterController::class, 'store']);
});

// Client logout route
Route::post('/client/logout', [LoginController::class, 'destroy'])->name('client.logout');

// Protected client routes
Route::middleware(['client'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('client.dashboard');
    
    // Client menu pages
    Route::get('/client/sertifikasi', [SertifikasiController::class, 'index'])->name('client.sertifikasi');
    
    Route::get('/client/sertifikasi/{id}', [SertifikasiController::class, 'show'])->name('client.sertifikasi.detail');
    
    Route::post('/client/sertifikasi/{id}/upload', [SertifikasiController::class, 'uploadTugas'])->name('client.sertifikasi.upload');
    
    Route::post('/client/sertifikasi/{id}/review', [SertifikasiController::class, 'submitReview'])->name('client.sertifikasi.review');
    
    Route::get('/client/pkl', [PKLController::class, 'index'])->name('client.pkl');
    
    Route::get('/client/pkl/{id}', [PKLController::class, 'show'])->name('client.pkl.detail');
    
    Route::post('/client/pkl/{id}/upload', [PKLController::class, 'uploadDocument'])->name('client.pkl.upload');
    
    Route::post('/client/pkl/{id}/review', [PKLController::class, 'submitReview'])->name('client.pkl.review');
    
    Route::get('/client/pkl/download/{uploadId}', [PKLController::class, 'downloadDocument'])->name('client.pkl.download');
    
    Route::get('/client/sertifikat-saya', [SertifikatSayaController::class, 'index'])->name('client.sertifikat-saya');
    
    Route::get('/client/pengaturan', function () {
        return Inertia::render('client/pengaturan/index');
    })->name('client.pengaturan');

    // Settings API routes
    Route::prefix('api/settings')->name('api.settings.')->group(function () {
        Route::get('/profile', [SettingsController::class, 'getProfile'])->name('profile');
        Route::put('/profile', [SettingsController::class, 'updateProfile'])->name('update-profile');
        Route::post('/change-email', [SettingsController::class, 'changeEmail'])->name('change-email');
        Route::post('/change-password', [SettingsController::class, 'changePassword'])->name('change-password');
        Route::post('/upload-foto', [SettingsController::class, 'uploadFotoProfil'])->name('upload-foto');
        Route::delete('/delete-foto', [SettingsController::class, 'deleteFotoProfil'])->name('delete-foto');
        // Route serve foto profil dipindah ke public (di luar middleware auth)
    });

    // Pendaftaran Sertifikasi routes
    Route::prefix('client/pendaftaran-sertifikasi')->name('client.pendaftaran-sertifikasi.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('client/pendaftaran-sertifikasi/index');
        })->name('index');
        Route::get('/my-registrations', [PendaftaranSertifikasiController::class, 'getByUser'])->name('my-registrations');
        Route::post('/', [SertifikasiController::class, 'storePendaftaran'])->name('store');
        Route::get('/{id}/detail', [SertifikasiController::class, 'getRegistrationDetail'])->name('detail');
        Route::get('/{id}', [PendaftaranSertifikasiController::class, 'show'])->name('show');
        Route::put('/{id}', [PendaftaranSertifikasiController::class, 'update'])->name('update');
    });

    // Pendaftaran PKL routes
    Route::prefix('client/pendaftaran-pkl')->name('client.pendaftaran-pkl.')->group(function () {
        Route::get('/', [PKLController::class, 'showPendaftaran'])->name('index');
        Route::post('/', [PKLController::class, 'storePendaftaran'])->name('store');
        Route::get('/my-registrations', [PendaftaranPKLController::class, 'getByUser'])->name('my-registrations');
        Route::get('/{id}/detail', [PKLController::class, 'getRegistrationDetail'])->name('detail');
        Route::get('/{id}', [PendaftaranPKLController::class, 'show'])->name('show');
        Route::put('/{id}', [PendaftaranPKLController::class, 'update'])->name('update');
    });
});

// Public routes (artikel & video)
Route::get('/artikel', [ArtikelController::class, 'index'])->name('client.artikel');
Route::get('/artikel/{slug}', [ArtikelController::class, 'show'])->name('client.artikel.show');
Route::get('/video', [VideoController::class, 'index'])->name('client.video');
Route::get('/video/{slug}', [VideoController::class, 'show'])->name('client.video.show');