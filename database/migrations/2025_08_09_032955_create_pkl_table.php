<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pkl', function (Blueprint $table) {
            $table->id();
            $table->string('nama_program');
            $table->text('deskripsi')->nullable();
            $table->integer('durasi_minggu');
            // kuota removed in later migration
            $table->integer('peserta_terdaftar')->default(0);
            $table->enum('status', ['Aktif','Non-Aktif','Penuh'])->default('Aktif');
            $table->json('persyaratan')->nullable();
            $table->json('benefit')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pkl');
    }
};
