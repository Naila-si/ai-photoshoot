<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\PhotoshootController;

Route::get('/health', HealthController::class);
Route::post('/photoshoots', [PhotoshootController::class, 'store']);
