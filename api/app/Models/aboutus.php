<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class aboutus extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'image_url',
        'video_url'
    ];
}
