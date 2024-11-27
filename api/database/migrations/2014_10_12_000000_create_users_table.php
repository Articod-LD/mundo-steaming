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
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Nombre del usuario');
            $table->string('email')->unique()->comment('Correo electrónico único');
            $table->boolean('is_active')->default(1)->comment('Estado de actividad del usuario');
            $table->string('password')->comment('Contraseña hash');
            $table->string('phone', 15)->nullable()->comment('Número de teléfono del usuario');
            $table->decimal('wallet', 10, 2)->default(0)->comment('Saldo en la billetera del usuario');
            $table->rememberToken()->comment('Token para recordar sesiones');
            $table->timestamp('last_login_at')->nullable()->comment('Última vez que el usuario inició sesión');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
