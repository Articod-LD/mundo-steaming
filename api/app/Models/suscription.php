<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class suscription extends Model
{
    use HasFactory;

    protected $table = 'suscripciones';

    protected $fillable = [
        'start_date',
        'end_date',
        'price',
        'usuario_id',
        'product_id',
        'order_code'
    ];

    protected $dates = ['start_date', 'end_date'];

    public function user()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function productos()
    {
        return $this->hasMany(Producto::class, 'suscripcion_id');
    }
}
