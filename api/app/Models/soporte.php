<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class soporte extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'telefono',
        'pregunta'
    ];
}
