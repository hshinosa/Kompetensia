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
        Schema::table('review_sertifikasis', function (Blueprint $table) {
            // Add the new column
            $table->foreignId('posisi_pkl_id')->nullable()->after('sertifikasi_id')->constrained('posisi_pkl')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('review_sertifikasis', function (Blueprint $table) {
            // Drop the foreign key and column
            $table->dropForeign(['posisi_pkl_id']);
            $table->dropColumn('posisi_pkl_id');
        });
    }
};
