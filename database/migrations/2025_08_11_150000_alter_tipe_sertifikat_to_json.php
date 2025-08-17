<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('sertifikasi', function (Blueprint $table) {
            // Ubah enum lama menjadi json; gunakan rename sementara bila perlu
            $table->json('tipe_sertifikat_tmp')->nullable();
        });

        // Salin nilai lama (string) menjadi array json
        $rows = DB::table('sertifikasi')->select('id','tipe_sertifikat')->get();
        foreach ($rows as $row) {
            if ($row->tipe_sertifikat !== null) {
                DB::table('sertifikasi')->where('id',$row->id)->update([
                    'tipe_sertifikat_tmp' => json_encode([$row->tipe_sertifikat])
                ]);
            }
        }

        Schema::table('sertifikasi', function (Blueprint $table) {
            $table->dropColumn('tipe_sertifikat');
        });
        Schema::table('sertifikasi', function (Blueprint $table) {
            $table->renameColumn('tipe_sertifikat_tmp','tipe_sertifikat');
        });
    }

    public function down(): void
    {
        Schema::table('sertifikasi', function (Blueprint $table) {
            $table->string('tipe_sertifikat_old')->nullable();
        });
        $rows = DB::table('sertifikasi')->select('id','tipe_sertifikat')->get();
        foreach ($rows as $row) {
            if ($row->tipe_sertifikat !== null) {
                $decoded = json_decode($row->tipe_sertifikat, true) ?: [];
                DB::table('sertifikasi')->where('id',$row->id)->update([
                    'tipe_sertifikat_old' => $decoded[0] ?? null
                ]);
            }
        }
        Schema::table('sertifikasi', function (Blueprint $table) {
            $table->dropColumn('tipe_sertifikat');
        });
        Schema::table('sertifikasi', function (Blueprint $table) {
            $table->renameColumn('tipe_sertifikat_old','tipe_sertifikat');
        });
    }
};
