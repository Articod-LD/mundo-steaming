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
        Schema::create('solicitudes', function (Blueprint $table) {
            $table->id();


            $table->unsignedBigInteger('usuario_id');
            $table->foreign('usuario_id')->references('id')->on('users')->onDelete('cascade');

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
        Schema::dropIfExists('solicitudes');
    }
};
