<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('posisi_pkl', function (Blueprint $table) {
            $table->id();
            $table->string('nama_posisi');
            $table->string('kategori');
            $table->text('deskripsi');
            $table->text('persyaratan');
            $table->text('benefits');
            $table->enum('tipe', ['Full-time', 'Part-time', 'Remote', 'Hybrid']);
            $table->integer('durasi_bulan');
            $table->integer('jumlah_pendaftar')->default(0);
            $table->enum('status', ['Aktif', 'Non-Aktif', 'Penuh'])->default('Aktif');
            $table->unsignedBigInteger('created_by');
            $table->timestamps();
            $table->foreign('created_by')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posisi_pkl');
    }
};
