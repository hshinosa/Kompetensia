<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sertifikat_kelulusan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('pendaftaran_sertifikasi_id')->nullable()->constrained('pendaftaran_sertifikasi')->onDelete('cascade');
            $table->foreignId('pendaftaran_pkl_id')->nullable()->constrained('pendaftaran_pkl')->onDelete('cascade');
            $table->string('jenis_program'); // 'sertifikasi' or 'pkl'
            $table->string('nama_program');
            $table->string('link_sertifikat');
            $table->date('tanggal_selesai');
            $table->text('catatan_admin')->nullable();
            $table->foreignId('diterbitkan_oleh')->constrained('users')->onDelete('cascade'); // admin who issued it
            $table->timestamps();
            
            // Index for faster queries
            $table->index(['user_id', 'jenis_program']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sertifikat_kelulusan');
    }
};
