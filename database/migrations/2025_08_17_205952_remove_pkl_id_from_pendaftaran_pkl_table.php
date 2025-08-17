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
            // Drop foreign key first
            $table->dropForeign(['pkl_id']);
            // Drop column
            $table->dropColumn('pkl_id');
            
            // Drop and recreate posisi_pkl_id foreign key constraint to allow cascade delete instead of set null
            $table->dropForeign(['posisi_pkl_id']);
            $table->foreign('posisi_pkl_id')->references('id')->on('posisi_pkl')->cascadeOnDelete();
            
            // Make posisi_pkl_id not nullable
            $table->unsignedBigInteger('posisi_pkl_id')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftaran_pkl', function (Blueprint $table) {
            // Add back pkl_id column
            $table->unsignedBigInteger('pkl_id')->after('user_id');
            $table->foreign('pkl_id')->references('id')->on('pkl')->cascadeOnDelete();
            
            // Make posisi_pkl_id nullable again and recreate original constraint
            $table->unsignedBigInteger('posisi_pkl_id')->nullable()->change();
            $table->dropForeign(['posisi_pkl_id']);
            $table->foreign('posisi_pkl_id')->references('id')->on('posisi_pkl')->nullOnDelete();
        });
    }
};
