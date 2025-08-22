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
        Schema::create('laporan_mingguan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftaran_id')->constrained('pendaftaran_pkl')->onDelete('cascade');
            $table->string('submissionNumber');
            $table->date('submittedDate')->nullable();
            $table->enum('status', ['submitted', 'pending'])->default('pending');
            $table->enum('jenisDocument', ['Laporan/Tugas', ''])->nullable();
            $table->enum('submissionType', ['link', 'document', ''])->nullable();
            $table->boolean('isAssessed')->default(false);
            $table->enum('statusPenilaian', ['Diterima', 'Tidak Diterima'])->nullable();
            $table->text('feedback')->nullable();
            $table->string('judulTugas')->nullable();
            $table->text('deskripsiTugas')->nullable();
            $table->string('linkSubmisi')->nullable();
            $table->string('fileName')->nullable();
            $table->string('fileSize')->nullable();
            $table->string('fileType')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_mingguan');
    }
};