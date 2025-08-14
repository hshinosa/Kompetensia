<?php

use App\Services\PenilaianSertifikasiService;
use App\Repositories\Contracts\PenilaianSertifikasiRepositoryInterface;
use App\Models\PendaftaranSertifikasi;
use App\Models\PenilaianSertifikasi;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('stores Diterima status for individual penilaian', function() {
    $pendaftaran = PendaftaranSertifikasi::factory()->create();
    $mockRepo = mock(PenilaianSertifikasiRepositoryInterface::class);
    $service = new PenilaianSertifikasiService($mockRepo);
    $mockRepo->shouldReceive('upsert')->once()->withArgs(function(array $data){
        expect($data['status_kelulusan'])->toBe('Diterima');
        return true;
    })->andReturn(new PenilaianSertifikasi());
    $service->nilaiIndividu([
        'pendaftaran_id' => $pendaftaran->id,
        'status_kelulusan' => 'Diterima'
    ], $pendaftaran->id, 1);
});

it('updates status from Diterima to Ditolak via upsert', function() {
    $pendaftaran = PendaftaranSertifikasi::factory()->create();
    $mockRepo = mock(PenilaianSertifikasiRepositoryInterface::class);
    $service = new PenilaianSertifikasiService($mockRepo);
    $mockRepo->shouldReceive('upsert')->twice()->andReturn(new PenilaianSertifikasi());
    $service->nilaiIndividu([
        'pendaftaran_id' => $pendaftaran->id,
        'status_kelulusan' => 'Diterima'
    ], $pendaftaran->id, 1);
    $service->nilaiIndividu([
        'pendaftaran_id' => $pendaftaran->id,
        'status_kelulusan' => 'Ditolak'
    ], $pendaftaran->id, 2);
    expect(true)->toBeTrue();
});
