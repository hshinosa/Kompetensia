<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('blog', function (Blueprint $table) {
            $table->id();
            $table->string('nama_artikel');
            $table->enum('jenis_konten', ['Blog', 'Tutorial', 'News']);
            $table->text('deskripsi');
            $table->string('thumbnail')->nullable();
            $table->longText('konten');
            $table->enum('status', ['Draft', 'Publish', 'Archived'])->default('Draft');
            $table->string('penulis');
            $table->integer('views')->default(0);
            $table->boolean('featured')->default(false);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('video', function (Blueprint $table) {
            $table->id();
            $table->string('nama_video');
            $table->text('deskripsi');
            $table->string('thumbnail')->nullable();
            $table->string('video_url');
            $table->integer('durasi')->default(0); // dalam detik
            $table->integer('views')->default(0);
            $table->boolean('featured')->default(false);
            $table->enum('status', ['Draft', 'Publish'])->default('Draft');
            $table->string('uploader');
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('video');
        Schema::dropIfExists('blog');
    }
};
