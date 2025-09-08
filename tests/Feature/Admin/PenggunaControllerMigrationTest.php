<?php

namespace Tests\Feature\Admin;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PenggunaControllerMigrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function pengguna_routes_are_properly_configured()
    {
        // Test route exists
        $routes = collect(\Route::getRoutes())->map(function ($route) {
            return [
                'uri' => $route->uri(),
                'action' => $route->getActionName()
            ];
        });
        
        // Check if PenggunaController routes exist
        $penggunaRoutes = $routes->filter(function ($route) {
            return str_contains($route['action'], 'PenggunaController');
        });
        
        $this->assertGreaterThan(0, $penggunaRoutes->count(), 'PenggunaController routes should exist');
        
        // Check specific route
        $indexRoute = $routes->firstWhere('uri', 'admin/pengguna');
        $this->assertNotNull($indexRoute, 'admin/pengguna route should exist');
        $this->assertStringContainsString('PenggunaController', $indexRoute['action'], 'admin/pengguna should use PenggunaController');
    }

    /** @test */
    public function user_management_controller_is_removed()
    {
        // Check if UserManagementController file doesn't exist
        $controllerPath = app_path('Http/Controllers/Admin/UserManagementController.php');
        $this->assertFileDoesNotExist($controllerPath, 'UserManagementController.php should be deleted');
    }

    /** @test */
    public function pengguna_controller_exists_and_has_required_methods()
    {
        $controllerPath = app_path('Http/Controllers/Admin/PenggunaController.php');
        $this->assertFileExists($controllerPath, 'PenggunaController.php should exist');
        
        // Check if controller class exists
        $this->assertTrue(class_exists('App\Http\Controllers\Admin\PenggunaController'), 'PenggunaController class should exist');
        
        $controller = new \App\Http\Controllers\Admin\PenggunaController();
        
        // Check required methods exist
        $this->assertTrue(method_exists($controller, 'index'), 'index method should exist');
        $this->assertTrue(method_exists($controller, 'show'), 'show method should exist');
        $this->assertTrue(method_exists($controller, 'toggleStatus'), 'toggleStatus method should exist');
        $this->assertTrue(method_exists($controller, 'getUserActivities'), 'getUserActivities method should exist');
        $this->assertTrue(method_exists($controller, 'getUserSertifikasi'), 'getUserSertifikasi method should exist');
        $this->assertTrue(method_exists($controller, 'getUserPKL'), 'getUserPKL method should exist');
    }

    /** @test */
    public function route_names_are_correctly_configured()
    {
        // Test route names
        $this->assertTrue(\Route::has('admin.pengguna.index'), 'admin.pengguna.index route should exist');
        $this->assertTrue(\Route::has('admin.pengguna.show'), 'admin.pengguna.show route should exist');
        $this->assertTrue(\Route::has('admin.pengguna.toggle-status'), 'admin.pengguna.toggle-status route should exist');
        $this->assertTrue(\Route::has('admin.user-management'), 'admin.user-management alias should exist');
    }

    /** @test */
    public function admin_routes_file_imports_pengguna_controller()
    {
        $routesPath = base_path('routes/admin.php');
        $this->assertFileExists($routesPath, 'admin.php routes file should exist');
        
        $routesContent = file_get_contents($routesPath);
        
        // Check imports
        $this->assertStringContainsString('PenggunaController', $routesContent, 'admin.php should import PenggunaController');
        $this->assertStringNotContainsString('UserManagementController', $routesContent, 'admin.php should not import UserManagementController');
        
        // Check route definitions
        $this->assertStringContainsString('[PenggunaController::class', $routesContent, 'Routes should use PenggunaController');
    }
}
