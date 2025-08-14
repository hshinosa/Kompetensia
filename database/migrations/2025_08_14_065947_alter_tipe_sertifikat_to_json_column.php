<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add temporary JSON column
        Schema::table('sertifikasi', function (Blueprint $table) {
            $table->json('tipe_sertifikat_tmp')->nullable();
        });

        // Convert existing enum values to JSON arrays
        $rows = DB::table('sertifikasi')->select('id', 'tipe_sertifikat')->get();
        foreach ($rows as $row) {
            if ($row->tipe_sertifikat !== null) {
                DB::table('sertifikasi')->where('id', $row->id)->update([
                    'tipe_sertifikat_tmp' => json_encode([$row->tipe_sertifikat])
                ]);
            }
        }

        // Drop old enum column and rename JSON column
        Schema::table('sertifikasi', function (Blueprint $table) {
            $table->dropColumn('tipe_sertifikat');
        });
        
        Schema::table('sertifikasi', function (Blueprint $table) {
            $table->renameColumn('tipe_sertifikat_tmp', 'tipe_sertifikat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add temporary string column
        Schema::table('sertifikasi', function (Blueprint $table) {
            $table->enum('tipe_sertifikat_old', ['Sertifikat Kompetensi', 'Sertifikat Keahlian', 'Sertifikat Profesi'])->nullable();
        });

        // Convert JSON arrays back to single enum values
        $rows = DB::table('sertifikasi')->select('id', 'tipe_sertifikat')->get();
        foreach ($rows as $row) {
            if ($row->tipe_sertifikat !== null) {
                $decoded = json_decode($row->tipe_sertifikat, true) ?: [];
                DB::table('sertifikasi')->where('id', $row->id)->update([
                    'tipe_sertifikat_old' => $decoded[0] ?? 'Sertifikat Kompetensi'
                ]);
            }
        }

        // Drop JSON column and rename enum column
        Schema::table('sertifikasi', function (Blueprint $table) {
            $table->dropColumn('tipe_sertifikat');
        });
        
        Schema::table('sertifikasi', function (Blueprint $table) {
            $table->renameColumn('tipe_sertifikat_old', 'tipe_sertifikat');
        });
    }
};
