<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\FavoriteController;

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

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/me', function () {
        return auth()->user();
    });

    // Movie OMDb Proxy routes
    Route::get('/movies', [MovieController::class, 'search']);
    Route::get('/movies/{id}', [MovieController::class, 'show']);

    // Favorites routes
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{imdbId}', [FavoriteController::class, 'destroy']);
});

// Route::get('test', [LoginController::class, 'login']);