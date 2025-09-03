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
            // PKL specific fields
            $table->string('school_university')->nullable();
            $table->string('major_concentration')->nullable();
            $table->string('class_semester')->nullable();
            $table->enum('gender', ['L', 'P'])->nullable();
            $table->string('place_of_birth')->nullable();
            $table->date('date_of_birth')->nullable();
            
            // Skills and experience
            $table->text('skills_to_improve')->nullable();
            $table->text('skills_to_contribute')->nullable();
            $table->boolean('has_laptop')->default(false);
            $table->boolean('has_dslr')->default(false);
            $table->boolean('has_video_review_experience')->default(false);
            $table->boolean('interested_in_content_creation')->default(false);
            
            // Preferences
            $table->string('preferred_field')->nullable();
            $table->string('preferred_field_type')->nullable();
            $table->string('transportation')->nullable();
            
            // Motivation and rating
            $table->integer('motivation_level')->nullable();
            $table->string('self_rating')->nullable();
            
            // Compliance
            $table->boolean('is_smoker')->default(false);
            $table->boolean('agrees_to_school_return_if_violation')->default(false);
            $table->boolean('agrees_to_return_if_absent_twice')->default(false);
            
            // Social media
            $table->string('instagram_handle')->nullable();
            $table->string('tiktok_handle')->nullable();
            
            // Internship period
            $table->date('internship_start_period')->nullable();
            $table->date('internship_end_period')->nullable();
            
            // Documents
            $table->string('cv_path')->nullable();
            $table->string('portfolio_path')->nullable();
            
            // Profile completion
            $table->integer('profile_completion_percentage')->default(0);
            $table->boolean('has_viewed_company_profile')->default(false);
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'school_university',
                'major_concentration',
                'class_semester',
                'skills_to_improve',
                'skills_to_contribute',
                'preferred_field',
                'preferred_field_type',
                'transportation',
                'motivation_level',
                'self_rating',
                'has_laptop',
                'has_dslr',
                'has_video_review_experience',
                'interested_in_content_creation',
                'has_viewed_company_profile',
                'is_smoker',
                'agrees_to_school_return_if_violation',
                'agrees_to_return_if_absent_twice',
                'instagram_handle',
                'tiktok_handle'
            ]);
        });
    }
};
