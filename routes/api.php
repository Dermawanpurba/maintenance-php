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
    Route::get('/ping', fn () => response()->json([
        'success' => true,
        'message' => 'API OK',
        'version' => 'maintenance-v1-laravel13',
        'commit' => 'diagnostic-v1',
        'server_time' => now()->toIso8601String(),
    ]));
    Route::get('/diagnostic-log', function () {
        $logFile = storage_path('logs/laravel.log');
        $lines = file_exists($logFile) ? file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
        $errorLines = array_values(array_filter($lines, fn ($l) => str_contains($l, '.ERROR:')));
        $lastErrors = array_slice($errorLines, -10);
        $users = \App\Models\User::all(['id', 'username', 'email', 'role', 'status'])->toArray();
        
        $tableStats = [];
        try {
            $tables = \Illuminate\Support\Facades\DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
            foreach ($tables as $t) {
                $tName = $t->name;
                try {
                    $tableStats[$tName] = \Illuminate\Support\Facades\DB::table($tName)->count();
                } catch (\Throwable $e) {
                    $tableStats[$tName] = 'error: ' . $e->getMessage();
                }
            }
        } catch (\Throwable $e) {
            $tableStats = ['error' => $e->getMessage()];
        }

        return response()->json([
            'last_errors' => $lastErrors,
            'total_errors' => count($errorLines),
            'users' => $users,
            'tables' => $tableStats,
            'db_path' => config('database.connections.sqlite.database'),
        ]);
    });
    Route::match(['get', 'post'], '/db-sync', [MaintenanceController::class, 'syncDatabaseSchema']);
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

    // Scheduled Oil Sampling (SOS)
    Route::get('/oil-samples', fn () => response()->json(['success' => true, 'data' => \App\Models\OilSample::all()]));
    Route::post('/oil-samples', [MaintenanceController::class, 'saveOilSample']);
    Route::delete('/oil-samples/{id}', [MaintenanceController::class, 'deleteOilSample']);

    // Basic Maintenance / PM Records
    Route::get('/pm-records', fn () => response()->json(['success' => true, 'data' => \App\Models\PmRecord::orderByDesc('id')->get()]));
    Route::post('/pm-records', [MaintenanceController::class, 'savePMRecord']);
    Route::delete('/pm-records/{id}', [MaintenanceController::class, 'deletePMRecord']);

    // Maintenance Weeks (Period Database)
    Route::get('/maintenance-weeks', fn () => response()->json(['success' => true, 'data' => \App\Models\MaintenanceWeek::orderBy('id')->get()]));
    Route::post('/maintenance-weeks', [MaintenanceController::class, 'saveMaintenanceWeek']);
    Route::delete('/maintenance-weeks/{id}', [MaintenanceController::class, 'deleteMaintenanceWeek']);

    // 1-Click .ZIP System Backup
    Route::get('/backup/download', [\App\Http\Controllers\Api\BackupController::class, 'downloadZip']);

    // Target Jam Operasi (Plan Alat)
    Route::get('/target-jam-operasi', fn () => response()->json([
        'success' => true,
        'data'    => \App\Models\TargetJamOperasi::orderBy('section')->orderBy('equip_no')->get()
    ]));
    Route::post('/target-jam-operasi', [\App\Http\Controllers\Api\MaintenanceController::class, 'savePlanAlatRow']);
    Route::delete('/target-jam-operasi/{id}', [\App\Http\Controllers\Api\MaintenanceController::class, 'deletePlanAlatRow']);

    Route::get('/target-jam-harian', fn () => response()->json([
        'success' => true,
        'data'    => \App\Models\TargetJamHarian::all()
    ]));
    Route::post('/target-jam-harian', [\App\Http\Controllers\Api\MaintenanceController::class, 'saveJamHarian']);
    Route::post('/target-jam-operasi/seed-demo', fn (\Illuminate\Http\Request $req) => response()->json(app(\App\Http\Controllers\Api\MaintenanceController::class)->seedDemoTargetJam($req->all())));

    // Master Database Part Service (DT, EXCA, DOZER, GREDER - PS 250, 500, 1000, 2000)
    Route::get('/part-services', fn (\Illuminate\Http\Request $req) => response()->json(app(\App\Http\Controllers\Api\MaintenanceController::class)->getPartServices($req->all())));
    Route::post('/part-services', fn (\Illuminate\Http\Request $req) => response()->json(app(\App\Http\Controllers\Api\MaintenanceController::class)->savePartService($req->all())));
    Route::delete('/part-services/{id}', fn ($id) => response()->json(app(\App\Http\Controllers\Api\MaintenanceController::class)->deletePartService(['id' => $id])));
    Route::post('/part-services/seed-default', fn () => response()->json(app(\App\Http\Controllers\Api\MaintenanceController::class)->seedPartServices()));
});

// 1-Click .ZIP System Backup Global Route
Route::get('/backup/download', [\App\Http\Controllers\Api\BackupController::class, 'downloadZip']);

// Fallback direct root router for convenience
Route::match(['get', 'post'], '/router', [MaintenanceController::class, 'router']);
Route::match(['get', 'post'], '/gas-router', [MaintenanceController::class, 'router']);
