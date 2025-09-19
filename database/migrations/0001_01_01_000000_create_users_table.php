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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            
            // Basic user fields (Indonesian naming)
            $table->string('nama');
            $table->string('nama_lengkap')->nullable();
            $table->string('email')->unique();
            $table->string('telepon')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->text('alamat')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->string('institusi')->nullable();
            $table->string('jurusan')->nullable();
            $table->unsignedInteger('semester')->nullable();
            $table->enum('role', ['mahasiswa', 'admin'])->default('mahasiswa');
            $table->boolean('aktif')->default(true);
            $table->enum('status_akun', ['aktif', 'ditangguhkan', 'pending', 'diblokir'])->default('aktif');
            $table->enum('tipe_pengguna', ['mahasiswa', 'instruktur', 'asesor', 'admin'])->default('mahasiswa');
            $table->string('foto_profil')->nullable();
            
            // Contact & personal info
            $table->enum('gender', ['Laki-laki', 'Perempuan'])->nullable();
            $table->string('place_of_birth')->nullable();
            $table->date('date_of_birth')->nullable();
            
            // Education (from PKL migration fields)
            $table->string('school_university')->nullable();
            $table->string('major_concentration')->nullable();
            $table->string('class_semester')->nullable();
            $table->decimal('gpa', 3, 2)->nullable();
            
            // Social Media
            $table->string('instagram_handle')->nullable();
            $table->string('tiktok_handle')->nullable();
            
            // Equipment & Skills
            $table->boolean('has_laptop')->default(false);
            $table->boolean('has_dslr')->default(false);
            $table->boolean('has_video_review_experience')->default(false);
            $table->boolean('interested_in_content_creation')->default(false);
            $table->string('transportation')->nullable();
            
            // Skills & Experience
            $table->text('skills_to_improve')->nullable();
            $table->text('skills_to_contribute')->nullable();
            
            // Preferences & Goals
            $table->string('preferred_field')->nullable();
            $table->string('preferred_field_type')->nullable();
            $table->unsignedTinyInteger('motivation_level')->nullable();
            $table->unsignedTinyInteger('self_rating')->nullable();
            
            // Compliance & Agreement
            $table->boolean('is_smoker')->default(false);
            $table->boolean('agrees_to_school_return_if_violation')->default(false);
            $table->boolean('agrees_to_return_if_absent_twice')->default(false);
            
            // Internship Period
            $table->date('internship_start_period')->nullable();
            $table->date('internship_end_period')->nullable();
            
            // Documents
            $table->string('cv_path')->nullable();
            $table->string('portfolio_path')->nullable();
            
            // System fields
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip')->nullable();
            $table->unsignedTinyInteger('profile_completion_percentage')->nullable();
            $table->boolean('has_viewed_company_profile')->default(false);
            
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });

        Schema::create('aktivitas_pengguna', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('jenis_aktivitas');
            $table->text('deskripsi');
            $table->json('metadata')->nullable();
            $table->string('alamat_ip')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'created_at']);
        });

        Schema::create('dokumen_pengguna', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('jenis_dokumen'); // CV, Portofolio, Sertifikat, submisi_pkl, dll.
            $table->string('nama_dokumen');
            $table->string('path_file')->nullable();
            $table->bigInteger('ukuran_file')->nullable();
            $table->string('tipe_mime')->nullable();
            $table->boolean('terverifikasi')->default(false);
            $table->boolean('aktif')->default(true);
            $table->text('catatan')->nullable();
            $table->timestamp('tanggal_verifikasi')->nullable();
            $table->foreignId('diverifikasi_oleh')->nullable()->constrained('users')->onDelete('set null');
            
            // Field untuk submisi PKL
            $table->string('nomor_submisi')->nullable();
            $table->enum('tipe_submisi', ['link', 'dokumen', 'dokumen_dan_link'])->nullable();
            $table->enum('kategori_submisi', ['laporan', 'tugas'])->nullable();
            $table->string('judul_tugas')->nullable();
            $table->text('deskripsi_tugas')->nullable();
            $table->string('link_submisi')->nullable();
            $table->enum('status_penilaian', ['menunggu', 'diterima', 'ditolak'])->default('menunggu');
            $table->text('feedback_pembimbing')->nullable();
            $table->unsignedBigInteger('pendaftaran_pkl_id')->nullable();
            $table->timestamp('tanggal_submit')->nullable();
            
            $table->timestamps();
            
            $table->index(['user_id', 'jenis_dokumen']);
            $table->index(['terverifikasi']);
            $table->index(['aktif']);
            $table->index(['pendaftaran_pkl_id', 'kategori_submisi']);
            $table->index('status_penilaian');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokumen_pengguna');
        Schema::dropIfExists('aktivitas_pengguna');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
