<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasColumn('batch_sertifikasi','kuota')) {
            Schema::table('batch_sertifikasi', function (Blueprint $table) { $table->dropColumn('kuota'); });
        }
        if (Schema::hasColumn('pkl','kuota')) {
            Schema::table('pkl', function (Blueprint $table) { $table->dropColumn('kuota'); });
        }
        if (Schema::hasColumn('posisi_pkl','kuota')) {
            Schema::table('posisi_pkl', function (Blueprint $table) { $table->dropColumn('kuota'); });
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('batch_sertifikasi','kuota')) {
            Schema::table('batch_sertifikasi', function (Blueprint $table) { $table->integer('kuota')->default(0); });
        }
        if (!Schema::hasColumn('pkl','kuota')) {
            Schema::table('pkl', function (Blueprint $table) { $table->integer('kuota')->default(0); });
        }
        if (!Schema::hasColumn('posisi_pkl','kuota')) {
            Schema::table('posisi_pkl', function (Blueprint $table) { $table->integer('kuota')->default(0); });
        }
    }
};
