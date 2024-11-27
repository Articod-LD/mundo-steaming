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
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->integer('screen_count')->default(0)->comment('Número de pantallas disponibles');
            $table->string('profile_name')->nullable()->comment('Nombre del perfil asociado');
            $table->string('profile_pin')->nullable()->comment('PIN del perfil asociado');
            $table->date('purchase_date')->comment('Fecha de compra del producto');
            $table->integer('months')->default(0)->comment('Meses Comprados');

            $table->unsignedBigInteger('suscripcion_id')->nullable()->comment('Referencia a la suscripcion');
            $table->foreign('suscripcion_id')->references('id')->on('suscripciones')->onDelete('cascade');

            $table->unsignedBigInteger('plataforma_id')->nullable()->comment('Referencia de la plataforma');
            $table->foreign('plataforma_id')->references('id')->on('plataformas')->onDelete('cascade');


            $table->unsignedBigInteger('credencial_id')->nullable()->comment('Referencia a la productos');
            $table->foreign('credencial_id')->references('id')->on('credenciales')->onDelete('cascade');

            $table->enum('status', ['COMPRADO', 'VENCIDO', 'DISPONIBLE'])
                ->default('DISPONIBLE')
                ->comment('Estado del producto');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
