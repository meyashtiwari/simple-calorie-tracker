<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class AuthController extends Controller
{

    public function register(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|confirmed'
        ]);

        if ($validator->fails()) {
            return Response::json($validator->errors(), 400);
        }

        if (User::whereEmail($request->post('email'))->first()) {
            throw new BadRequestHttpException('Email already exists');
        }

        $user = User::create([
            'name' => $request->post('name'),
            'email' => $request->post('email'),
            'password' => Hash::make($request->post('password')),
            'role' => User::ROLE_CUSTOMER
        ]);

        return Response::json($user);
    }

}
