<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Posts\PostsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Vehicle\FeaturedVehicleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:passport')->get('/user', function (Request $request) {
    return $request->user();
});

// Example public route
Route::get('/test', function () {
    return response()->json(['status' => 'API is working']);
});

// Public Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);


//post
Route::get('/posts', [PostsController::class, 'index']);
Route::get('/post/{id}', [PostsController::class, 'show']);

//vehicle
Route::get('/featured-vehicles', [FeaturedVehicleController::class, 'index']);
// Protected Routes (JWT Token Required)
Route::middleware('auth:api')->group(function () {
    Route::post('/create-post', [PostsController::class, 'create']);
    Route::put('/update-post/{id}', [PostsController::class, 'update']);
    Route::delete('/posts/{id}', [PostsController::class, 'destroy']);
    Route::post('/posts/{id}/restore', [PostsController::class, 'restore']);
    Route::delete('/posts/{id}/force', [PostsController::class, 'forceDelete']);


    Route::post('/logout', [AuthController::class, 'logout']);
});
