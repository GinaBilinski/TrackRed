<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BloodValueDefinitionController;
use App\Http\Controllers\BloodTestController;
use App\Http\Controllers\BloodValueOverviewController;

Route::get('/blutwerte', [BloodValueDefinitionController::class, 'index']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/blood-tests', [BloodTestController::class, 'index']);
    Route::post('/blood-tests', [BloodTestController::class, 'store']);
    Route::get('/werte-uebersicht', [BloodValueOverviewController::class, 'index']);
    Route::delete('/blood-tests/{id}', [BloodTestController::class, 'destroy']);
});

