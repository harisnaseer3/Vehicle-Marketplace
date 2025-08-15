<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Posts\PostsController;
use App\Http\Controllers\FavoritesController;
use App\Http\Controllers\RecentlyViewedController;
use App\Http\Controllers\ReviewsController;
use App\Http\Controllers\DealersController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Vehicle\FeaturedVehicleController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\DealController;

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
Route::post('/change-password', [AuthController::class, 'changePassword']);
Route::get('/auth/check', [AuthController::class, 'checkAuthStatus']);

//stats
Route::get('stats', [StatsController::class, 'index']);
Route::get('count-by-categories', [StatsController::class, 'countVehiclesByCategories']);
Route::apiResource('deals', DealController::class);

// Public Dealer Routes
Route::get('/dealers', [DealersController::class, 'index']);
Route::get('/dealers/featured', [DealersController::class, 'featured']);
Route::get('/dealers/{id}', [DealersController::class, 'show']);


// Public Review Routes
Route::get('/reviews', [ReviewsController::class, 'index']);

// Public News Routes
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/featured', [NewsController::class, 'featured']);
Route::get('/news/related', [NewsController::class, 'related']);
Route::get('/news/categories', [NewsController::class, 'categories']);
Route::get('/news/{slug}', [NewsController::class, 'show']);

Route::middleware('auth:api')->group(function () {
    Route::get('/user/profile', [ProfileController::class, 'show']);
    Route::get('/user/vehicles', [ProfileController::class, 'userVehicles']);
    Route::put('/user/profile/update', [ProfileController::class, 'update']);
    Route::delete('/user/profile/delete', [ProfileController::class, 'destroy']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Favorites Routes
    Route::get('/favorites', [FavoritesController::class, 'index']);
    Route::post('/favorites/toggle', [FavoritesController::class, 'toggle']);
    Route::get('/favorites/check', [FavoritesController::class, 'check']);

    // Recently Viewed Routes
    Route::get('/recently-viewed', [RecentlyViewedController::class, 'index']);
    Route::post('/recently-viewed/add', [RecentlyViewedController::class, 'add']);
    Route::delete('/recently-viewed/clear', [RecentlyViewedController::class, 'clear']);

    // Reviews Routes
    Route::post('/reviews', [ReviewsController::class, 'store']);
    Route::put('/reviews/{id}', [ReviewsController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewsController::class, 'destroy']);

    // Dealer Management Routes
    Route::post('/dealers', [DealersController::class, 'store']);
    Route::put('/dealers/{id}', [DealersController::class, 'update']);
});

//post
Route::get('/vehicles', [PostsController::class, 'index']);
Route::get('/bikes', [PostsController::class, 'getAllBikes']);
Route::get('/vehicles/{id}', [PostsController::class, 'show']);
Route::get('/bike/{id}', [PostsController::class, 'showBikes']);
Route::post('/create-post', [PostsController::class, 'create']);
Route::get('/vehicle/search', [CategoryController::class, 'filterSearch']);
Route::get('/vehicle/simple-search', [CategoryController::class, 'search']);
Route::get('/certified-vehicles', [PostsController::class, 'getCertifiedVehicle']);
Route::get('/managed-by-us-vehicles', [PostsController::class, 'getManagedByUsVehicle']);

//vehicle
Route::get('/featured-vehicles', [FeaturedVehicleController::class, 'index']);
Route::get('/featured-bikes', [FeaturedVehicleController::class, 'getFeaturedBikes']);

//categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/makes/{category_id}', [CategoryController::class, 'getMakes']);
Route::get('/makes/{make_id}/models', [CategoryController::class, 'getModels']);
Route::get('/vehicle-registration', [CategoryController::class, 'getVehiclesRegister']);
Route::get('/cities', [CategoryController::class, 'getCities']);
Route::get('/transmission-type', [CategoryController::class, 'getTransmissionType']);
Route::get('/fuel-type', [CategoryController::class, 'getFuelType']);
Route::get('/body-type', [CategoryController::class, 'getBodyType']);
Route::get('/condition-type', [CategoryController::class, 'getCondition']);

// Protected Routes (JWT Token Required)
Route::middleware('auth:api')->group(function () {
    Route::put('/update-post/{id}', [PostsController::class, 'update']);
    Route::delete('/posts/{id}', [PostsController::class, 'destroy']);
    Route::post('/posts/{id}/restore', [PostsController::class, 'restore']);
    Route::delete('/posts/{id}/force', [PostsController::class, 'forceDelete']);

    Route::put('/make-certified/{id}', [PostsController::class, 'makeCertified']);
    Route::put('/make-manage-by-us/{id}', [PostsController::class, 'makeManageByUs']);
});
