<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class plataforma extends Model
{
    use HasFactory;

    protected $table = "plataformas";

    protected $fillable = [
        'name',
        'image_url',
        'precio',
        'public_price',
        'provider_price',
        'is_active',
        'count_avaliable',
        'type'
    ];

    public function productos()
    {
        return $this->hasMany(Producto::class,'plataforma_id');
    }

}
