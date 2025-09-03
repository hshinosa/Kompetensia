<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add user_type column if not exists
            if (!Schema::hasColumn('users', 'user_type')) {
                $table->enum('user_type', ['student', 'assessor', 'admin'])->default('student')->after('is_active');
            }
            
            // Add account_status column if not exists
            if (!Schema::hasColumn('users', 'account_status')) {
                $table->enum('account_status', ['active', 'inactive', 'suspended'])->default('active')->after('user_type');
            }
            
            // Add full_name column if not exists
            if (!Schema::hasColumn('users', 'full_name')) {
                $table->string('full_name')->nullable()->after('name');
            }
            
            // Add phone column if not exists
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['user_type', 'account_status', 'full_name', 'phone']);
        });
    }
};
