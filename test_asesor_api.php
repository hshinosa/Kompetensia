<?php

require_once 'vendor/autoload.php';
require_once 'bootstrap/app.php';

use Illuminate\Http\Request;
use App\Http\Controllers\Admin\AsesorController;

try {
    // Create a test request
    $request = new Request(['q' => 'Dr']);
    
    // Create controller instance
    $controller = new AsesorController();
    
    // Call search method
    $response = $controller->search($request);
    
    echo "API Response: " . $response->getContent() . PHP_EOL;
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . PHP_EOL;
}
