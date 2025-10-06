<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;

Route::get('/', [\App\Http\Controllers\ClientController::class, 'landingPage'])->name('home');

Route::get('/sertifikasi', [\App\Http\Controllers\ClientController::class, 'sertifikasiPage'])->name('sertifikasi');

Route::get('/pkl', [\App\Http\Controllers\ClientController::class, 'pklPage'])->name('pkl');

Route::get('/pendaftaran-pkl', [\App\Http\Controllers\ClientController::class, 'pendaftaranPklPage'])->name('pendaftaran-pkl');

Route::get('/test-upload', function () {
    return view('test-upload');
})->name('test-upload');

Route::get('/detailsertifikasi/{slug}', [\App\Http\Controllers\ClientController::class, 'previewSertifikasi'])->name('detailsertifikasi');

// Note: Admin routes are handled in routes/admin.php with proper middleware and guard
// No need for duplicate routes here to avoid conflicts
