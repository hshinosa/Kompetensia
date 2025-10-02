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
        Schema::create('review_pkl', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('posisi_pkl_id')->constrained('posisi_pkl')->onDelete('cascade');
            $table->tinyInteger('rating')->unsigned()->comment('Rating 1-5');
            $table->text('review')->comment('Review text from user');
            $table->timestamps();
            
            // Ensure one review per user per PKL position
            $table->unique(['user_id', 'posisi_pkl_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('review_pkl');
    }
};
