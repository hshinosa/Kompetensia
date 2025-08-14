<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pendaftaran_pkl', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('pkl_id');
            $table->enum('status', ['Pengajuan', 'Disetujui', 'Ditolak', 'Dibatalkan'])->default('Pengajuan');
            $table->date('tanggal_pendaftaran');
            $table->text('motivasi')->nullable();
            $table->json('berkas_persyaratan')->nullable();
            $table->text('catatan_admin')->nullable();
            $table->timestamp('tanggal_diproses')->nullable();
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('pkl_id')->references('id')->on('pkl')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pendaftaran_pkl');
    }
};
