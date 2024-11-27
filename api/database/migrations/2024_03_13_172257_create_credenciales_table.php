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
            $table->string('email')->unique()->comment('Correo electrónico asociado a la credencial');
            $table->string('password')->comment('Contraseña cifrada');
            $table->boolean('is_active')->default(1)->comment('Estado de actividad de la credencial');
            $table->timestamp('last_used_at')->nullable()->comment('Última vez que se utilizó la credencial');
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
