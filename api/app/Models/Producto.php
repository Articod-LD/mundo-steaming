<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        'screen_count',
        'profile_name',
        'profile_pin',
        'purchase_date',
        'suscripcion_id',
        'plataforma_id',
        'credencial_id',
        'months',
        'status'
    ];

    
    public function suscripcion()
    {
        return $this->belongsTo(suscription::class,'suscripcion_id');
    }

    public function credencial()
    {
        return $this->belongsTo(credenciales::class,'credencial_id');
    }

    public function plataforma()
    {
        return $this->belongsTo(plataforma::class);
    }

}
