<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('penilaian_sertifikasi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pendaftaran_id');
            $table->unsignedBigInteger('sertifikasi_id');
            $table->unsignedBigInteger('batch_id')->nullable();
            $table->unsignedBigInteger('asesor_id');
            $table->decimal('nilai_teori', 5, 2)->nullable();
            $table->decimal('nilai_praktek', 5, 2)->nullable();
            $table->decimal('nilai_akhir', 5, 2)->nullable();
            $table->enum('status_kelulusan', ['Belum Dinilai', 'Lulus', 'Tidak Lulus'])->default('Belum Dinilai');
            $table->text('catatan_asesor')->nullable();
            $table->date('tanggal_penilaian')->nullable();
            $table->timestamps();
            $table->foreign('pendaftaran_id')->references('id')->on('pendaftaran_sertifikasi')->cascadeOnDelete();
            $table->foreign('sertifikasi_id')->references('id')->on('sertifikasi')->cascadeOnDelete();
            $table->foreign('batch_id')->references('id')->on('batch_sertifikasi')->nullOnDelete();
            $table->foreign('asesor_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penilaian_sertifikasi');
    }
};
