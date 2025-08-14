<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Sertifikasi;
use App\Models\BatchSertifikasi;
use App\Models\PendaftaranSertifikasi;

uses(RefreshDatabase::class);

it('filters batches when batch parameter provided', function(){
    $admin = User::factory()->create(['role'=>'admin']);
    $sertifikasi = Sertifikasi::factory()->create();
    $batchA = BatchSertifikasi::factory()->create(['sertifikasi_id'=>$sertifikasi->id]);
    $batchB = BatchSertifikasi::factory()->create(['sertifikasi_id'=>$sertifikasi->id]);
    PendaftaranSertifikasi::factory()->count(2)->create(['sertifikasi_id'=>$sertifikasi->id,'batch_id'=>$batchA->id]);
    PendaftaranSertifikasi::factory()->count(3)->create(['sertifikasi_id'=>$sertifikasi->id,'batch_id'=>$batchB->id]);
    $this->actingAs($admin);
    $resp = $this->get('/admin/penilaian-sertifikasi?batch='.$batchA->id);
    $resp->assertStatus(200);
    $page = $resp->inertia();
    $data = data_get($page,'props.sertifikasi.data');
    expect($data)->toBeArray();
    $batches = collect($data[0]['batches']);
    expect($batches->count())->toBe(1);
    expect($batches->first()['id'])->toBe($batchA->id);
});
