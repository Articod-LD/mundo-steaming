<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class suscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'Fecha_Inicio',
        'Fecha_Fin',
        'precio',
        'pagado',
        'usuario_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function credential()
    {
        return $this->hasOne(credenciales::class, 'suscripcion_id');
    }
}
