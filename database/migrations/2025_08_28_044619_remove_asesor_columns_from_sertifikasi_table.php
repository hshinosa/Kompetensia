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
        Schema::table('sertifikasi', function (Blueprint $table) {
            // Hapus kolom asesor yang lama karena sekarang menggunakan relasi asesor_id
            $table->dropColumn([
                'nama_asesor',
                'jabatan_asesor', 
                'instansi_asesor',
                'pengalaman_asesor',
                'foto_asesor'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sertifikasi', function (Blueprint $table) {
            // Kembalikan kolom asesor yang lama
            $table->string('nama_asesor')->nullable();
            $table->string('jabatan_asesor')->nullable();
            $table->string('instansi_asesor')->nullable();
            $table->text('pengalaman_asesor')->nullable();
            $table->string('foto_asesor')->nullable();
        });
    }
};
