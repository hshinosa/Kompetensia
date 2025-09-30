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
            $table->enum('institusi_asal', ['Sekolah', 'Universitas'])->nullable();
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
            $table->string('cv_file_path')->nullable();
            $table->string('cv_file_name')->nullable();
            $table->string('portfolio_file_path')->nullable();
            $table->string('portfolio_file_name')->nullable();

            // Background Pendidikan Fields
            $table->string('asal_sekolah')->nullable();
            $table->string('jurusan')->nullable();
            $table->string('kelas')->nullable();
            $table->date('awal_pkl')->nullable();
            $table->date('akhir_pkl')->nullable();
            
            // Skill & Minat Fields
            $table->text('kemampuan_ditingkatkan')->nullable();
            $table->text('skill_kelebihan')->nullable();
            $table->enum('pernah_membuat_video', ['ya', 'tidak'])->nullable();
            
            // Kebijakan & Finalisasi Fields
            $table->enum('sudah_melihat_profil', ['ya', 'tidak'])->nullable();
            $table->integer('tingkat_motivasi')->nullable()->comment('1-10');
            $table->enum('nilai_diri', ['A', 'B', 'C', 'D', 'E'])->nullable()->comment('Grade penilaian diri');
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

        // Table untuk upload dokumen PKL (sesuai interface frontend)
        Schema::create('upload_dokumen_pkl', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftaran_id')->constrained('pendaftaran_pkl')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('jenis_dokumen', ['proposal', 'laporan-mingguan', 'laporan-akhir', 'evaluasi']);
            $table->string('judul_tugas')->nullable();
            $table->string('link_url')->nullable();
            $table->string('file_name')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_size')->nullable();
            $table->string('file_type')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('keterangan')->nullable();
            $table->text('feedback')->nullable();
            $table->string('assessor')->nullable();
            $table->timestamp('tanggal_upload')->useCurrent();
            $table->timestamp('tanggal_review')->nullable();
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

        Schema::dropIfExists('upload_dokumen_pkl');
        Schema::dropIfExists('laporan_mingguan');
        Schema::dropIfExists('penilaian_pkl');
        Schema::dropIfExists('pendaftaran_pkl');
        Schema::dropIfExists('posisi_pkl');
    }
};
