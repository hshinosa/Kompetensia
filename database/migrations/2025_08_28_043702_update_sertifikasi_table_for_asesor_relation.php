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
            // Tambah kolom asesor_id
            $table->unsignedBigInteger('asesor_id')->nullable()->after('thumbnail');
            $table->foreign('asesor_id')->references('id')->on('asesors')->nullOnDelete();
            
            // Hapus kolom asesor yang lama (akan dilakukan setelah migrasi data)
            // Untuk sementara kita biarkan kolom lama tetap ada
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sertifikasi', function (Blueprint $table) {
            $table->dropForeign(['asesor_id']);
            $table->dropColumn('asesor_id');
        });
    }
};
