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

    public function subscription()
    {
        return $this->belongsTo(suscription::class, 'suscripcion_id');
    }

    public function tipo()
    {
        return $this->belongsTo(suscriptionType::class, 'tipo_id');
    }
}
