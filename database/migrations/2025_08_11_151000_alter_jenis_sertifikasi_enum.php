<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // MySQL enum alteration via raw SQL
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE `sertifikasi` MODIFY `jenis_sertifikasi` ENUM('Industri','BNSP') NOT NULL");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE `sertifikasi` MODIFY `jenis_sertifikasi` ENUM('LSP','Industri','Internal') NOT NULL");
        }
    }
};
