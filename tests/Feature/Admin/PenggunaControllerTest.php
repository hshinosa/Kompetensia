<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PenggunaControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create admin user for testing
        $this->admin = User::factory()->create([
            'role' => 'admin',
            'aktif' => true,
            'status_akun' => 'aktif'
        ]);
        
        // Create regular user for testing
        $this->user = User::factory()->create([
            'nama' => 'Test User',
            'email' => 'test@example.com',
            'role' => 'mahasiswa',
            'aktif' => true,
            'status_akun' => 'aktif'
        ]);
    }

    /** @test */
    public function admin_can_access_pengguna_index()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.pengguna.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/UserManagement/Index')
        );
    }

    /** @test */
    public function admin_can_view_user_detail()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.pengguna.show', $this->user));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/UserManagement/Detail')
                ->has('pengguna')
                ->where('pengguna.id', $this->user->id)
                ->where('pengguna.nama', $this->user->nama)
                ->where('pengguna.email', $this->user->email)
        );
    }

    /** @test */
    public function admin_can_toggle_user_status()
    {
        $originalStatus = $this->user->aktif;
        
        $response = $this->actingAs($this->admin)
            ->patch(route('admin.pengguna.toggle-status', $this->user));

        $response->assertRedirect();
        $response->assertSessionHas('success');
        
        $this->user->refresh();
        $this->assertEquals(!$originalStatus, $this->user->aktif);
    }

    /** @test */
    public function admin_can_get_user_activities()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.pengguna.activities', $this->user));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data',
            'links',
            'meta'
        ]);
    }

    /** @test */
    public function admin_can_get_user_sertifikasi()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.pengguna.sertifikasi', $this->user));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data',
            'links', 
            'meta'
        ]);
    }

    /** @test */
    public function admin_can_get_user_pkl()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.pengguna.pkl', $this->user));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data',
            'links',
            'meta'
        ]);
    }

    /** @test */
    public function user_management_alias_route_works()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.user-management'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/UserManagement/Index')
        );
    }

    /** @test */
    public function pengguna_controller_returns_correct_data_structure()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.pengguna.show', $this->user));

        $response->assertStatus(200);
        
        $penggunaData = $response->viewData('pengguna');
        
        // Verify Indonesian field names are used
        $this->assertArrayHasKey('nama', $penggunaData);
        $this->assertArrayHasKey('email', $penggunaData);
        $this->assertArrayHasKey('role', $penggunaData);
        $this->assertArrayHasKey('aktif', $penggunaData);
        $this->assertArrayHasKey('status_akun', $penggunaData);
        
        // Verify values match
        $this->assertEquals($this->user->nama, $penggunaData['nama']);
        $this->assertEquals($this->user->email, $penggunaData['email']);
        $this->assertEquals($this->user->role, $penggunaData['role']);
    }

    /** @test */
    public function non_admin_cannot_access_pengguna_routes()
    {
        $regularUser = User::factory()->create(['role' => 'mahasiswa']);
        
        $response = $this->actingAs($regularUser)
            ->get(route('admin.pengguna.index'));

        $response->assertStatus(403);
    }
}
