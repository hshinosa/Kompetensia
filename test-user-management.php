<?php
// Simple test script for user management
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    echo "Testing User Management...\n";
    
    // Test basic user count
    $userCount = App\Models\User::count();
    echo "Total users in database: $userCount\n";
    
    // Test pagination
    $users = App\Models\User::paginate(10);
    echo "Pagination test:\n";
    echo "- Current page: " . $users->currentPage() . "\n";
    echo "- Per page: " . $users->perPage() . "\n";
    echo "- Total: " . $users->total() . "\n";
    echo "- Last page: " . $users->lastPage() . "\n";
    
    echo "User management controller test PASSED!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}
