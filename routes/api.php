<?php

use App\Http\Controllers\Api\MaintenanceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// === MAINTENANCE MANAGEMENT SYSTEM (WOSYS ERP - PROFESSIONAL) API ===

Route::prefix('maintenance')->group(function () {
    // 1. Unified Router for fetchGAS / sendGAS compatible calls
    Route::match(['get', 'post'], '/router', [MaintenanceController::class, 'router']);
    Route::match(['get', 'post'], '/gas-router', [MaintenanceController::class, 'router']);
    Route::post('/', [MaintenanceController::class, 'router']);

    // 2. Direct REST Endpoints
    Route::get('/ping', fn () => response()->json(['success' => true, 'message' => 'API OK', 'version' => 'maintenance-v1-laravel13']));
    Route::get('/optimized-data', [MaintenanceController::class, 'getOptimizedData']);
    Route::post('/login', [MaintenanceController::class, 'loginUser']);
    
    // Work Orders
    Route::get('/work-orders', fn () => response()->json(['success' => true, 'data' => \App\Models\WorkOrder::all()]));
    Route::post('/work-orders', [MaintenanceController::class, 'saveWorkOrder']);
    Route::delete('/work-orders/{no_wo}', [MaintenanceController::class, 'deleteWO']);

    // Backlogs
    Route::get('/backlogs', fn () => response()->json(['success' => true, 'data' => \App\Models\Backlog::all()]));
    Route::post('/backlogs', [MaintenanceController::class, 'saveBacklog']);
    Route::delete('/backlogs/{id}', [MaintenanceController::class, 'deleteBacklog']);

    // Daily HM
    Route::get('/daily-hm', fn () => response()->json(['success' => true, 'data' => \App\Models\DailyHm::all()]));
    Route::post('/daily-hm', [MaintenanceController::class, 'saveDailyHM']);

    // Master Equip & Parts
    Route::get('/master-equip', fn () => response()->json(['success' => true, 'data' => \App\Models\MasterEquip::all()]));
    Route::get('/master-parts', fn () => response()->json(['success' => true, 'data' => \App\Models\MasterPart::all()]));
    Route::get('/stocks', fn () => response()->json(['success' => true, 'data' => \App\Models\Stock::all()]));

    // 1-Click .ZIP System Backup
    Route::get('/backup/download', [\App\Http\Controllers\Api\BackupController::class, 'downloadZip']);
});

// 1-Click .ZIP System Backup Global Route
Route::get('/backup/download', [\App\Http\Controllers\Api\BackupController::class, 'downloadZip']);

// Fallback direct root router for convenience
Route::match(['get', 'post'], '/router', [MaintenanceController::class, 'router']);
Route::match(['get', 'post'], '/gas-router', [MaintenanceController::class, 'router']);
