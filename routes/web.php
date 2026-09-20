<?php

use App\Http\Controllers\Api\MaintenanceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// === WOSYS ERP - LARAVEL 13 BACKEND + SINGLE PAGE APPLICATION (SPA) ===

// 1. Direct Web API Router Endpoints (Anti-405 Fallbacks)
Route::match(['get', 'post', 'options'], '/api/maintenance/router', [MaintenanceController::class, 'router']);
Route::match(['get', 'post', 'options'], '/api/maintenance', [MaintenanceController::class, 'router']);
Route::match(['get', 'post', 'options'], '/api/router', [MaintenanceController::class, 'router']);
Route::match(['get', 'post', 'options'], '/api/login', [MaintenanceController::class, 'router']);
Route::match(['get', 'post', 'options'], '/router', [MaintenanceController::class, 'router']);
Route::match(['get', 'post', 'options'], '/maintenance/router', [MaintenanceController::class, 'router']);
Route::match(['get', 'post', 'options'], '/maintenance', [MaintenanceController::class, 'router']);
Route::match(['get', 'post', 'options'], '/login', [MaintenanceController::class, 'router']);
Route::match(['get', 'post', 'options'], '/', function (Request $request) {
    if ($request->isMethod('post')) {
        return app(MaintenanceController::class)->router($request);
    }
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath, [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0'
        ]);
    }
    return response('Frontend tidak ditemukan di folder public.', 404);
});

// 2. Wildcard SPA & API Fallback Route (Anti-405 Guarantee)
Route::match(['get', 'post', 'options'], '/{any?}', function (Request $request) {
    if ($request->isMethod('options')) {
        return response('', 204)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');
    }

    if ($request->isMethod('post')) {
        return app(MaintenanceController::class)->router($request);
    }

    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath, [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0'
        ]);
    }
    return response('Frontend tidak ditemukan di folder public.', 404);
})->where('any', '^(?!admin).*$');
