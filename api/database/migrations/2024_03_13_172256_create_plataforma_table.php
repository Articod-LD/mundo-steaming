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
        Schema::create('plataformas', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Nombre de la plataforma');
            $table->string('image_url')->comment('URL de la imagen de la plataforma');
            $table->decimal('public_price', 10, 2)->comment('Precio público de la plataforma');
            $table->decimal('provider_price', 10, 2)->comment('Precio para el proveedor');
            $table->boolean('is_active')->default(1)->comment('Indica si la plataforma está activa');
            $table->integer('count_avaliable')->default(0)->comment('Indica cuantas estan disponibles');
            $table->enum('type', ['completa', 'pantalla'])->default('completa')->comment('Indica cuantas estan disponibles');
            $table->text('description')->comment('Campo para observaciones'); 
            $table->unsignedBigInteger('categoria_id')->comment('Categoria de la plataforma');
            $table->foreign('categoria_id')->references('id')->on('categorias')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plataformas');
    }
};
