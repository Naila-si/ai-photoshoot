<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('photoshoots', function (Blueprint $table) {
            $table->id();
            $table->string('style', 30);
            $table->string('category', 100);
            $table->string('theme', 100);
            $table->string('status', 30)->default('queued');
            $table->string('original_photo_path')->nullable();
            $table->string('generated_photo_path')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photoshoots');
    }
};
