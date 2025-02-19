<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class credenciales extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'password',
        'is_active',
        'suscripcion_id',
        'tipo_id',
    ];


    public function productos()
    {
        return $this->hasMany(Producto::class,'producto_id');
    }

}
