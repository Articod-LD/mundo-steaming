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
        Schema::create('credenciales', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('password');
            $table->boolean('is_active')->default(1);

            $table->unsignedBigInteger('suscripcion_id')->nullable(true);
            $table->foreign('suscripcion_id')->references('id')->on('suscriptions')->onDelete('cascade');


            $table->unsignedBigInteger('tipo_id');
            $table->foreign('tipo_id')->references('id')->on('suscription_types')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credenciales');
    }
};
