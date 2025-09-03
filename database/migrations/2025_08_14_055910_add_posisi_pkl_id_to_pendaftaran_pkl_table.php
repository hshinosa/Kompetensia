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
        Schema::table('pendaftaran_pkl', function (Blueprint $table) {
            $table->foreignId('posisi_pkl_id')->nullable()->after('pkl_id')->constrained('posisi_pkl')->onDelete('set null');
            $table->date('tanggal_mulai')->nullable()->after('tanggal_pendaftaran');
            $table->date('tanggal_selesai')->nullable()->after('tanggal_mulai');
            $table->string('institusi_asal')->nullable()->after('tanggal_selesai');
            $table->string('program_studi')->nullable()->after('institusi_asal');
            $table->integer('semester')->nullable()->after('program_studi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftaran_pkl', function (Blueprint $table) {
            $table->dropForeign(['posisi_pkl_id']);
            $table->dropColumn(['posisi_pkl_id', 'tanggal_mulai', 'tanggal_selesai', 'institusi_asal', 'program_studi', 'semester', 'ipk']);
        });
    }
};
