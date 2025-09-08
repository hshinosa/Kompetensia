<?php

use App\Http\Controllers\Client\DashboardController;
use App\Http\Controllers\Client\PKLController;
use App\Http\Controllers\Client\SertifikasiController;
use App\Http\Controllers\Client\Auth\LoginController;
use App\Http\Controllers\Client\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    
    Route::get('/client/pkl', [PKLController::class, 'index'])->name('client.pkl');
    
    Route::get('/client/pkl/{id}', [PKLController::class, 'show'])->name('client.pkl.detail');
    
    Route::post('/client/pkl/{id}/upload', [PKLController::class, 'uploadDocument'])->name('client.pkl.upload');
    
    Route::get('/client/sertifikat-saya', function () {
        return Inertia::render('client/sertifikat-saya/index');
    })->name('client.sertifikat-saya');
    
    Route::get('/client/pengaturan', function () {
        return Inertia::render('client/pengaturan/index');
    })->name('client.pengaturan');
});