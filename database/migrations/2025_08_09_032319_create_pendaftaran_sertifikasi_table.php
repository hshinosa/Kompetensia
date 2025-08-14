<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pendaftaran_sertifikasi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('sertifikasi_id');
            // Align column with model attribute 'batch_id'
            $table->unsignedBigInteger('batch_id');
            // Align status values with model scopes (Pengajuan/Disetujui)
            $table->enum('status', ['Pengajuan', 'Disetujui', 'Ditolak', 'Dibatalkan'])->default('Pengajuan');
            $table->date('tanggal_pendaftaran');
            $table->text('motivasi')->nullable();
            $table->json('berkas_persyaratan')->nullable();
            $table->text('catatan_admin')->nullable();
            $table->timestamp('tanggal_diproses')->nullable();
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('sertifikasi_id')->references('id')->on('sertifikasi')->cascadeOnDelete();
            $table->foreign('batch_id')->references('id')->on('batch_sertifikasi')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pendaftaran_sertifikasi');
    }
};
