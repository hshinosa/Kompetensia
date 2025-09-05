<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;

Route::get('/', [\App\Http\Controllers\ClientController::class, 'landingPage'])->name('home');

Route::get('/sertifikasi', function () {
    return Inertia::render('client/SertifikasiPage');
})->name('sertifikasi');

Route::get('/pkl', [\App\Http\Controllers\ClientController::class, 'pklPage'])->name('pkl');

Route::get('/pendaftaran-pkl', [\App\Http\Controllers\ClientController::class, 'pendaftaranPklPage'])->name('pendaftaran-pkl');

Route::get('/detailsertifikasi/{slug}', [\App\Http\Controllers\ClientController::class, 'previewSertifikasi'])->name('detailsertifikasi');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');

    // Inertia admin pages (placeholder - controllers return data in separate routes)
    Route::get('admin/dashboard', fn() => Inertia::render('admin/dashboard'))->name('admin.dashboard');
    // (Legacy inline PKL routes removed; now handled by controller below)
    Route::get('admin/penilaian-pkl/{id}', fn($id) => Inertia::render('admin/detail-penilaian-pkl', ['pesertaId' => $id]))->name('admin.detail-penilaian-pkl');
    // Penilaian Sertifikasi listing now served by controller (server-side pagination & filters)
    Route::get('admin/penilaian-sertifikasi', [\App\Http\Controllers\Admin\PenilaianSertifikasiController::class, 'index'])->name('admin.penilaian-sertifikasi');
    // PKL program & penilaian pages
    Route::get('admin/praktik-kerja-lapangan', [\App\Http\Controllers\Admin\PKLController::class, 'index'])->name('admin.praktik-kerja-lapangan');
    Route::get('admin/praktik-kerja-lapangan/create', [\App\Http\Controllers\Admin\PKLController::class, 'create'])->name('admin.praktik-kerja-lapangan.create');
    Route::get('admin/praktik-kerja-lapangan/{id}/edit', [\App\Http\Controllers\Admin\PKLController::class, 'edit'])->name('admin.praktik-kerja-lapangan.edit');
    Route::delete('admin/praktik-kerja-lapangan/posisi/{id}', [\App\Http\Controllers\Admin\PKLController::class, 'destroyPosisi'])->name('admin.praktik-kerja-lapangan.posisi.destroy');
    Route::get('admin/penilaian-pkl', [\App\Http\Controllers\Admin\PKLController::class, 'penilaianIndex'])->name('admin.penilaian-pkl');
    Route::get('admin/penilaian-pkl/{id}', [\App\Http\Controllers\Admin\PKLController::class, 'penilaianShow'])->name('admin.detail-penilaian-pkl');
    Route::get('admin/penilaian-sertifikasi/{id}', fn($id) => Inertia::render('admin/detail-penilaian-sertifikasi', ['pesertaId' => $id]))->name('admin.detail-penilaian-sertifikasi');
    Route::get('admin/penilaian-sertifikasi/{sertifikasiId}/batch/{batchId}', fn($sertifikasiId, $batchId) => Inertia::render('admin/batch-penilaian-sertifikasi', [
        'sertifikasiId' => $sertifikasiId,
        'batchId' => $batchId
    ]))->name('admin.batch-penilaian-sertifikasi');
    Route::get('admin/sertifikasi/{id}/edit', [\App\Http\Controllers\Admin\SertifikasiController::class, 'edit'])->name('admin.sertifikasi.edit');
    Route::get('admin/manajemen-blog', fn() => Inertia::render('admin/manajemen-blog'))->name('admin.manajemen-blog');
    Route::get('admin/manajemen-video', fn() => Inertia::render('admin/manajemen-video'))->name('admin.manajemen-video');
    Route::get('admin/form-sertifikasi', fn() => Inertia::render('admin/form-sertifikasi'))->name('admin.form-sertifikasi');
    Route::get('admin/form-sertifikasi/{id}', function ($id) {
        return Inertia::render('admin/form-sertifikasi', ['sertifikasiId' => $id]);
    })->name('admin.form-sertifikasi.edit');
    Route::get('admin/detail-sertifikasi/{id}', fn($id) => Inertia::render('admin/detail-sertifikasi', ['id' => $id]))->name('admin.detail-sertifikasi');
});
