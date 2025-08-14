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
            $table->boolean('is_active')->default(true);
            $table->enum('account_status', ['active', 'suspended', 'pending', 'banned'])->default('active');
            $table->enum('user_type', ['student', 'instructor', 'assessor', 'admin'])->default('student');
            $table->string('full_name')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_active', 'account_status', 'user_type', 'full_name']);
        });
    }
};
