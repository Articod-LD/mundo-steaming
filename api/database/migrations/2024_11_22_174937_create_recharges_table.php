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
        Schema::create('recharges', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id')->nullable()->comment('Referencia a la Usuarios');
            $table->foreign('user_id')->references('id')->on('usuarios')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->string('payment_status'); 
            $table->string('payment_method')->nullable(); 
            $table->string('payment_reference')->nullable(); 
            $table->string('external_reference')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recharges');
    }
};
