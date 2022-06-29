<?php

namespace App\Http\Controllers;

use App\Models\DailyCalorieData;
use App\Models\User;
use GuzzleHttp\Psr7\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function getCurrentUser() {
        return response(json_encode(auth()->user()));
    }

    public function getTotalCaloriesForToday() {
        $data = DailyCalorieData::where('user_id', auth()->user()->id)->first();

        return response(json_encode($data));
    }

    public function inviteUser(Request $request) {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email'
        ]);

        if (User::whereEmail($request->post('email'))->first()) {
            return response(json_encode([
                'error' => true,
                'message' => 'User already registered'
            ]), 200);
        }

        $generatedPassword = Str::random(15);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($generatedPassword),
            'role' => User::ROLE_CUSTOMER
        ]);

        return response(json_encode([
            'error' => false,
            'password' => $generatedPassword
        ]), 200);
    }
}
