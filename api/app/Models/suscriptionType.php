<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class suscriptionType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'image_url',
        'precio',
        'credenciales',
        'solicitudes_id'
    ];


    public function credenciales()
    {
        return $this->hasMany(credenciales::class, 'tipo_id');
    }


    public function solcitudes()
    {
        return $this->hasMany(solicitudes::class);
    }
}
