<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FoodDataController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Passport\Http\Controllers\AccessTokenController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', [AccessTokenController::class, 'issueToken'])->name('login');
Route::post('register', [AuthController::class, 'register'])->name('register');

Route::middleware('auth:api')->group(function() {    
    Route::controller(UserController::class)->prefix('users')->group(function() {
        Route::get('/me', 'getCurrentUser');
        Route::get('/calories', 'getTotalCaloriesForToday');
        Route::post('/invite', 'inviteUser');
    });

    Route::apiResource('food', FoodDataController::class);
    Route::get('foodAll', [FoodDataController::class,'foodAll']);
    Route::get('foodLastSeven', [FoodDataController::class,'foodLastSeven']);
    Route::get('foodLastSevenPrev', [FoodDataController::class,'foodLastSevenPrev']);
    Route::get('avgCalorieLastSeven', [FoodDataController::class,'avgCalorieLastSeven']);

    Route::controller(AdminController::class)->prefix('admin')->group(function() {
        Route::get('/users', 'getAllUsers');
        Route::post('/food', 'createFoodEntryAdmin');
    });
    
    Route::get('foodFilter', [FoodDataController::class,'filterFoodEntries']);
    
});
