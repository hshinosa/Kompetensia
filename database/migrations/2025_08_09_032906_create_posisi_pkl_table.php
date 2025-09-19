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
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('pendaftaran_pkl', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('posisi_pkl_id')->constrained('posisi_pkl')->cascadeOnDelete();
            $table->enum('status', ['Pengajuan', 'Disetujui', 'Ditolak', 'Dibatalkan'])->default('Pengajuan');
            $table->date('tanggal_pendaftaran');
            $table->date('tanggal_mulai')->nullable();
            $table->date('tanggal_selesai')->nullable();
            $table->string('institusi_asal')->nullable();
            $table->string('program_studi')->nullable();
            $table->integer('semester')->nullable();
            $table->text('motivasi')->nullable();
            $table->json('berkas_persyaratan')->nullable();
            $table->text('catatan_admin')->nullable();
            $table->timestamp('tanggal_diproses')->nullable();
            
            // Data Diri Fields from Form
            $table->string('nama_lengkap')->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('email_pendaftar')->nullable();
            $table->string('nomor_handphone')->nullable();
            $table->text('alamat')->nullable();
            $table->string('instagram')->nullable();
            $table->string('tiktok')->nullable();
            $table->enum('memiliki_laptop', ['ya', 'tidak'])->nullable();
            $table->enum('memiliki_kamera_dslr', ['ya', 'tidak'])->nullable();
            $table->string('transportasi_operasional')->nullable();
            
            // Background Pendidikan Fields
            $table->string('asal_sekolah')->nullable();
            $table->string('jurusan')->nullable();
            $table->string('kelas')->nullable();
            $table->date('awal_pkl')->nullable();
            $table->date('akhir_pkl')->nullable();
            
            // Skill & Minat Fields
            $table->text('kemampuan_ditingkatkan')->nullable();
            $table->text('skill_kelebihan')->nullable();
            $table->text('bidang_yang_disukai')->nullable();
            $table->enum('pernah_membuat_video', ['ya', 'tidak'])->nullable();
            
            // Kebijakan & Finalisasi Fields
            $table->enum('sudah_melihat_profil', ['ya', 'tidak'])->nullable();
            $table->integer('tingkat_motivasi')->nullable()->comment('1-10');
            $table->text('nilai_diri')->nullable();
            $table->enum('apakah_merokok', ['ya', 'tidak'])->nullable();
            $table->enum('bersedia_ditempatkan', ['ya', 'tidak'])->nullable();
            $table->enum('bersedia_masuk_2_kali', ['ya', 'tidak'])->nullable();
            
            $table->timestamps();
        });

        Schema::create('penilaian_pkl', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftaran_id')->constrained('pendaftaran_pkl')->cascadeOnDelete();
            $table->foreignId('posisi_pkl_id')->constrained('posisi_pkl')->cascadeOnDelete();
            $table->enum('status_penilaian', ['Belum Dinilai', 'Diterima', 'Ditolak'])->default('Belum Dinilai');
            $table->decimal('nilai_sikap', 5, 2)->nullable();
            $table->decimal('nilai_keterampilan', 5, 2)->nullable();
            $table->decimal('nilai_pengetahuan', 5, 2)->nullable();
            $table->text('catatan_penilai')->nullable();
            $table->date('tanggal_penilaian')->nullable();
            $table->timestamps();
        });

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

        // Tambahkan foreign key constraint untuk dokumen_pengguna setelah tabel pendaftaran_pkl dibuat
        Schema::table('dokumen_pengguna', function (Blueprint $table) {
            $table->foreign('pendaftaran_pkl_id')->references('id')->on('pendaftaran_pkl')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        // Hapus foreign key constraint terlebih dahulu
        Schema::table('dokumen_pengguna', function (Blueprint $table) {
            $table->dropForeign(['pendaftaran_pkl_id']);
        });

        Schema::dropIfExists('laporan_mingguan');
        Schema::dropIfExists('penilaian_pkl');
        Schema::dropIfExists('pendaftaran_pkl');
        Schema::dropIfExists('posisi_pkl');
    }
};
