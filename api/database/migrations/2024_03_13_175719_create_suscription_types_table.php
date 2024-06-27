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
        Schema::create('suscription_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('image_url');
            $table->integer('precio');
            $table->integer('precio_provider');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suscription_types');
    }
};
