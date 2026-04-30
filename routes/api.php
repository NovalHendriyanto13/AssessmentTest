<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Users\UserController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Orders\OrderController;

Route::post('login', [AuthController::class, 'login']);

Route::prefix('users')->group(function() {
    Route::post('/', [UserController::class, 'create']);

    Route::middleware('verify.jwt')->group(function() {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{id}', [UserController::class, 'detail']);
    });
});

Route::prefix('orders')->middleware('verify.jwt')->group(function() {
    Route::post('/', [OrderController::class, 'create']);
});
