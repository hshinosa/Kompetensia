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
        // Update existing data to map old values to new ones
        DB::table('sertifikasi')->where('jenis_sertifikasi', 'LSP')->update(['jenis_sertifikasi' => 'BNSP']);
        DB::table('sertifikasi')->where('jenis_sertifikasi', 'Internal')->update(['jenis_sertifikasi' => 'Industri']);
        
        // Alter the enum to only allow 'Industri' and 'BNSP'
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE `sertifikasi` MODIFY `jenis_sertifikasi` ENUM('Industri','BNSP') NOT NULL");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore the original enum values
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE `sertifikasi` MODIFY `jenis_sertifikasi` ENUM('LSP','Industri','Internal') NOT NULL");
        }
    }
};
