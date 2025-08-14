<?php

use App\Services\PenilaianPKLService;
use App\Models\PendaftaranPKL;
use App\Models\PenilaianPKL;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('upserts PKL penilaian status changes', function() {
    $pendaftaran = PendaftaranPKL::factory()->create();
    $service = new PenilaianPKLService();
    $service->nilai($pendaftaran->id, ['status_kelulusan' => 'Diterima'], 1);
    $this->assertDatabaseHas('penilaian_pkl', [ 'pendaftaran_id' => $pendaftaran->id, 'status_kelulusan' => 'Diterima' ]);
    $service->nilai($pendaftaran->id, ['status_kelulusan' => 'Ditolak'], 2);
    $this->assertDatabaseHas('penilaian_pkl', [ 'pendaftaran_id' => $pendaftaran->id, 'status_kelulusan' => 'Ditolak' ]);
});
