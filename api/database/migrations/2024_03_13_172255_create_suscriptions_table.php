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
        Schema::create('suscripciones', function (Blueprint $table) {
            $table->id();
            $table->timestamp('start_date')->comment('Fecha de inicio de la suscripción');
            $table->timestamp('end_date')->nullable()->comment('Fecha de fin de la suscripción');
            $table->decimal('price', 10, 2)->comment('Precio de la suscripción');
            $table->string('order_code')->comment('N de orden');

            $table->unsignedBigInteger('usuario_id')->comment('Referencia al usuario');
            $table->foreign('usuario_id')->references('id')->on('usuarios')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suscripciones');
    }
};
