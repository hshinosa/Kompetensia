<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            AsesorSeeder::class,
            SertifikasiSeeder::class,
            ModulSertifikasiSeeder::class,
            BatchSertifikasiSeeder::class,
            PosisiPKLSeeder::class,
            PendaftaranSertifikasiSeeder::class,
            PendaftaranPKLSeeder::class,
            PenilaianSertifikasiSeeder::class,
            PenilaianPKLSeeder::class,
            DokumenPenggunaSeeder::class,
            BlogSeeder::class,
            VideoSeeder::class,
        ]);
    }
}
