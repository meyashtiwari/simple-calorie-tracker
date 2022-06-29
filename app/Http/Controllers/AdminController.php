<?php

namespace App\Http\Controllers;

use App\Models\FoodData;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getAllUsers(Request $request) {
        $user = auth()->user();
        if($user->role !== 'ADMIN') {
            return response(json_encode([
                'error' => true,
                'message' => 'Not authenticated to access this route'
            ]));
        }

        $usersData = User::where('role', '!=', 'ADMIN')->get([
            'id',
            'name'
        ]);

        return response(json_encode([
            'error' => false,
            'data' => $usersData
        ]));
    }

    public function createFoodEntryAdmin(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required',
            'name' => 'required',
            'calorie_value' => 'required',
            'taken_at' => 'required'
        ]);

        FoodData::create([
            'user_id' => $validated['user_id'],
            'name' => $validated['name'],
            'calorie_value' => $validated['calorie_value'],
            'taken_at' => date("Y-m-d H:i:s", strtotime($validated['taken_at']))
        ]);

        return response(json_encode(["error" => false]), 200);
    }
}