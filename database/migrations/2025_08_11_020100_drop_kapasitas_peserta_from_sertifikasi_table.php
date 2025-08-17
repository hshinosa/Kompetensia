<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasColumn('sertifikasi','kapasitas_peserta')) {
            Schema::table('sertifikasi', function (Blueprint $table) {
                $table->dropColumn('kapasitas_peserta');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('sertifikasi','kapasitas_peserta')) {
            Schema::table('sertifikasi', function (Blueprint $table) {
                $table->integer('kapasitas_peserta')->default(0);
            });
        }
    }
};
