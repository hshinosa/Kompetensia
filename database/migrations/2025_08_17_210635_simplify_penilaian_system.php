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
        Schema::table('penilaian_pkl', function (Blueprint $table) {
            // Drop nilai columns
            $table->dropColumn([
                'nilai_sikap',
                'nilai_keterampilan',
                'nilai_pengetahuan',
                'nilai_akhir'
            ]);
            
            // Change status_kelulusan enum
            $table->dropColumn('status_kelulusan');
            $table->enum('status_penilaian', ['Belum Dinilai', 'Diterima', 'Ditolak'])
                  ->default('Belum Dinilai')
                  ->after('posisi_pkl_id');
        });
        
        Schema::table('penilaian_sertifikasi', function (Blueprint $table) {
            // Drop nilai columns
            $table->dropColumn([
                'nilai_teori',
                'nilai_praktek',
                'nilai_akhir'
            ]);
            
            // Change status_kelulusan enum
            $table->dropColumn('status_kelulusan');
            $table->enum('status_penilaian', ['Belum Dinilai', 'Diterima', 'Ditolak'])
                  ->default('Belum Dinilai')
                  ->after('batch_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penilaian_pkl', function (Blueprint $table) {
            // Add back nilai columns
            $table->decimal('nilai_sikap', 5, 2)->nullable()->after('posisi_pkl_id');
            $table->decimal('nilai_keterampilan', 5, 2)->nullable()->after('nilai_sikap');
            $table->decimal('nilai_pengetahuan', 5, 2)->nullable()->after('nilai_keterampilan');
            $table->decimal('nilai_akhir', 5, 2)->nullable()->after('nilai_pengetahuan');
            
            // Change back to status_kelulusan
            $table->dropColumn('status_penilaian');
            $table->enum('status_kelulusan', ['Belum Dinilai', 'Lulus', 'Tidak Lulus'])
                  ->default('Belum Dinilai')
                  ->after('nilai_akhir');
        });
        
        Schema::table('penilaian_sertifikasi', function (Blueprint $table) {
            // Add back nilai columns
            $table->decimal('nilai_teori', 5, 2)->nullable()->after('batch_id');
            $table->decimal('nilai_praktek', 5, 2)->nullable()->after('nilai_teori');
            $table->decimal('nilai_akhir', 5, 2)->nullable()->after('nilai_praktek');
            
            // Change back to status_kelulusan
            $table->dropColumn('status_penilaian');
            $table->enum('status_kelulusan', ['Belum Dinilai', 'Lulus', 'Tidak Lulus'])
                  ->default('Belum Dinilai')
                  ->after('nilai_akhir');
        });
    }
};
