<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class categorias extends Model
{
    use HasFactory;

    protected $fillable = [
        'imagen',
        'titulo'
    ];

    public function plataformas()
    {
        return $this->hasMany(plataforma::class,'categoria_id');
    }
}
