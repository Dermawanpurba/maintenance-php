<?php

use App\Http\Controllers\Api\MaintenanceController;
use Illuminate\Support\Facades\Route;

// === WOSYS ERP - LARAVEL 13 BACKEND + SINGLE PAGE APPLICATION (SPA) ===

// 1. Direct Web API Router Endpoints (Anti-405 Fallbacks)
Route::match(['get', 'post'], '/router', [MaintenanceController::class, 'router']);
Route::match(['get', 'post'], '/maintenance/router', [MaintenanceController::class, 'router']);
Route::match(['get', 'post'], '/maintenance', [MaintenanceController::class, 'router']);
Route::match(['get', 'post'], '/login', [MaintenanceController::class, 'router']);
Route::post('/', [MaintenanceController::class, 'router']);

// 2. Wildcard SPA Route (GET)
Route::get('/{any?}', function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath, [
            'Content-Type' => 'text/html; charset=UTF-8',
        ]);
    }
    return response('Frontend tidak ditemukan di folder public.', 404);
})->where('any', '.*');
