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
        Schema::table('penilaian_pkl', function (Blueprint $table) {
            // Drop foreign keys first
            $table->dropForeign(['pembimbing_id']);
            $table->dropForeign(['pkl_id']);
            
            // Drop columns
            $table->dropColumn(['pembimbing_id', 'catatan_pembimbing', 'pkl_id']);
            
            // Add new columns
            $table->unsignedBigInteger('posisi_pkl_id')->after('pendaftaran_id');
            $table->text('catatan_penilai')->nullable()->after('status_kelulusan');
            
            // Add foreign key
            $table->foreign('posisi_pkl_id')->references('id')->on('posisi_pkl')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penilaian_pkl', function (Blueprint $table) {
            // Drop new foreign key and columns
            $table->dropForeign(['posisi_pkl_id']);
            $table->dropColumn(['posisi_pkl_id', 'catatan_penilai']);
            
            // Add back old columns
            $table->unsignedBigInteger('pkl_id')->after('pendaftaran_id');
            $table->unsignedBigInteger('pembimbing_id')->after('pkl_id');
            $table->text('catatan_pembimbing')->nullable()->after('status_kelulusan');
            
            // Add back foreign keys
            $table->foreign('pkl_id')->references('id')->on('pkl')->cascadeOnDelete();
            $table->foreign('pembimbing_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }
};
