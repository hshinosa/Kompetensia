<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sertifikasi', function (Blueprint $table) {
            $table->id();
            $table->string('nama_sertifikasi');
            $table->enum('jenis_sertifikasi', ['Industri', 'BNSP']);
            $table->text('deskripsi');
            $table->string('thumbnail')->nullable();
            $table->json('tipe_sertifikat')->nullable();
            $table->enum('status', ['Aktif', 'Tidak Aktif', 'Draf'])->default('Draf');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('asesors', function (Blueprint $table) {
            $table->id();
            $table->string('nama_asesor');
            $table->string('jabatan');
            $table->string('instansi');
            $table->text('bio')->nullable();
            $table->string('foto')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->json('keahlian')->nullable();
            $table->json('sertifikat')->nullable();
            $table->enum('status', ['Aktif', 'Non-Aktif'])->default('Aktif');
            $table->timestamps();
        });

        Schema::create('modul_sertifikasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sertifikasi_id')->constrained('sertifikasi')->cascadeOnDelete();
            $table->string('judul');
            $table->text('deskripsi');
            $table->json('poin_pembelajaran');
            $table->integer('urutan');
            $table->timestamps();
        });

        Schema::create('batch_sertifikasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sertifikasi_id')->constrained('sertifikasi')->cascadeOnDelete();
            $table->string('nama_batch');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->integer('jumlah_pendaftar')->default(0);
            $table->enum('status', ['Draf', 'Aktif', 'Selesai', 'Ditutup'])->default('Draf');
            $table->string('instruktur')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
        });

        Schema::create('pendaftaran_sertifikasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('sertifikasi_id')->constrained('sertifikasi')->cascadeOnDelete();
            $table->foreignId('batch_id')->constrained('batch_sertifikasi')->cascadeOnDelete();
            $table->enum('status', ['Pengajuan', 'Disetujui', 'Ditolak', 'Dibatalkan'])->default('Pengajuan');
            $table->date('tanggal_pendaftaran');
            $table->text('motivasi')->nullable();
            $table->json('berkas_persyaratan')->nullable();
            $table->text('catatan_admin')->nullable();
            $table->timestamp('tanggal_diproses')->nullable();
            $table->timestamps();
        });

        Schema::create('penilaian_sertifikasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftaran_id')->constrained('pendaftaran_sertifikasi')->cascadeOnDelete();
            $table->foreignId('sertifikasi_id')->constrained('sertifikasi')->cascadeOnDelete();
            $table->foreignId('batch_id')->nullable()->constrained('batch_sertifikasi')->nullOnDelete();
            $table->foreignId('asesor_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status_penilaian', ['Belum Dinilai', 'Diterima', 'Ditolak'])->default('Belum Dinilai');
            $table->decimal('nilai_teori', 5, 2)->nullable();
            $table->decimal('nilai_praktek', 5, 2)->nullable();
            $table->text('catatan_asesor')->nullable();
            $table->date('tanggal_penilaian')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penilaian_sertifikasi');
        Schema::dropIfExists('pendaftaran_sertifikasi');
        Schema::dropIfExists('batch_sertifikasi');
        Schema::dropIfExists('modul_sertifikasi');
        Schema::dropIfExists('asesors');
        Schema::dropIfExists('sertifikasi');
    }
};
