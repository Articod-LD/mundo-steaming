<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class solicitudes extends Model
{
    use HasFactory;

    protected $fillable = [
        'tipo_id',
        'usuario_id',
    ];


    public function user()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }


    public function tipo()
    {
        return $this->belongsTo(suscriptionType::class, 'tipo_id');
    }
}
