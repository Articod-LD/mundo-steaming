<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class recharge extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_reference',
        'payment_method',
        'payment_status',
        'amount',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
