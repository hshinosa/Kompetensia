<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('penilaian_pkl', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pendaftaran_id');
            $table->unsignedBigInteger('pkl_id');
            $table->unsignedBigInteger('pembimbing_id');
            $table->decimal('nilai_sikap', 5, 2)->nullable();
            $table->decimal('nilai_keterampilan', 5, 2)->nullable();
            $table->decimal('nilai_pengetahuan', 5, 2)->nullable();
            $table->decimal('nilai_akhir', 5, 2)->nullable();
            $table->enum('status_kelulusan', ['Belum Dinilai', 'Lulus', 'Tidak Lulus'])->default('Belum Dinilai');
            $table->text('catatan_pembimbing')->nullable();
            $table->date('tanggal_penilaian')->nullable();
            $table->timestamps();
            $table->foreign('pendaftaran_id')->references('id')->on('pendaftaran_pkl')->cascadeOnDelete();
            $table->foreign('pkl_id')->references('id')->on('posisi_pkl')->cascadeOnDelete();
            $table->foreign('pembimbing_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penilaian_pkl');
    }
};
