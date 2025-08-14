<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Sertifikasi;
use App\Models\User;

uses(RefreshDatabase::class);

it('paginates sertifikasi listing with per_page parameter', function(){
    $admin = User::factory()->create(['role'=>'admin']);
    Sertifikasi::factory()->count(30)->create();
    $this->actingAs($admin);
    $resp = $this->get('/admin/sertifikasi-kompetensi?per_page=10');
    $resp->assertStatus(200);
    $pageProps = $resp->inertia();
    expect(data_get($pageProps,'props.sertifikasi.meta.per_page'))->toBe(10);
});

it('filters sertifikasi by search term', function(){
    $admin = User::factory()->create(['role'=>'admin']);
    Sertifikasi::factory()->create(['nama_sertifikasi'=>'UnikNamaTest']);
    Sertifikasi::factory()->create(['nama_sertifikasi'=>'Lain']);
    $this->actingAs($admin);
    $resp = $this->get('/admin/sertifikasi-kompetensi?search=UnikNamaTest');
    $pageProps = $resp->inertia();
    $data = data_get($pageProps,'props.sertifikasi.data');
    expect(collect($data)->pluck('namaSertifikasi'))->toContain('UnikNamaTest');
});
