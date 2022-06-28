<?php

namespace App\Http\Controllers;

use App\Models\DailyCalorieData;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getCurrentUser() {
        return response(json_encode(auth()->user()));
    }

    public function getTotalCaloriesForToday() {
        $data = DailyCalorieData::where('user_id', auth()->user()->id)->first();

        return response(json_encode($data));
    }
}
