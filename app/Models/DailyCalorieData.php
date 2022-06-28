<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyCalorieData extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'calorie_consumed'
    ];
}
