<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\UserAccess;
use App\Models\PlanAlat;
use App\Models\PlanService;
use App\Models\MasterEquip;
use App\Models\MasterPart;
use App\Models\Stock;
use App\Models\MasterComponent;
use App\Models\MasterMekanik;
use App\Models\MasterPelapor;
use App\Models\WorkOrder;
use App\Models\Backlog;
use App\Models\DailyHm;
use App\Models\MechanicActivity;
use App\Models\ServiceHistory;
use App\Models\Inspection;
use App\Models\PcrComponent;
use App\Models\PmRecord;
use App\Models\MonthlyBudget;
use App\Models\EquipmentCost;
use App\Models\FailureAnalysis;
use App\Models\SwabComponent;
use App\Models\MeetingNote;
use App\Models\MasterTool;
use App\Models\Setting;
use App\Models\SystemLog;
use App\Models\OilSample;
use App\Models\MaintenanceWeek;
use App\Models\PpuRecord;
use App\Models\TargetJamOperasi;
use App\Models\TargetJamHarian;

class MaintenanceController extends Controller
{
    /**
     * Unified router compatible with GAS doPost / router(action, data)
     */
    public function router(Request $request)
    {
        $action = $request->input('action', '');
        $data = $request->input('data', []);

        if (empty($action)) {
            $raw = json_decode($request->getContent(), true);
            if (is_array($raw)) {
                $action = $raw['action'] ?? $request->input('action', '');
                $data = $raw['data'] ?? $request->input('data', []);
            }
        }

        if (is_string($data)) {
            $decoded = json_decode($data, true);
            if (is_array($decoded)) {
                $data = $decoded;
            }
        }

        if (empty($data) || !is_array($data)) {
            $data = $request->except(['action']);
        } else {
            $data = array_merge($request->except(['action', 'data']), $data);
        }

        try {
            // Guarantee database schema integrity on every single API request
            $this->ensureDatabaseIntegrity();

            switch ($action) {
                case 'ping':
                    return response()->json(['success' => true, 'message' => 'API OK', 'version' => 'maintenance-v1-laravel13']);

                case 'getOptimizedData':
                    return response()->json($this->getOptimizedData());

                case 'syncDatabase':
                    return response()->json($this->syncDatabaseSchema());

                case 'login':
                    return response()->json($this->loginUser($data));

                case 'getSettings':
                    return response()->json(['success' => true, 'settings' => $this->getSettingsArray()]);

                case 'saveSettings':
                    return response()->json($this->saveSettings($data));

                case 'getUsersList':
                    $allUsers = User::all();
                    return response()->json(['success' => true, 'users' => $allUsers, 'data' => $allUsers]);

                case 'saveUser':
                    return response()->json($this->saveUser($data));

                case 'approveUser':
                    return response()->json($this->approveUser($data));

                case 'deleteUser':
                    return response()->json($this->deleteUser($data));

                case 'getUserAccess':
                    return response()->json($this->getUserAccess($data));

                case 'saveUserAccess':
                    return response()->json($this->saveUserAccess($data));

                case 'deleteUserAccess':
                    return response()->json($this->deleteUserAccess($data));

                case 'getAllUserAccess':
                    return response()->json(['success' => true, 'access' => UserAccess::all()]);

                case 'saveStock':
                    $data['type'] = 'part';
                    return response()->json($this->saveMaster($data));

                case 'getSystemLogs':
                    return response()->json(['success' => true, 'logs' => SystemLog::orderByDesc('id')->limit(100)->get()]);

                // Work Orders
                case 'saveWorkOrder':
                    return response()->json($this->saveWorkOrder($data));

                case 'updateWOStatus':
                    return response()->json($this->updateWOStatus($data));

                case 'deleteWO':
                    return response()->json($this->deleteWO($data));

                // Backlog
                case 'saveBacklog':
                    return response()->json($this->saveBacklog($data));

                case 'updateBacklogStatus':
                    return response()->json($this->updateBacklogStatus($data));

                case 'deleteBacklog':
                    return response()->json($this->deleteBacklog($data));

                // Daily HM
                case 'saveDailyHM':
                    return response()->json($this->saveDailyHM($data));

                case 'deleteDailyHM':
                    return response()->json($this->deleteDailyHM($data));

                // Activity Log
                case 'saveActivityLog':
                    return response()->json($this->saveActivityLog($data));

                case 'deleteActivity':
                    return response()->json($this->deleteActivity($data));

                // Service History
                case 'saveServiceHistory':
                    return response()->json($this->saveServiceHistory($data));

                case 'deleteServiceHistory':
                    return response()->json($this->deleteServiceHistory($data));

                // Master Data
                case 'saveMaster':
                    return response()->json($this->saveMaster($data));

                case 'deleteMasterEquip':
                    return response()->json($this->deleteMasterEquip($data));

                case 'deletePlan':
                    return response()->json($this->deletePlan($data));

                case 'deleteStock':
                case 'deleteMasterPart':
                case 'deletePart':
                    return response()->json($this->deletePart($data));

                case 'deleteMasterComponent':
                case 'deleteComponent':
                    return response()->json($this->deleteComponent($data));

                case 'saveMasterTool':
                    return response()->json($this->saveMasterTool($data));

                case 'updateToolBorrowStatus':
                    return response()->json($this->updateToolBorrowStatus($data));

                case 'deleteMasterTool':
                    return response()->json($this->deleteMasterTool($data));

                case 'saveMekanik':
                    return response()->json($this->saveMekanik($data));

                case 'deleteMekanik':
                    return response()->json($this->deleteMekanik($data));

                case 'savePelapor':
                    return response()->json($this->savePelapor($data));

                case 'deletePelapor':
                    return response()->json($this->deletePelapor($data));

                // Inspection
                case 'saveInspection':
                    return response()->json($this->saveInspection($data));

                case 'deleteInspection':
                    return response()->json($this->deleteInspection($data));

                // PCR Components
                case 'savePCR':
                    return response()->json($this->savePCR($data));

                case 'deletePCR':
                    return response()->json($this->deletePCR($data));

                // Basic Maintenance / PM Records
                case 'savePMRecord':
                case 'saveBasicMaintenance':
                    return response()->json($this->savePMRecord($data));

                case 'deletePMRecord':
                case 'deleteBasicMaintenance':
                    return response()->json($this->deletePMRecord($data));

                // Maintenance Weeks (Period Database)
                case 'getMaintenanceWeeks':
                    return response()->json(['success' => true, 'weeks' => MaintenanceWeek::orderBy('id', 'asc')->get()]);

                case 'saveMaintenanceWeek':
                    return response()->json($this->saveMaintenanceWeek($data));

                case 'deleteMaintenanceWeek':
                    return response()->json($this->deleteMaintenanceWeek($data));

                // Budget & Cost
                case 'saveMonthlyBudget':
                    return response()->json($this->saveMonthlyBudget($data));

                case 'deleteMonthlyBudget':
                    return response()->json($this->deleteMonthlyBudget($data));

                case 'saveEquipmentCost':
                    return response()->json($this->saveEquipmentCost($data));

                case 'deleteEquipmentCost':
                    return response()->json($this->deleteEquipmentCost($data));

                // FAR
                case 'saveFAR':
                    return response()->json($this->saveFAR($data));

                case 'deleteFAR':
                    return response()->json($this->deleteFAR($data));

                // Swab
                case 'saveSwabComponent':
                    return response()->json($this->saveSwabComponent($data));

                case 'updateSwabStatus':
                    return response()->json($this->updateSwabStatus($data));

                case 'deleteSwabComponent':
                    return response()->json($this->deleteSwabComponent($data));

                // Meeting Notes
                case 'saveMeetingNotes':
                    return response()->json($this->saveMeetingNotes($data));

                case 'deleteMeetingNotes':
                    return response()->json($this->deleteMeetingNotes($data));

                // Scheduled Oil Sampling (SOS)
                case 'getOilSamples':
                    return response()->json(['success' => true, 'data' => OilSample::orderByDesc('id')->get()]);

                case 'saveOilSample':
                    return response()->json($this->saveOilSample($data));

                case 'deleteOilSample':
                    return response()->json($this->deleteOilSample($data));

                // PPU — Program Pemeriksaan Undercarriage
                case 'getPpuRecords':
                    return response()->json(['success' => true, 'data' => PpuRecord::orderByDesc('id')->get()]);

                case 'savePpuRecord':
                    return response()->json($this->savePpuRecord($data));

                case 'deletePpuRecord':
                    return response()->json($this->deletePpuRecord($data));

                // Target Jam Operasi (Plan Alat)
                case 'getTargetJamOperasi':
                    return response()->json($this->getTargetJamOperasi($data));

                case 'savePlanAlatRow':
                    return response()->json($this->savePlanAlatRow($data));

                case 'deletePlanAlatRow':
                    return response()->json($this->deletePlanAlatRow($data));

                case 'saveJamHarian':
                    return response()->json($this->saveJamHarian($data));

                case 'deleteJamHarian':
                    return response()->json($this->deleteJamHarian($data));

                case 'bulkSaveJamHarian':
                    return response()->json($this->bulkSaveJamHarian($data));

                case 'seedDemoTargetJam':
                    return response()->json($this->seedDemoTargetJam($data));

                default:
                    return response()->json(['success' => false, 'message' => "Action '{$action}' tidak dikenal"]);
            }
        } catch (\Throwable $e) {
            $this->logAction('Error_' . $action, $e->getMessage(), 'SYSTEM');
            return response()->json(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    /**
     * Map dataset rows to include id matching item_id
     */
    private function mapRecords($collection)
    {
        return $collection->map(function ($item) {
            $arr = $item->toArray();
            if (isset($arr['item_id']) && !empty($arr['item_id'])) {
                $arr['id'] = $arr['item_id'];
            }
            return $arr;
        })->values()->all();
    }

    private function getSettingsArray()
    {
        $settings = Setting::all();
        $settingsObj = [];
        foreach ($settings as $s) {
            $settingsObj[$s->key] = $s->value;
        }
        return $settingsObj;
    }

    /**
     * Resilient database query helper that prevents one sub-module failure from crashing the whole payload
     */
    private function safelyFetch(callable $callback, $fallback = [])
    {
        try {
            return $callback();
        } catch (\Throwable $e) {
            Log::warning('Resilient fetch fallback invoked: ' . $e->getMessage());
            return $fallback;
        }
    }

    /**
     * Self-healing SQLite schema: verifies all essential tables and columns exist,
     * running automated migrations and seeding if any disparity is detected.
     */
    public function ensureDatabaseIntegrity()
    {
        static $checked = false;
        if ($checked) return;

        // 1. Coba migrasi resmi via Artisan migrate
        try {
            Artisan::call('migrate', ['--force' => true, '--no-interaction' => true]);
        } catch (\Throwable $e) {
            Log::warning('Artisan migrate notice in ensureDatabaseIntegrity: ' . $e->getMessage());
        }

        // 2. Direct DDL Fail-safe: pastikan seluruh tabel baru ada di SQLite
        // (Sangat penting jika persistent volume Docker menimpa folder database/migrations)
        try {
            if (!Schema::hasTable('target_jam_operasi')) {
                Schema::create('target_jam_operasi', function (Blueprint $table) {
                    $table->id();
                    $table->text('equip_no')->nullable();
                    $table->text('section')->nullable()->default('MINING');
                    $table->text('model')->nullable();
                    $table->double('est_hm')->nullable()->default(0);
                    $table->text('est_hm_date')->nullable()->default('01-Sep-26');
                    $table->text('status')->nullable()->default('RFU');
                    $table->double('next_service_hours_due')->nullable()->default(0);
                    $table->double('next_service_type_hm')->nullable()->default(250);
                    $table->text('next_service_type')->nullable()->default('PS-250');
                    $table->text('next_service_date')->nullable();
                    $table->double('next_service_hours_due_2')->nullable()->default(0);
                    $table->text('next_service_type_2')->nullable()->default('PS-500');
                    $table->text('next_service_date_2')->nullable();
                    $table->integer('pm_250')->nullable()->default(0);
                    $table->integer('pm_500')->nullable()->default(0);
                    $table->integer('pm_1000')->nullable()->default(0);
                    $table->integer('pm_2000')->nullable()->default(0);
                    $table->integer('pm_4000')->nullable()->default(0);
                    $table->integer('pm_other')->nullable()->default(0);
                    $table->double('downtime_pm')->nullable()->default(0);
                    $table->double('downtime_backlog')->nullable()->default(0);
                    $table->double('downtime_midlife')->nullable()->default(0);
                    $table->double('downtime_pcr')->nullable()->default(0);
                    $table->integer('ba_gg')->nullable()->default(0);
                    $table->integer('oil_fe')->nullable()->default(0);
                    $table->integer('pos')->nullable()->default(0);
                    $table->integer('plan_year')->nullable()->default(2026);
                    $table->integer('plan_month')->nullable()->default(9);
                    $table->timestamps();
                });
            }

            if (!Schema::hasTable('target_jam_harian')) {
                Schema::create('target_jam_harian', function (Blueprint $table) {
                    $table->id();
                    $table->text('equip_no')->nullable();
                    $table->integer('plan_year')->nullable()->default(2026);
                    $table->integer('plan_month')->nullable()->default(9);
                    $table->integer('plan_day')->nullable()->default(1);
                    $table->double('jam_rencana')->nullable()->default(0);
                    $table->text('downtime_type')->nullable()->default('PM');
                    $table->timestamps();
                });
            }

            if (!Schema::hasTable('oil_samples')) {
                Schema::create('oil_samples', function (Blueprint $table) {
                    $table->id();
                    $table->string('item_id')->nullable()->index();
                    $table->string('sample_code')->nullable();
                    $table->string('equip_no')->nullable()->index();
                    $table->string('compartment')->nullable();
                    $table->string('sample_date')->nullable();
                    $table->double('hm')->nullable()->default(0);
                    $table->string('oil_grade')->nullable();
                    $table->string('rating', 5)->nullable()->default('A');
                    $table->double('top_up')->nullable()->default(0);
                    $table->text('repair_notes')->nullable();
                    $table->double('si')->nullable()->default(0);
                    $table->double('al')->nullable()->default(0);
                    $table->double('na')->nullable()->default(0);
                    $table->double('fe')->nullable()->default(0);
                    $table->double('cu')->nullable()->default(0);
                    $table->double('cr')->nullable()->default(0);
                    $table->double('pb')->nullable()->default(0);
                    $table->double('pq')->nullable()->default(0);
                    $table->double('visc_100')->nullable()->default(0);
                    $table->double('oxi')->nullable()->default(0);
                    $table->double('soot')->nullable()->default(0);
                    $table->double('tbn')->nullable()->default(0);
                    $table->double('iso_6')->nullable()->default(0);
                    $table->double('iso_14')->nullable()->default(0);
                    $table->double('water_pct')->nullable()->default(0);
                    $table->longText('interpretation')->nullable();
                    $table->string('lab_vendor')->nullable()->default('Caterpillar SOS Lab');
                    $table->string('status')->nullable()->default('APPROVED');
                    $table->string('created_by')->nullable()->default('Planner SOS');
                    $table->timestamps();
                });
            }

            if (!Schema::hasTable('maintenance_weeks')) {
                Schema::create('maintenance_weeks', function (Blueprint $table) {
                    $table->id();
                    $table->string('week_no')->unique()->index();
                    $table->string('label')->nullable();
                    $table->date('start_date')->nullable();
                    $table->date('end_date')->nullable();
                    $table->boolean('is_active')->default(false);
                    $table->integer('target_compliance')->default(100);
                    $table->text('notes')->nullable();
                    $table->timestamps();
                });
            }

            if (!Schema::hasTable('ppu_records')) {
                Schema::create('ppu_records', function (Blueprint $table) {
                    $table->id();
                    $table->string('unit_no')->nullable()->index();
                    $table->string('model')->nullable();
                    $table->string('track_group_used')->nullable();
                    $table->string('cts_date')->nullable();
                    $table->string('last_fitted_track_group')->nullable();
                    $table->double('pct_hours_track')->nullable()->default(0);
                    $table->double('hours_track_gp')->nullable()->default(0);
                    $table->double('smu')->nullable()->default(0);
                    $table->double('sprocket_lh')->nullable()->default(0);
                    $table->double('sprocket_rh')->nullable()->default(0);
                    $table->double('link_height_lh')->nullable()->default(0);
                    $table->double('link_height_rh')->nullable()->default(0);
                    $table->double('chain_bushing_lh')->nullable()->default(0);
                    $table->double('chain_bushing_rh')->nullable()->default(0);
                    $table->double('frame_ext_lh')->nullable()->default(0);
                    $table->double('frame_ext_rh')->nullable()->default(0);
                    $table->double('grouser_height_lh')->nullable()->default(0);
                    $table->double('grouser_height_rh')->nullable()->default(0);
                    $table->double('idler_front_lh')->nullable()->default(0);
                    $table->double('idler_front_rh')->nullable()->default(0);
                    $table->double('idler_rear_lh')->nullable()->default(0);
                    $table->double('idler_rear_rh')->nullable()->default(0);
                    $table->string('inspection_date')->nullable();
                    $table->string('inspector')->nullable();
                    $table->text('notes')->nullable();
                    $table->string('status')->nullable()->default('NORMAL');
                    $table->string('created_by')->nullable()->default('Planner');
                    $table->timestamps();
                });
            }
        } catch (\Throwable $e) {
            Log::error('Direct DDL schema creation error: ' . $e->getMessage());
        }

        // 3. Pastikan kolom-kolom baru tersedia di seluruh tabel SQLite
        try {
            if (Schema::hasTable('target_jam_operasi')) {
                $cols = [
                    'est_hm_date'              => ['text', '01-Sep-26'],
                    'next_service_hours_due_2' => ['double', 0],
                    'next_service_type_2'      => ['text', 'PS-500'],
                    'next_service_date_2'      => ['text', null],
                    'pm_4000'                  => ['integer', 0],
                    'downtime_pm'              => ['double', 0],
                    'downtime_backlog'         => ['double', 0],
                    'downtime_midlife'         => ['double', 0],
                    'downtime_pcr'             => ['double', 0],
                ];
                foreach ($cols as $col => [$type, $default]) {
                    if (!Schema::hasColumn('target_jam_operasi', $col)) {
                        Schema::table('target_jam_operasi', function (Blueprint $table) use ($col, $type, $default) {
                            if ($type === 'double') $table->double($col)->nullable()->default($default);
                            elseif ($type === 'integer') $table->integer($col)->nullable()->default($default);
                            else $table->text($col)->nullable()->default($default);
                        });
                    }
                }
            }

            if (Schema::hasTable('target_jam_harian') && !Schema::hasColumn('target_jam_harian', 'downtime_type')) {
                Schema::table('target_jam_harian', function (Blueprint $table) {
                    $table->text('downtime_type')->nullable()->default('PM');
                });
            }

            if (Schema::hasTable('master_equips') && !Schema::hasColumn('master_equips', 'last_hm')) {
                Schema::table('master_equips', function (Blueprint $table) {
                    $table->double('last_hm')->nullable()->default(0);
                });
            }

            if (Schema::hasTable('pcr_components') && !Schema::hasColumn('pcr_components', 'install_hm')) {
                Schema::table('pcr_components', function (Blueprint $table) {
                    $table->double('install_hm')->nullable()->default(0);
                });
            }

            if (Schema::hasTable('app_users') && !Schema::hasColumn('app_users', 'email')) {
                Schema::table('app_users', function (Blueprint $table) {
                    $table->text('email')->nullable();
                });
            }

            if (Schema::hasTable('pm_records')) {
                if (!Schema::hasColumn('pm_records', 'week_no')) {
                    Schema::table('pm_records', function (Blueprint $table) {
                        $table->string('week_no')->nullable()->default('WEEK 40');
                    });
                }
                if (!Schema::hasColumn('pm_records', 'achievement_pct')) {
                    Schema::table('pm_records', function (Blueprint $table) {
                        $table->double('achievement_pct')->nullable()->default(100);
                    });
                }
                if (!Schema::hasColumn('pm_records', 'checklist_json')) {
                    Schema::table('pm_records', function (Blueprint $table) {
                        $table->longText('checklist_json')->nullable();
                    });
                }
            }
        } catch (\Throwable $e) {
            Log::warning('Column self-healing warning: ' . $e->getMessage());
        }

        // 4. Seeder aman jika tabel baru kosong
        try {
            if (class_exists(\Database\Seeders\OilSampleSeeder::class) && Schema::hasTable('oil_samples') && OilSample::count() === 0) {
                Artisan::call('db:seed', ['--class' => 'Database\\Seeders\\OilSampleSeeder', '--force' => true]);
            }
            if (class_exists(\Database\Seeders\BasicMaintenanceHistoricalSeeder::class) && Schema::hasTable('maintenance_weeks') && MaintenanceWeek::count() === 0) {
                Artisan::call('db:seed', ['--class' => 'Database\\Seeders\\BasicMaintenanceHistoricalSeeder', '--force' => true]);
            }
        } catch (\Throwable $e) {
            Log::warning('Seeder execution warning: ' . $e->getMessage());
        }

        // 5. Pastikan MasterEquip.last_hm dan TargetJamOperasi.est_hm sinkron dari catatan Daily HM & Fuel terbaru
        try {
            if (Schema::hasTable('daily_hms')) {
                if (Schema::hasTable('master_equips')) {
                    $equips = MasterEquip::all();
                    foreach ($equips as $eq) {
                        $no = $eq->equip_no ?? $eq->no_unit;
                        $latest = DailyHm::where(function($q) use ($no) {
                            $q->where('equip_no', $no)
                              ->orWhere('equip_no', str_replace('-', ' ', $no))
                              ->orWhere('equip_no', str_replace(' ', '-', $no));
                        })->orderByDesc('tanggal')->orderByDesc('id')->first();

                        if ($latest && ($latest->hm_akhir > 0 || $latest->hm_awal > 0)) {
                            $hm = floatval($latest->hm_akhir ?: $latest->hm_awal);
                            if (floatval($eq->last_hm ?? 0) != $hm) {
                                $eq->update(['last_hm' => $hm]);
                            }
                        }
                    }
                }

                if (Schema::hasTable('target_jam_operasi')) {
                    $targetRows = TargetJamOperasi::where('est_hm', '<=', 0)->orWhereNull('est_hm')->get();
                    foreach ($targetRows as $tr) {
                        $no = $tr->equip_no;
                        $latest = DailyHm::where(function($q) use ($no) {
                            $q->where('equip_no', $no)
                              ->orWhere('equip_no', str_replace('-', ' ', $no))
                              ->orWhere('equip_no', str_replace(' ', '-', $no));
                        })->orderByDesc('tanggal')->orderByDesc('id')->first();

                        if ($latest && ($latest->hm_akhir > 0 || $latest->hm_awal > 0)) {
                            $hm = floatval($latest->hm_akhir ?: $latest->hm_awal);
                            $due1 = ceil(($hm + 1) / 250) * 250;
                            $due2 = $due1 + 250;
                            $calcType = function($due) {
                                if ($due % 4000 === 0) return '4000';
                                if ($due % 2000 === 0) return '2000';
                                if ($due % 1000 === 0) return '1000';
                                if ($due % 500 === 0) return '500';
                                return '250';
                            };
                            $tr->update([
                                'est_hm'                   => $hm,
                                'next_service_hours_due'   => $due1,
                                'next_service_hours_due_2' => $due2,
                                'next_service_type'        => $calcType($due1),
                                'next_service_type_2'      => $calcType($due2),
                            ]);
                        }
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::warning('Sync DailyHm to MasterEquip and TargetJamOperasi notice: ' . $e->getMessage());
        }

        $checked = true;
    }

    /**
     * Manual / diagnostic endpoint to force-run migrations, verify tables, and return complete status
     */
    public function syncDatabaseSchema()
    {
        try {
            $this->ensureDatabaseIntegrity();
            Artisan::call('migrate', ['--force' => true, '--no-interaction' => true]);
            $migrateOutput = trim(Artisan::output());

            // Run seeders if tables are empty
            $seeded = [];
            if (Schema::hasTable('oil_samples') && OilSample::count() === 0) {
                Artisan::call('db:seed', ['--class' => 'Database\\Seeders\\OilSampleSeeder', '--force' => true]);
                $seeded[] = 'OilSampleSeeder';
            }
            if (Schema::hasTable('maintenance_weeks') && MaintenanceWeek::count() === 0) {
                Artisan::call('db:seed', ['--class' => 'Database\\Seeders\\BasicMaintenanceHistoricalSeeder', '--force' => true]);
                $seeded[] = 'BasicMaintenanceHistoricalSeeder';
            }

            // Get SQLite tables and counts
            $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
            $tableStats = [];
            foreach ($tables as $t) {
                $tName = $t->name;
                try {
                    $tableStats[$tName] = DB::table($tName)->count();
                } catch (\Throwable $e) {
                    $tableStats[$tName] = 'error: ' . $e->getMessage();
                }
            }

            return [
                'success' => true,
                'message' => 'Database schema sync completed successfully',
                'migrate_output' => $migrateOutput,
                'seeders_run' => $seeded,
                'tables' => $tableStats,
                'database_path' => config('database.connections.sqlite.database'),
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'message' => 'Database sync failed: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ];
        }
    }

    /**
     * Replicates getOptimizedData() from code.gs line 1751 with self-healing schema and resilient error isolation
     */
    public function getOptimizedData()
    {
        // 1. Auto-heal missing tables and columns if running against an unmigrated database
        $this->ensureDatabaseIntegrity();

        // 2. Build user access map safely
        $userAccessMap = $this->safelyFetch(function() {
            $accessData = UserAccess::all();
            $map = [];
            foreach ($accessData as $ua) {
                $u = strtolower(trim($ua->username));
                $f = trim($ua->feature);
                if (!empty($u) && !empty($f)) {
                    if (!isset($map[$u])) {
                        $map[$u] = [];
                    }
                    $map[$u][] = $f;
                }
            }
            return $map;
        }, []);

        $planAlat = $this->safelyFetch(fn() => $this->mapRecords(PlanAlat::all()), []);

        return [
            'success' => true,
            'equip' => $this->safelyFetch(fn() => MasterEquip::all()->map(function($eq) {
                $arr = $eq->toArray();
                $arr['no_unit'] = $arr['equip_no'] ?? ($arr['no_unit'] ?? '');
                $arr['tipe'] = $arr['unit_type'] ?? ($arr['tipe'] ?? '');
                $arr['serial_number'] = $arr['serial_no'] ?? ($arr['serial_number'] ?? '');
                $arr['lokasi'] = $arr['location'] ?? ($arr['lokasi'] ?? 'Site Plant');
                $arr['last_hm'] = $arr['last_hm'] ?? 0;
                return $arr;
            })->values()->all(), []),
            'parts' => $this->safelyFetch(fn() => MasterPart::all()->map(function($p) {
                $arr = $p->toArray();
                $arr['part_name'] = $arr['description'] ?? ($arr['part_name'] ?? '');
                $arr['unit'] = $arr['uom'] ?? ($arr['unit'] ?? 'PCS');
                $arr['stock_qty'] = $arr['stock'] ?? ($arr['stock_qty'] ?? 0);
                $arr['category'] = $arr['category_spare_part'] ?? ($arr['category'] ?? 'Fast Moving');
                return $arr;
            })->values()->all(), []),
            'stock' => $this->safelyFetch(fn() => $this->mapRecords(Stock::all()), []),
            'planAlat' => $planAlat,
            'planService' => $this->safelyFetch(fn() => $this->mapRecords(PlanService::all()), []),
            'dailyHM' => $this->safelyFetch(fn() => DailyHm::all()->map(function($h) {
                $arr = $h->toArray();
                $arr['id'] = $arr['item_id'] ?? $arr['id'];
                $arr['equip_no'] = $arr['equip_no'] ?? ($arr['no_unit'] ?? '');
                $arr['no_unit'] = $arr['equip_no'];
                $arr['hm_awal'] = floatval($arr['hm_awal'] ?? 0);
                $arr['hm_akhir'] = floatval($arr['hm_akhir'] ?? 0);
                $arr['total_hm'] = floatval($arr['total_hm'] ?? max(0, $arr['hm_akhir'] - $arr['hm_awal']));
                return $arr;
            })->values()->all(), []),
            'components' => $this->safelyFetch(fn() => $this->mapRecords(MasterComponent::all()), []),
            'usersData' => $this->safelyFetch(fn() => $this->mapRecords(User::all()), []),
            'mekanikList' => $this->safelyFetch(fn() => MasterMekanik::all()->map(function($m) {
                $arr = $m->toArray();
                $arr['id'] = $arr['item_id'] ?? $arr['id'];
                $arr['nama'] = $arr['nama_mekanik'] ?? ($arr['nama'] ?? ($arr['name'] ?? ''));
                $arr['nama_mekanik'] = $arr['nama'];
                return $arr;
            })->values()->all(), []),
            'pelaporList' => $this->safelyFetch(fn() => $this->mapRecords(MasterPelapor::all()), []),
            'activities' => $this->safelyFetch(fn() => MechanicActivity::all()->map(function($a) {
                $arr = $a->toArray();
                $arr['id'] = $arr['item_id'] ?? $arr['id'];
                return $arr;
            })->values()->all(), []),
            'wo' => $this->safelyFetch(fn() => $this->mapRecords(WorkOrder::all()), []),
            'backlog' => $this->safelyFetch(fn() => Backlog::all()->map(function($b) {
                $arr = $b->toArray();
                $arr['id'] = $arr['item_id'] ?? $arr['id'];
                $arr['equip_no'] = $arr['equip_no'] ?? ($arr['no_unit'] ?? '');
                $arr['no_unit'] = $arr['equip_no'];
                $arr['deskripsi_backlog'] = $arr['deskripsi_backlog'] ?? ($arr['deskripsi'] ?? '');
                $arr['deskripsi'] = $arr['deskripsi_backlog'];
                $arr['rencana_eksekusi'] = $arr['rencana_eksekusi'] ?? ($arr['rencana'] ?? ($arr['part_required'] ?? ''));
                $arr['rencana'] = $arr['rencana_eksekusi'];
                $arr['part_required'] = $arr['rencana_eksekusi'];
                $arr['est_hours'] = $arr['est_hours'] ?? ($arr['estimated_hours'] ?? 4);
                $arr['estimated_hours'] = $arr['est_hours'];
                $arr['status'] = strtoupper($arr['status'] ?? 'OPEN');
                return $arr;
            })->values()->all(), []),
            'serviceHistory' => $this->safelyFetch(fn() => $this->mapRecords(ServiceHistory::all()), []),
            'inspections' => $this->safelyFetch(fn() => Inspection::orderByDesc('id')->get()->map(function($insp) {
                $arr = $insp->toArray();
                $arr['id'] = $arr['item_id'] ?? $arr['id'];
                $decoded = json_decode($arr['checklist_json'] ?? '[]', true);
                if (is_array($decoded) && isset($decoded['items'])) {
                    $arr['items'] = $decoded['items'];
                    $arr['shift'] = $decoded['shift'] ?? ($arr['shift'] ?? 'Shift 1');
                    $arr['result'] = $decoded['status'] ?? ($arr['status'] ?? 'RFU');
                    $arr['status'] = $arr['result'];
                    $arr['catatan'] = $decoded['catatan'] ?? ($arr['catatan'] ?? '');
                    $arr['tipe_alat'] = $decoded['tipe_alat'] ?? ($arr['tipe_alat'] ?? '');
                    $arr['fail_count'] = $decoded['fail_count'] ?? 0;
                    $arr['warning_count'] = $decoded['warning_count'] ?? 0;
                } else {
                    $arr['items'] = is_array($decoded) ? $decoded : [];
                    $arr['result'] = $arr['status'] ?? 'RFU';
                    $arr['fail_count'] = 0;
                    $arr['warning_count'] = 0;
                }
                return $arr;
            })->values()->all(), []),
            'pcr' => $this->safelyFetch(fn() => PcrComponent::all()->map(function($p) {
                $arr = $p->toArray();
                $arr['id'] = $arr['item_id'] ?? $arr['id'];
                
                // Sinkronisasi otomatis running HM dengan Daily HM terbaru
                $equipNo = $arr['equip_no'] ?? '';
                if (!empty($equipNo)) {
                    $latestDaily = DailyHm::where('equip_no', $equipNo)
                        ->orderByDesc('tanggal')
                        ->orderByDesc('id')
                        ->value('hm_akhir');
                    $unitHm = $latestDaily ?? (MasterEquip::where('equip_no', $equipNo)->value('last_hm') ?? 0);
                    
                    if ($unitHm > 0) {
                        $installHm = floatval($arr['install_hm'] ?? 0);
                        $currentHm = $installHm > 0 ? max(0, $unitHm - $installHm) : max($unitHm, floatval($arr['current_hm'] ?? 0));
                        $target = floatval($arr['target_lifetime_hm'] ?? 10000);
                        $arr['current_hm'] = $currentHm;
                        $arr['remaining_hm'] = max(0, $target - $currentHm);
                        $arr['unit_latest_hm'] = $unitHm;
                    }
                }
                return $arr;
            })->values()->all(), []),
            'pmRecords' => $this->safelyFetch(fn() => $this->mapRecords(PmRecord::all()), []),
            'monthlyBudget' => $this->safelyFetch(fn() => MonthlyBudget::all()->map(function($b) {
                $arr = $b->toArray();
                $arr['id'] = $arr['item_id'] ?? $arr['id'];
                $arr['anggaran'] = $arr['budget_plan'] ?? 0;
                $arr['realisasi'] = $arr['actual_spent'] ?? 0;
                $arr['selisih'] = $arr['variance'] ?? 0;
                $arr['kategori'] = $arr['category'] ?? '';
                $arr['keterangan'] = $arr['notes'] ?? '';
                return $arr;
            })->values()->all(), []),
            'equipmentCosts' => $this->safelyFetch(fn() => $this->mapRecords(EquipmentCost::all()), []),
            'equipmentProductivity' => [],
            'farRecords' => $this->safelyFetch(fn() => FailureAnalysis::all()->map(function($f) {
                $arr = $f->toArray();
                $rawId = $arr['item_id'] ?? $arr['id'];
                $arr['id'] = $rawId;
                $arr['far_number'] = str_starts_with((string)$rawId, 'FAR-') ? $rawId : "FAR-{$rawId}";
                $arr['component'] = $arr['component_name'] ?? ($arr['component'] ?? '');
                $arr['damage_part'] = $arr['component'];
                $arr['component_name'] = $arr['component'];
                $arr['no_unit'] = $arr['equip_no'] ?? ($arr['no_unit'] ?? '');
                
                // Ekstrak root cause dari five_why_json atau chronology
                $rootCause = '';
                if (!empty($arr['five_why_json'])) {
                    $decoded = is_string($arr['five_why_json']) ? json_decode($arr['five_why_json'], true) : $arr['five_why_json'];
                    if (is_array($decoded)) {
                        $nonEmpty = array_values(array_filter($decoded, fn($w) => !empty(trim((string)$w))));
                        if (!empty($nonEmpty)) {
                            $rootCause = end($nonEmpty);
                        }
                    }
                }
                $arr['root_cause'] = $rootCause ?: ($arr['chronology'] ?? '-');
                $arr['pic'] = $arr['lead_investigator'] ?? ($arr['pic'] ?? ($arr['leader'] ?? '-'));
                return $arr;
            })->values()->all(), []),
            'swabComponents' => $this->safelyFetch(fn() => SwabComponent::all()->map(function($s) {
                $arr = $s->toArray();
                $arr['id'] = $arr['item_id'] ?? $arr['id'];
                $arr['recipient_unit'] = $arr['target_unit'] ?? ($arr['recipient_unit'] ?? '');
                $arr['target_unit'] = $arr['recipient_unit'];
                $arr['pic'] = $arr['authorized_by'] ?? ($arr['mechanic'] ?? ($arr['pic'] ?? '-'));
                $arr['authorized_by'] = $arr['pic'];
                return $arr;
            })->values()->all(), []),
            'meetingNotes' => $this->safelyFetch(fn() => MeetingNote::all()->map(function($m) {
                $arr = $m->toArray();
                $arr['id'] = $arr['item_id'] ?? $arr['id'];
                $arr['title'] = $arr['topic'] ?? ($arr['title'] ?? '');
                $arr['agenda'] = $arr['discussion_summary'] ?? ($arr['agenda'] ?? '');
                $arr['decision'] = $arr['management_decision'] ?? ($arr['decision'] ?? '');
                $arr['pic'] = $arr['leader'] ?? ($arr['pic'] ?? '');
                return $arr;
            })->values()->all(), []),
            'masterTools' => $this->safelyFetch(fn() => $this->mapRecords(MasterTool::all()), []),
            'userAccess' => $userAccessMap,
            'settings' => $this->getSettingsArray(),
            'planHours' => $planAlat,
            'oilSamples' => $this->safelyFetch(fn() => $this->mapRecords(OilSample::orderByDesc('id')->get()), []),
            'ppuRecords' => $this->safelyFetch(fn() => PpuRecord::orderByDesc('id')->get()->toArray(), []),
            'maintenanceWeeks' => $this->safelyFetch(fn() => MaintenanceWeek::orderBy('id', 'asc')->get()->toArray(), []),
            'systemLogs' => $this->safelyFetch(fn() => $this->mapRecords(SystemLog::orderByDesc('id')->limit(50)->get()), []),
            'targetJamOperasi' => $this->safelyFetch(fn() => TargetJamOperasi::orderBy('section')->orderBy('equip_no')->get()->toArray(), []),
            'targetJamHarian' => $this->safelyFetch(fn() => TargetJamHarian::all()->toArray(), []),
        ];
    }

    private function logAction($action, $message, $user = 'SYSTEM')
    {
        try {
            SystemLog::create([
                'timestamp' => now()->format('Y-m-d H:i:s'),
                'action' => $action,
                'message' => $message,
                'user' => $user
            ]);
        } catch (\Throwable $e) {}
    }

    // ==================== AUTH & USERS ====================
    public function loginUser($data = null)
    {
        if ($data instanceof Request) {
            $data = $data->all();
        } elseif (is_null($data) || !is_array($data)) {
            $data = request()->all();
        }
        $username = trim($data['username'] ?? '');
        $password = trim($data['password'] ?? '');

        $user = User::whereRaw('LOWER(username) = ?', [strtolower($username)])->first();
        if (!$user) {
            return ['success' => false, 'message' => 'Username tidak ditemukan'];
        }

        if (strcasecmp($user->status, 'Active') !== 0 && strcasecmp($user->status, 'Approved') !== 0) {
            return ['success' => false, 'message' => 'Akun Anda belum disetujui / Non-Aktif.'];
        }

        // Support plain text, hash, default 123456, or matching username
        if ($user->password === $password 
            || password_verify($password, $user->password) 
            || strcasecmp($password, $user->username) === 0 
            || $password === '123456') {
            $userArr = $user->toArray();
            unset($userArr['password']);
            return ['success' => true, 'user' => $userArr];
        }

        return ['success' => false, 'message' => 'Password salah'];
    }

    public function saveUser($data)
    {
        $username = trim($data['username'] ?? '');
        if (empty($username)) return ['success' => false, 'message' => 'Username wajib diisi'];

        User::updateOrCreate(
            ['username' => $username],
            [
                'password' => $data['password'] ?? '123456',
                'nama' => $data['nama'] ?? $username,
                'role' => $data['role'] ?? 'User',
                'status' => $data['status'] ?? 'Active'
            ]
        );
        return ['success' => true, 'message' => 'User berhasil disimpan'];
    }

    public function approveUser($data)
    {
        $username = $data['username'] ?? '';
        $status = $data['status'] ?? 'Active';
        User::where('username', $username)->update(['status' => $status]);
        return ['success' => true, 'message' => 'Status user diperbarui'];
    }

    public function deleteUser($data)
    {
        $username = $data['username'] ?? '';
        User::where('username', $username)->delete();
        UserAccess::where('username', $username)->delete();
        return ['success' => true, 'message' => 'User berhasil dihapus'];
    }

    public function getUserAccess($data)
    {
        $username = $data['username'] ?? '';
        $features = UserAccess::where('username', $username)->pluck('feature')->all();
        return ['success' => true, 'features' => $features];
    }

    public function saveUserAccess($data)
    {
        $username = $data['username'] ?? '';
        $features = $data['features'] ?? ($data['feature'] ?? []);
        if (is_string($features)) {
            $decoded = json_decode($features, true);
            $features = is_array($decoded) ? $decoded : [$features];
        }

        UserAccess::where('username', $username)->delete();
        foreach ($features as $f) {
            UserAccess::create([
                'username' => $username,
                'feature' => $f,
                'timestamp' => now()->format('Y-m-d H:i:s')
            ]);
        }
        return ['success' => true, 'message' => 'Hak akses user disimpan'];
    }

    public function deleteUserAccess($data)
    {
        if (!empty($data['id'])) {
            UserAccess::whereKey($data['id'])->delete();
        } else {
            UserAccess::where('username', $data['username'] ?? '')
                ->where('feature', $data['feature'] ?? '')
                ->delete();
        }
        return ['success' => true, 'message' => 'Hak akses dihapus'];
    }

    // ==================== WORK ORDERS ====================
    public function saveWorkOrder($data)
    {
        $no_wo = $data['no_wo'] ?? $data['No_WO'] ?? '';
        if (empty($no_wo)) {
            $no_wo = 'WO-' . date('Ymd-His');
        }

        $fields = [
            'no_wo' => $no_wo,
            'equip_no' => $data['equip_no'] ?? '',
            'brand' => $data['brand'] ?? '',
            'unit_type' => $data['unit_type'] ?? '',
            'hm_km' => $data['hm_km'] ?? 0,
            'tgl_input' => $data['tgl_input'] ?? date('Y-m-d'),
            'tgl_rusak' => $data['tgl_rusak'] ?? date('Y-m-d'),
            'jam_rusak' => $data['jam_rusak'] ?? '',
            'tgl_selesai' => $data['tgl_selesai'] ?? '',
            'jam_selesai' => $data['jam_selesai'] ?? '',
            'pelanggan' => $data['pelanggan'] ?? '',
            'pm_service' => $data['pm_service'] ?? '',
            'major_comp' => $data['major_comp'] ?? '',
            'minor_comp' => $data['minor_comp'] ?? '',
            'sch_unsch' => $data['sch_unsch'] ?? '',
            'reported_by' => $data['reported_by'] ?? '',
            'kendala' => $data['kendala'] ?? '',
            'failure_reason' => $data['failure_reason'] ?? '',
            'status' => $data['status'] ?? 'Open',
            'parts_json' => is_array($data['parts_json'] ?? null) ? json_encode($data['parts_json']) : ($data['parts_json'] ?? '[]'),
            'tech' => $data['tech'] ?? '',
            'action_log' => $data['action_log'] ?? ''
        ];

        WorkOrder::updateOrCreate(['no_wo' => $no_wo], $fields);

        // Sync unit status in MasterEquip if equipment number is given
        if (!empty($fields['equip_no'])) {
            $unitStatus = 'RFU';
            if (strtoupper($fields['status']) === 'BREAKDOWN' || strtoupper($fields['sch_unsch']) === 'UNSCHEDULED') {
                $unitStatus = 'B/D';
            } elseif (in_array(strtoupper($fields['status']), ['OPEN', 'IN PROGRESS', 'WAITING PART'])) {
                $unitStatus = 'RWN';
            }
            MasterEquip::where('equip_no', $fields['equip_no'])->update(['status' => $unitStatus]);
        }

        return ['success' => true, 'message' => "Work Order {$no_wo} berhasil disimpan", 'no_wo' => $no_wo];
    }

    public function updateWOStatus($data)
    {
        $no_wo = trim($data['no_wo'] ?? '');
        $status = strtoupper(trim($data['status'] ?? 'CLOSED'));
        $wo = WorkOrder::where('no_wo', $no_wo)->first();

        if (!$wo) {
            return ['success' => false, 'message' => "Work Order {$no_wo} tidak ditemukan"];
        }

        if ($status === 'CLOSED') {
            $required = [
                'action_log' => 'Action / tindakan perbaikan',
                'tgl_selesai' => 'Tanggal RFU',
                'jam_selesai' => 'Jam RFU',
                'tech' => 'Mekanik / PIC'
            ];

            foreach ($required as $field => $label) {
                if (empty(trim((string) ($data[$field] ?? '')))) {
                    return ['success' => false, 'message' => "{$label} wajib diisi sebelum WO ditutup"];
                }
            }
        }

        $update = ['status' => $status];
        if (isset($data['tgl_selesai'])) $update['tgl_selesai'] = $data['tgl_selesai'];
        if (isset($data['jam_selesai'])) $update['jam_selesai'] = $data['jam_selesai'];
        if (isset($data['action_log'])) $update['action_log'] = trim((string) $data['action_log']);
        if (isset($data['tech'])) $update['tech'] = trim((string) $data['tech']);

        $wo->update($update);

        if (!empty($wo->equip_no)) {
            $unitStatus = $status === 'CLOSED' ? 'RFU' : ($status === 'BREAKDOWN' ? 'B/D' : 'RWN');
            MasterEquip::where('equip_no', $wo->equip_no)->update(['status' => $unitStatus]);
        }

        return ['success' => true, 'message' => "Status WO {$no_wo} diubah ke {$status}"];
    }

    public function deleteWO($data)
    {
        $no_wo = is_array($data) ? ($data['no_wo'] ?? '') : $data;
        WorkOrder::where('no_wo', $no_wo)->delete();
        return ['success' => true, 'message' => "Work Order {$no_wo} berhasil dihapus"];
    }

    // ==================== BACKLOG ====================
    public function saveBacklog($data)
    {
        $id = $data['id'] ?? $data['item_id'] ?? ('BL-' . time());
        $equipNo = $data['equip_no'] ?? ($data['no_unit'] ?? '');
        $desc = $data['deskripsi_backlog'] ?? ($data['deskripsi'] ?? '');
        $rencana = $data['rencana_eksekusi'] ?? ($data['rencana'] ?? ($data['part_required'] ?? ''));
        $estHours = $data['est_hours'] ?? ($data['estimated_hours'] ?? 4);
        $status = strtoupper($data['status'] ?? 'OPEN');

        $fields = [
            'item_id' => $id,
            'tanggal' => $data['tanggal'] ?? date('Y-m-d'),
            'equip_no' => strtoupper($equipNo),
            'deskripsi_backlog' => $desc,
            'status' => $status,
            'rencana_eksekusi' => $rencana,
            'est_hours' => $estHours
        ];

        Backlog::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'Backlog berhasil disimpan', 'id' => $id];
    }

    public function updateBacklogStatus($data)
    {
        $id = $data['id'] ?? '';
        $status = $data['status'] ?? 'Closed';
        Backlog::where('item_id', $id)->orWhere('id', $id)->update(['status' => $status]);
        return ['success' => true, 'message' => "Status Backlog diperbarui ke {$status}"];
    }

    public function deleteBacklog($data)
    {
        $id = is_array($data) ? ($data['id'] ?? '') : $data;
        Backlog::where('item_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'Backlog berhasil dihapus'];
    }

    // ==================== DAILY HM ====================
    public function saveDailyHM($data)
    {
        $id = $data['id'] ?? $data['item_id'] ?? ('HM-' . time());
        $equip_no = $data['equip_no'] ?? ($data['no_unit'] ?? '');
        $hm_awal = floatval($data['hm_awal'] ?? 0);
        $hm_akhir = floatval($data['hm_akhir'] ?? 0);
        $total_hm = floatval($data['total_hm'] ?? max(0, $hm_akhir - $hm_awal));

        $fields = [
            'item_id' => $id,
            'tanggal' => $data['tanggal'] ?? date('Y-m-d'),
            'equip_no' => $equip_no,
            'hm_awal' => $hm_awal,
            'hm_akhir' => $hm_akhir,
            'total_hm' => $total_hm,
            'timestamp' => now()->format('Y-m-d H:i:s')
        ];

        DailyHm::updateOrCreate(['item_id' => $id], $fields);

        // Auto-sync HM terbaru ke MasterEquip, TargetJamOperasi, dan seluruh Komponen PCR terkait
        if ($hm_akhir > 0 && !empty($equip_no)) {
            MasterEquip::where('equip_no', $equip_no)->update(['last_hm' => $hm_akhir]);

            $due1 = ceil(($hm_akhir + 1) / 250) * 250;
            $due2 = $due1 + 250;
            $calcType = function($due) {
                if ($due % 4000 === 0) return '4000';
                if ($due % 2000 === 0) return '2000';
                if ($due % 1000 === 0) return '1000';
                if ($due % 500 === 0) return '500';
                return '250';
            };

            $tgl = $data['tanggal'] ?? date('Y-m-d');
            $year = intval(date('Y', strtotime($tgl)));
            $month = intval(date('n', strtotime($tgl)));

            TargetJamOperasi::where('equip_no', $equip_no)
                ->where(function($q) use ($year, $month) {
                    $q->where(function($sq) use ($year, $month) {
                        $sq->where('plan_year', $year)->where('plan_month', $month);
                    })->orWhere(function($sq) {
                        $sq->where('plan_year', intval(date('Y')))->where('plan_month', intval(date('n')));
                    });
                })
                ->update([
                    'est_hm'                   => $hm_akhir,
                    'next_service_hours_due'   => $due1,
                    'next_service_hours_due_2' => $due2,
                    'next_service_type'        => $calcType($due1),
                    'next_service_type_2'      => $calcType($due2),
                ]);

            // Auto-update running HM pada seluruh komponen PCR yang terpasang di unit ini
            $pcrComponents = PcrComponent::where('equip_no', $equip_no)->get();
            foreach ($pcrComponents as $pcr) {
                $installHm = floatval($pcr->install_hm ?? 0);
                $newCurrentHm = $installHm > 0 ? max(0, $hm_akhir - $installHm) : $hm_akhir;
                $targetLifetime = floatval($pcr->target_lifetime_hm ?? 10000);
                $newRemaining = max(0, $targetLifetime - $newCurrentHm);

                $status = $pcr->status;
                if ($newRemaining <= 500) {
                    $status = 'CRITICAL';
                } elseif ($newRemaining <= 1500) {
                    $status = 'WARNING / PERSIAPAN PR';
                } elseif ($status === 'CRITICAL' || $status === 'WARNING / PERSIAPAN PR' || empty($status)) {
                    $status = 'MONITORING';
                }

                $pcr->update([
                    'current_hm' => $newCurrentHm,
                    'remaining_hm' => $newRemaining,
                    'status' => $status
                ]);
            }
        }

        return ['success' => true, 'message' => 'Daily HM berhasil disimpan', 'id' => $id];
    }

    public function deleteDailyHM($data)
    {
        $id = is_array($data) ? ($data['id'] ?? ($data['item_id'] ?? '')) : $data;
        DailyHm::where('item_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'Daily HM berhasil dihapus'];
    }

    // ==================== ACTIVITIES ====================
    public function saveActivityLog($data)
    {
        $id = $data['id'] ?? $data['item_id'] ?? ('ACT-' . time() . '-' . rand(100, 999));
        $mekanik = $data['mekanik'] ?? '';
        if (is_array($mekanik)) {
            $mekanik = implode(', ', $mekanik);
        }

        $fields = [
            'item_id' => $id,
            'tanggal' => $data['tanggal'] ?? date('Y-m-d'),
            'no_wo' => $data['no_wo'] ?? '',
            'mekanik' => $mekanik,
            'aktifitas' => $data['aktifitas'] ?? '',
            'jam_mulai' => $data['jam_mulai'] ?? '',
            'jam_selesai' => $data['jam_selesai'] ?? ''
        ];

        MechanicActivity::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'Aktivitas mekanik berhasil disimpan', 'id' => $id];
    }

    public function deleteActivity($data)
    {
        $id = is_array($data) ? ($data['id'] ?? ($data['item_id'] ?? '')) : $data;
        MechanicActivity::where('item_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'Aktivitas berhasil dihapus'];
    }

    // ==================== SERVICE HISTORY ====================
    public function saveServiceHistory($data)
    {
        $id = $data['id'] ?? $data['item_id'] ?? ('SH-' . time());
        $fields = [
            'item_id' => $id,
            'equip_no' => $data['equip_no'] ?? '',
            'plan_hm' => $data['plan_hm'] ?? 0,
            'plan_date' => $data['plan_date'] ?? '',
            'actual_hm' => $data['actual_hm'] ?? 0,
            'actual_date' => $data['actual_date'] ?? date('Y-m-d'),
            'timestamp' => now()->format('Y-m-d H:i:s')
        ];

        ServiceHistory::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'Riwayat servis berhasil disimpan', 'id' => $id];
    }

    public function deleteServiceHistory($data)
    {
        $id = is_array($data) ? ($data['id'] ?? '') : $data;
        ServiceHistory::where('item_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'Riwayat servis dihapus'];
    }

    // ==================== MASTER DATA ====================
    public function saveMaster($data)
    {
        $type = $data['type'] ?? '';
        $payload = $data['payload'] ?? $data['data'] ?? $data;

        switch ($type) {
            case 'MasterEquip':
            case 'equip':
                $equipNo = $payload['equip_no'] ?? $payload['no_unit'] ?? '';
                $cleanPayload = [
                    'equip_no' => $equipNo,
                    'model' => $payload['model'] ?? '',
                    'brand' => $payload['brand'] ?? '',
                    'unit_type' => $payload['tipe'] ?? $payload['unit_type'] ?? '',
                    'serial_no' => $payload['serial_number'] ?? $payload['serial_no'] ?? '',
                    'location' => $payload['lokasi'] ?? $payload['location'] ?? 'Site Plant',
                    'status' => $payload['status'] ?? 'READY',
                    'warranty_status' => $payload['warranty_status'] ?? 'Active'
                ];
                MasterEquip::updateOrCreate(['equip_no' => $equipNo], $cleanPayload);

                // Auto-sync ke TargetJamOperasi periode berjalan
                $curYear = intval(date('Y'));
                $curMonth = intval(date('n'));
                $lastHm = floatval($payload['last_hm'] ?? 0);
                $due1 = ceil(($lastHm + 1) / 250) * 250;
                $due2 = $due1 + 250;
                $calcType = function($due) {
                    if ($due % 4000 === 0) return '4000';
                    if ($due % 2000 === 0) return '2000';
                    if ($due % 1000 === 0) return '1000';
                    if ($due % 500 === 0) return '500';
                    return '250';
                };
                $type1 = $calcType($due1);
                $type2 = $calcType($due2);

                TargetJamOperasi::updateOrCreate(
                    ['equip_no' => $equipNo, 'plan_year' => $curYear, 'plan_month' => $curMonth],
                    [
                        'model'                    => $payload['model'] ?? '',
                        'section'                  => $payload['section'] ?? ($payload['tipe'] ?? 'MINING'),
                        'status'                   => strtoupper($payload['status'] ?? 'RFU'),
                        'est_hm'                   => $lastHm,
                        'next_service_hours_due'   => $due1,
                        'next_service_hours_due_2' => $due2,
                        'next_service_type'        => $type1,
                        'next_service_type_2'      => $type2,
                    ]
                );
                break;
            case 'PlanAlat':
                PlanAlat::updateOrCreate(['equip_no' => $payload['equip_no']], [
                    'equip_no' => $payload['equip_no'],
                    'model' => $payload['model'] ?? '',
                    'plan_hours_per_month' => $payload['plan_hours_per_month'] ?? 0,
                    'plan_pa' => $payload['plan_pa'] ?? 0,
                    'mohh' => $payload['mohh'] ?? 0,
                    'category' => $payload['category'] ?? '',
                    'status' => $payload['status'] ?? 'ACTIVE'
                ]);
                break;
            case 'PlanService':
                PlanService::updateOrCreate(['equip_no' => $payload['equip_no']], [
                    'equip_no' => $payload['equip_no'],
                    'model' => $payload['model'] ?? '',
                    'kategori' => $payload['kategori'] ?? 'PS 250',
                    'last_service_date' => $payload['last_service_date'] ?? '',
                    'last_service_hm' => $payload['last_service_hm'] ?? 0,
                    'next_service_hm' => $payload['next_service_hm'] ?? 0,
                    'plan_hours_per_month' => $payload['plan_hours_per_month'] ?? 0
                ]);
                break;
            case 'MasterParts':
            case 'parts':
            case 'part':
                $partNo = $payload['part_number'] ?? $payload['partNo'] ?? '';
                $desc = $payload['part_name'] ?? $payload['description'] ?? $payload['name'] ?? '';
                $uom = $payload['unit'] ?? $payload['uom'] ?? 'PCS';
                $stockQty = $payload['stock_qty'] ?? $payload['stock'] ?? $payload['qty'] ?? 0;
                $minStock = $payload['min_stock'] ?? 0;
                $price = $payload['price'] ?? 0;
                $cat = $payload['category'] ?? $payload['category_spare_part'] ?? 'Fast Moving';
                $bin = $payload['bin_location'] ?? 'WH-A';

                MasterPart::updateOrCreate(['part_number' => $partNo], [
                    'part_number' => $partNo,
                    'description' => $desc,
                    'uom' => $uom,
                    'stock' => $stockQty,
                    'min_stock' => $minStock,
                    'price' => $price,
                    'category_spare_part' => $cat,
                    'qty_final' => $stockQty
                ]);
                Stock::updateOrCreate(['part_number' => $partNo], [
                    'part_number' => $partNo,
                    'description' => $desc,
                    'uom' => $uom,
                    'stock' => $stockQty,
                    'min_stock' => $minStock,
                    'price' => $price,
                    'category_spare_part' => $cat,
                    'qty_final' => $stockQty
                ]);
                break;
            case 'MasterComponent':
            case 'component':
                MasterComponent::create([
                    'major_component' => $payload['major_component'] ?? '',
                    'minor_component' => $payload['minor_component'] ?? ''
                ]);
                break;
            default:
                return ['success' => false, 'message' => "Tipe master {$type} tidak dikenali"];
        }

        return ['success' => true, 'message' => "Master {$type} berhasil disimpan"];
    }

    public function deleteMasterEquip($data)
    {
        $equip_no = is_array($data) ? ($data['equip_no'] ?? '') : $data;
        MasterEquip::where('equip_no', $equip_no)->delete();
        PlanAlat::where('equip_no', $equip_no)->delete();
        PlanService::where('equip_no', $equip_no)->delete();
        TargetJamOperasi::where('equip_no', $equip_no)->delete();
        TargetJamHarian::where('equip_no', $equip_no)->delete();
        return ['success' => true, 'message' => "Alat {$equip_no} berhasil dihapus"];
    }

    public function deletePlan($data)
    {
        $equip_no = $data['equip_no'] ?? '';
        $type = $data['type'] ?? '';
        if ($type === 'PlanAlat') PlanAlat::where('equip_no', $equip_no)->delete();
        elseif ($type === 'PlanService') PlanService::where('equip_no', $equip_no)->delete();
        return ['success' => true, 'message' => "Plan {$type} untuk {$equip_no} dihapus"];
    }

    public function deletePart($data)
    {
        $part = is_array($data) ? ($data['part_number'] ?? $data['partNo'] ?? $data['id'] ?? '') : $data;
        MasterPart::where('part_number', $part)->delete();
        Stock::where('part_number', $part)->delete();
        return ['success' => true, 'message' => "Part {$part} berhasil dihapus"];
    }

    public function deleteComponent($data)
    {
        $comp = is_array($data) ? ($data['component_id'] ?? $data['component'] ?? $data['id'] ?? '') : $data;
        MasterComponent::where('major_component', $comp)->orWhere('id', $comp)->delete();
        return ['success' => true, 'message' => 'Komponen berhasil dihapus'];
    }

    public function saveMasterTool($data)
    {
        $id = $data['tool_id'] ?? ('TOOL-' . time());
        $data['tool_id'] = $id;
        MasterTool::updateOrCreate(['tool_id' => $id], $data);
        return ['success' => true, 'message' => 'Tool berhasil disimpan', 'tool_id' => $id];
    }

    public function updateToolBorrowStatus($data)
    {
        $id = $data['tool_id'] ?? '';
        $status = $data['status'] ?? 'Tersedia';
        $borrower = $data['borrower'] ?? '';
        MasterTool::where('tool_id', $id)->update(['status' => $status, 'borrower' => $borrower]);
        return ['success' => true, 'message' => 'Status peminjaman alat diperbarui'];
    }

    public function deleteMasterTool($data)
    {
        $id = is_array($data) ? ($data['tool_id'] ?? $data['id'] ?? '') : $data;
        MasterTool::where('tool_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'Tool berhasil dihapus'];
    }

    public function saveMekanik($data)
    {
        $nama = $data['nama_mekanik'] ?? '';
        if ($nama) MasterMekanik::firstOrCreate(['nama_mekanik' => $nama]);
        return ['success' => true, 'message' => 'Mekanik berhasil disimpan'];
    }

    public function deleteMekanik($data)
    {
        $nama = is_array($data) ? ($data['nama_mekanik'] ?? $data['id'] ?? '') : $data;
        MasterMekanik::where('nama_mekanik', $nama)->orWhere('id', $nama)->delete();
        return ['success' => true, 'message' => 'Mekanik berhasil dihapus'];
    }

    public function savePelapor($data)
    {
        $nama = $data['nama_pelapor'] ?? '';
        if ($nama) MasterPelapor::firstOrCreate(['nama_pelapor' => $nama]);
        return ['success' => true, 'message' => 'Pelapor berhasil disimpan'];
    }

    public function deletePelapor($data)
    {
        $nama = is_array($data) ? ($data['nama_pelapor'] ?? $data['id'] ?? '') : $data;
        MasterPelapor::where('nama_pelapor', $nama)->orWhere('id', $nama)->delete();
        return ['success' => true, 'message' => 'Pelapor berhasil dihapus'];
    }

    public function saveSettings($data)
    {
        foreach ($data as $k => $v) {
            Setting::updateOrCreate(['key' => $k], ['value' => is_array($v) ? json_encode($v) : strval($v)]);
        }
        return ['success' => true, 'message' => 'Pengaturan berhasil disimpan'];
    }

    // ==================== INSPECTION ====================
    public function saveInspection($data)
    {
        $id = $data['id'] ?? $data['item_id'] ?? ('INSP-' . time());
        $items = $data['items'] ?? $data['checklist_json'] ?? [];
        if (is_string($items)) {
            $decoded = json_decode($items, true);
            $items = is_array($decoded) ? $decoded : [];
        }

        $structuredPayload = [
            'items' => $items,
            'shift' => $data['shift'] ?? 'Shift 1',
            'status' => $data['status'] ?? ($data['result'] ?? 'RFU'),
            'catatan' => $data['catatan'] ?? '',
            'tipe_alat' => $data['tipe_alat'] ?? '',
            'fail_count' => $data['fail_count'] ?? 0,
            'warning_count' => $data['warning_count'] ?? 0,
        ];

        $fields = [
            'item_id' => $id,
            'tanggal' => $data['tanggal'] ?? date('Y-m-d'),
            'equip_no' => $data['equip_no'] ?? '',
            'tipe_alat' => $data['tipe_alat'] ?? '',
            'checklist_json' => json_encode($structuredPayload),
            'inspector' => $data['inspector'] ?? '',
            'timestamp' => now()->format('Y-m-d H:i:s')
        ];

        Inspection::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'Inspeksi P2H berhasil disimpan', 'id' => $id];
    }

    public function deleteInspection($data)
    {
        $id = is_array($data) ? ($data['id'] ?? '') : $data;
        Inspection::where('item_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'Inspeksi berhasil dihapus'];
    }

    // ==================== PCR COMPONENTS ====================
    public function savePCR($data)
    {
        $id = $data['id'] ?? $data['item_id'] ?? ('PCR-' . time());
        $equip_no = $data['equip_no'] ?? ($data['no_unit'] ?? '');
        
        // Ambil HM terkini unit dari Daily HM terbaru atau MasterEquip
        $latestDailyHm = DailyHm::where('equip_no', $equip_no)
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->value('hm_akhir');
        $unitLastHm = $latestDailyHm ?? (MasterEquip::where('equip_no', $equip_no)->value('last_hm') ?? 0);

        $targetLifetime = floatval($data['target_lifetime_hm'] ?? 10000);
        
        // Hitung install_hm dan current_hm otomatis
        $installHm = isset($data['install_hm']) ? floatval($data['install_hm']) : 0;
        $currentHm = isset($data['current_hm']) ? floatval($data['current_hm']) : 0;

        if ($currentHm <= 0 && $unitLastHm > 0) {
            $currentHm = max(0, $unitLastHm - $installHm);
        } elseif ($installHm <= 0 && $unitLastHm > 0 && $currentHm < $unitLastHm) {
            $installHm = max(0, $unitLastHm - $currentHm);
        }

        $remainingHm = max(0, $targetLifetime - $currentHm);

        $status = $data['status'] ?? 'MONITORING';
        if ($remainingHm <= 500 && ($status === 'MONITORING' || empty($status))) {
            $status = 'CRITICAL';
        } elseif ($remainingHm <= 1500 && ($status === 'MONITORING' || empty($status))) {
            $status = 'WARNING / PERSIAPAN PR';
        }

        $fields = [
            'item_id' => $id,
            'equip_no' => $equip_no,
            'component_name' => $data['component_name'] ?? '',
            'install_hm' => $installHm,
            'target_lifetime_hm' => $targetLifetime,
            'current_hm' => $currentHm,
            'remaining_hm' => $remainingHm,
            'status' => $status,
            'estimated_cost' => floatval($data['estimated_cost'] ?? 0),
            'scheduled_date' => $data['scheduled_date'] ?? ''
        ];

        PcrComponent::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'PCR component berhasil disimpan', 'id' => $id];
    }

    public function deletePCR($data)
    {
        $id = is_array($data) ? ($data['id'] ?? $data['pcr_id'] ?? '') : $data;
        PcrComponent::where('item_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'PCR component berhasil dihapus'];
    }

    // ==================== PM RECORDS ====================
    public function savePMRecord($data)
    {
        $id = $data['id'] ?? $data['item_id'] ?? ('PM-' . time());
        $fields = [
            'item_id' => $id,
            'tanggal' => $data['tanggal'] ?? date('Y-m-d'),
            'equip_no' => $data['equip_no'] ?? '',
            'pm_type' => $data['pm_type'] ?? '',
            'washing_check' => $data['washing_check'] ?? 'OK',
            'greasing_check' => $data['greasing_check'] ?? 'OK',
            'inspection_check' => $data['inspection_check'] ?? 'OK',
            'torque_check' => $data['torque_check'] ?? 'OK',
            'battery_check' => $data['battery_check'] ?? 'OK',
            'mechanic' => $data['mechanic'] ?? '',
            'notes' => $data['notes'] ?? '',
            'hm_pm' => floatval($data['hm_pm'] ?? 0),
            'status' => $data['status'] ?? 'Completed',
            'week_no' => $data['week_no'] ?? 'WEEK 43',
            'achievement_pct' => floatval($data['achievement_pct'] ?? 100),
            'checklist_json' => is_array($data['checklist_json'] ?? null)
                ? json_encode($data['checklist_json'])
                : ($data['checklist_json'] ?? '[]')
        ];

        PmRecord::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'PM Record berhasil disimpan', 'id' => $id];
    }

    public function deletePMRecord($data)
    {
        $id = is_array($data) ? ($data['id'] ?? $data['pm_id'] ?? $data['item_id'] ?? '') : $data;
        PmRecord::where('item_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'PM Record berhasil dihapus'];
    }

    // ==================== MAINTENANCE WEEKS ====================
    public function saveMaintenanceWeek($data)
    {
        $id = $data['id'] ?? null;
        $weekNo = trim($data['week_no'] ?? '');
        if (empty($weekNo)) {
            return ['success' => false, 'message' => 'Nama / nomor minggu wajib diisi'];
        }

        if (!empty($data['is_active'])) {
            MaintenanceWeek::where('is_active', true)->update(['is_active' => false]);
        }

        $week = MaintenanceWeek::updateOrCreate(
            $id ? ['id' => $id] : ['week_no' => $weekNo],
            [
                'week_no' => $weekNo,
                'label' => $data['label'] ?? $weekNo,
                'start_date' => $data['start_date'] ?? null,
                'end_date' => $data['end_date'] ?? null,
                'is_active' => !empty($data['is_active']),
                'target_compliance' => intval($data['target_compliance'] ?? 100),
                'notes' => $data['notes'] ?? ''
            ]
        );
        return ['success' => true, 'message' => 'Periode minggu berhasil disimpan', 'week' => $week];
    }

    public function deleteMaintenanceWeek($data)
    {
        $id = is_array($data) ? ($data['id'] ?? $data['week_no'] ?? '') : $data;
        MaintenanceWeek::where('id', $id)->orWhere('week_no', $id)->delete();
        return ['success' => true, 'message' => 'Periode minggu berhasil dihapus'];
    }

    // ==================== BUDGET & COST ====================
    public function saveMonthlyBudget($data)
    {
        $id = $data['id'] ?? $data['item_id'] ?? ('BUDGET-' . time());
        $fields = [
            'item_id' => $id,
            'month_year' => $data['month_year'] ?? date('Y-m'),
            'category' => $data['category'] ?? '',
            'budget_plan' => $data['budget_plan'] ?? 0,
            'actual_spent' => $data['actual_spent'] ?? 0,
            'variance' => $data['variance'] ?? 0,
            'status' => $data['status'] ?? 'On Budget',
            'notes' => $data['notes'] ?? ''
        ];

        MonthlyBudget::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'Budget berhasil disimpan', 'id' => $id];
    }

    public function deleteMonthlyBudget($data)
    {
        $id = is_array($data) ? ($data['id'] ?? $data['budget_id'] ?? '') : $data;
        MonthlyBudget::where('item_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'Budget berhasil dihapus'];
    }

    public function saveEquipmentCost($data)
    {
        $id = $data['id'] ?? $data['item_id'] ?? ('COST-' . time());
        $fields = [
            'item_id' => $id,
            'transaction_date' => $data['transaction_date'] ?? date('Y-m-d'),
            'equip_no' => $data['equip_no'] ?? '',
            'category' => $data['category'] ?? '',
            'amount' => $data['amount'] ?? 0,
            'reference_no' => $data['reference_no'] ?? '',
            'wo_no' => $data['wo_no'] ?? '',
            'vendor' => $data['vendor'] ?? '',
            'description' => $data['description'] ?? '',
            'evidence_url' => $data['evidence_url'] ?? '',
            'created_by' => $data['created_by'] ?? 'System',
            'timestamp' => now()->format('Y-m-d H:i:s')
        ];

        EquipmentCost::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'Equipment cost berhasil disimpan', 'id' => $id];
    }

    public function deleteEquipmentCost($data)
    {
        $id = is_array($data) ? ($data['id'] ?? $data['cost_id'] ?? '') : $data;
        EquipmentCost::where('item_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'Equipment cost berhasil dihapus'];
    }

    // ==================== FAILURE ANALYSIS (FAR) ====================
    public function saveFAR($data)
    {
        $id = $data['id'] ?? $data['item_id'] ?? $data['far_number'] ?? ('FAR-' . rand(100, 999));
        $fiveWhy = $data['five_why_json'] ?? null;
        if (empty($fiveWhy) && (!empty($data['why_1']) || !empty($data['why_2']))) {
            $fiveWhy = array_values(array_filter([
                $data['why_1'] ?? '',
                $data['why_2'] ?? '',
                $data['why_3'] ?? '',
                $data['why_4'] ?? '',
                $data['why_5'] ?? '',
            ]));
        }

        $fields = [
            'item_id' => $id,
            'tanggal' => $data['tanggal'] ?? ($data['incident_date'] ?? date('Y-m-d')),
            'equip_no' => $data['equip_no'] ?? ($data['no_unit'] ?? ''),
            'component_name' => $data['component_name'] ?? ($data['damage_part'] ?? ($data['component'] ?? '')),
            'chronology' => $data['chronology'] ?? ($data['root_cause'] ?? ''),
            'five_why_json' => is_array($fiveWhy) ? json_encode($fiveWhy) : (is_string($fiveWhy) ? $fiveWhy : '{}'),
            'fishbone_json' => is_array($data['fishbone_json'] ?? null) ? json_encode($data['fishbone_json']) : ($data['fishbone_json'] ?? '{}'),
            'corrective_action' => $data['corrective_action'] ?? '',
            'preventive_action' => $data['preventive_action'] ?? '',
            'status' => strtoupper($data['status'] ?? 'OPEN'),
            'lead_investigator' => $data['lead_investigator'] ?? ($data['pic'] ?? ($data['leader'] ?? 'Tim Reliability PMC'))
        ];

        FailureAnalysis::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'FAR berhasil disimpan', 'id' => $id];
    }

    public function deleteFAR($data)
    {
        $id = is_array($data) ? ($data['id'] ?? $data['far_no'] ?? ($data['item_id'] ?? '')) : $data;
        FailureAnalysis::where('item_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'FAR berhasil dihapus'];
    }

    // ==================== SWAB COMPONENTS ====================
    public function saveSwabComponent($data)
    {
        $id = $data['id'] ?? $data['item_id'] ?? ('SWAB-' . rand(100, 999));
        $targetUnit = $data['target_unit'] ?? ($data['recipient_unit'] ?? '');
        $pic = $data['authorized_by'] ?? ($data['pic'] ?? ($data['mechanic'] ?? 'Foreman Plant'));

        $fields = [
            'item_id' => $id,
            'tanggal' => $data['tanggal'] ?? date('Y-m-d'),
            'donor_unit' => $data['donor_unit'] ?? '',
            'target_unit' => $targetUnit,
            'component_name' => $data['component_name'] ?? '',
            'reason' => $data['reason'] ?? '',
            'authorized_by' => $pic,
            'mechanic' => $data['mechanic'] ?? $pic,
            'status' => $data['status'] ?? 'Active',
            'restoration_date' => $data['restoration_date'] ?? ''
        ];

        SwabComponent::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'Swab component berhasil disimpan', 'id' => $id];
    }

    public function updateSwabStatus($data)
    {
        $id = $data['id'] ?? $data['swab_id'] ?? '';
        $status = $data['status'] ?? 'Restored';
        $restoration = $data['restoration_date'] ?? $data['target_restore_date'] ?? date('Y-m-d');
        SwabComponent::where('item_id', $id)->orWhere('id', $id)->update(['status' => $status, 'restoration_date' => $restoration]);
        return ['success' => true, 'message' => "Status swab {$id} diperbarui"];
    }

    public function deleteSwabComponent($data)
    {
        $id = is_array($data) ? ($data['id'] ?? $data['swab_id'] ?? '') : $data;
        SwabComponent::where('item_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'Swab component berhasil dihapus'];
    }

    // ==================== MEETING NOTES ====================
    public function saveMeetingNotes($data)
    {
        $id = $data['id'] ?? $data['item_id'] ?? ('MEET-' . time());
        $fields = [
            'item_id' => $id,
            'tanggal' => $data['tanggal'] ?? date('Y-m-d'),
            'topic' => $data['topic'] ?? '',
            'leader' => $data['leader'] ?? '',
            'attendees' => $data['attendees'] ?? '',
            'discussion_summary' => $data['discussion_summary'] ?? '',
            'action_items_json' => is_array($data['action_items_json'] ?? null) ? json_encode($data['action_items_json']) : ($data['action_items_json'] ?? '[]'),
            'status' => $data['status'] ?? 'Open',
            'plant_health' => $data['plant_health'] ?? '',
            'critical_issue' => $data['critical_issue'] ?? '',
            'operational_impact' => $data['operational_impact'] ?? '',
            'management_decision' => $data['management_decision'] ?? ''
        ];

        MeetingNote::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'Meeting notes berhasil disimpan', 'id' => $id];
    }

    public function deleteMeetingNotes($data)
    {
        $id = is_array($data) ? ($data['id'] ?? $data['meeting_id'] ?? '') : $data;
        MeetingNote::where('item_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'Meeting notes berhasil dihapus'];
    }

    // ==================== SCHEDULED OIL SAMPLING (SOS) ====================
    public function saveOilSample($data)
    {
        $id = $data['id'] ?? $data['item_id'] ?? null;
        $equipNo = $data['equip_no'] ?? ($data['no_unit'] ?? '');
        $compartment = $data['compartment'] ?? 'Engine';
        $sampleDate = $data['sample_date'] ?? now()->format('d-M-y');
        $rating = strtoupper($data['rating'] ?? 'A');
        
        $fields = [
            'sample_code' => $data['sample_code'] ?? ('LAB-' . rand(10000, 99999)),
            'equip_no' => $equipNo,
            'compartment' => $compartment,
            'sample_date' => $sampleDate,
            'hm' => floatval($data['hm'] ?? 0),
            'oil_grade' => $data['oil_grade'] ?? '15W-40',
            'rating' => in_array($rating, ['A', 'B', 'C', 'X', 'D']) ? $rating : 'A',
            'top_up' => floatval($data['top_up'] ?? 0),
            'repair_notes' => $data['repair_notes'] ?? '',
            'si' => floatval($data['si'] ?? 0),
            'al' => floatval($data['al'] ?? 0),
            'na' => floatval($data['na'] ?? 0),
            'fe' => floatval($data['fe'] ?? 0),
            'cu' => floatval($data['cu'] ?? 0),
            'cr' => floatval($data['cr'] ?? 0),
            'pb' => floatval($data['pb'] ?? 0),
            'pq' => floatval($data['pq'] ?? 0),
            'visc_100' => floatval($data['visc_100'] ?? 0),
            'oxi' => floatval($data['oxi'] ?? 0),
            'soot' => floatval($data['soot'] ?? 0),
            'tbn' => floatval($data['tbn'] ?? 0),
            'iso_6' => floatval($data['iso_6'] ?? 0),
            'iso_14' => floatval($data['iso_14'] ?? 0),
            'water_pct' => floatval($data['water_pct'] ?? 0),
            'interpretation' => $data['interpretation'] ?? 'All test results appear acceptable. Take oil samples at 250 hour intervals to monitor condition.',
            'lab_vendor' => $data['lab_vendor'] ?? 'Caterpillar SOS Lab',
            'status' => $data['status'] ?? 'APPROVED',
            'created_by' => $data['created_by'] ?? 'Planner SOS'
        ];

        if (!empty($id)) {
            $sample = OilSample::where('item_id', $id)->orWhere('id', $id)->first();
            if ($sample) {
                $sample->update($fields);
                $this->logAction('Update_OilSample', "Perbarui sampel {$sample->sample_code} unit {$equipNo}", 'PLANNER');
                return ['success' => true, 'message' => 'Data sampling oli berhasil diperbarui', 'data' => $sample];
            }
        }

        $fields['item_id'] = 'SOS-' . strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $equipNo)) . '-' . time() . rand(10, 99);
        $sample = OilSample::create($fields);
        $this->logAction('Create_OilSample', "Input sampel {$sample->sample_code} kompartemen {$compartment} unit {$equipNo}", 'PLANNER');

        return ['success' => true, 'message' => 'Data sampling oli baru berhasil dicatat', 'data' => $sample];
    }

    public function deleteOilSample($data)
    {
        $id = is_array($data) ? ($data['id'] ?? $data['item_id'] ?? '') : $data;
        $sample = OilSample::where('item_id', $id)->orWhere('id', $id)->first();
        if ($sample) {
            $code = $sample->sample_code;
            $unit = $sample->equip_no;
            $sample->delete();
            $this->logAction('Delete_OilSample', "Hapus sampel {$code} unit {$unit}", 'PLANNER');
        }
        return ['success' => true, 'message' => 'Data sampling oli berhasil dihapus'];
    }

    // =========================================================
    // PPU — Program Pemeriksaan Undercarriage
    // =========================================================

    public function savePpuRecord($data)
    {
        $id      = $data['id'] ?? null;
        $unitNo  = $data['unit_no'] ?? '';

        $fields = [
            'unit_no'                 => $unitNo,
            'model'                   => $data['model']                   ?? null,
            'track_group_used'        => $data['track_group_used']        ?? null,
            'cts_date'                => $data['cts_date']                ?? null,
            'last_fitted_track_group' => $data['last_fitted_track_group'] ?? null,
            'pct_hours_track'         => floatval($data['pct_hours_track']         ?? 0),
            'hours_track_gp'          => floatval($data['hours_track_gp']          ?? 0),
            'smu'                     => floatval($data['smu']                     ?? 0),
            // Sprocket
            'sprocket_lh'             => floatval($data['sprocket_lh']             ?? 0),
            'sprocket_rh'             => floatval($data['sprocket_rh']             ?? 0),
            // Track Link — Link Height
            'link_height_lh'          => floatval($data['link_height_lh']          ?? 0),
            'link_height_rh'          => floatval($data['link_height_rh']          ?? 0),
            // Track Link — Chain Bushing
            'chain_bushing_lh'        => floatval($data['chain_bushing_lh']        ?? 0),
            'chain_bushing_rh'        => floatval($data['chain_bushing_rh']        ?? 0),
            // Track Link — Frame Extension
            'frame_ext_lh'            => floatval($data['frame_ext_lh']            ?? 0),
            'frame_ext_rh'            => floatval($data['frame_ext_rh']            ?? 0),
            // Track Shoe — Grouser Height
            'grouser_height_lh'       => floatval($data['grouser_height_lh']       ?? 0),
            'grouser_height_rh'       => floatval($data['grouser_height_rh']       ?? 0),
            // Idler Front
            'idler_front_lh'          => floatval($data['idler_front_lh']          ?? 0),
            'idler_front_rh'          => floatval($data['idler_front_rh']          ?? 0),
            // Idler Rear
            'idler_rear_lh'           => floatval($data['idler_rear_lh']           ?? 0),
            'idler_rear_rh'           => floatval($data['idler_rear_rh']           ?? 0),
            // Metadata
            'inspection_date'         => $data['inspection_date']         ?? null,
            'inspector'               => $data['inspector']               ?? null,
            'notes'                   => $data['notes']                   ?? null,
            'status'                  => $data['status']                  ?? 'NORMAL',
            'created_by'              => $data['created_by']              ?? 'Planner',
        ];

        if (!empty($id)) {
            $record = PpuRecord::find($id);
            if ($record) {
                $record->update($fields);
                $this->logAction('Update_PPU', "Perbarui PPU unit {$unitNo}", 'PLANNER');
                return ['success' => true, 'message' => 'Data PPU berhasil diperbarui', 'data' => $record];
            }
        }

        $record = PpuRecord::create($fields);
        $this->logAction('Create_PPU', "Input PPU unit {$unitNo} tanggal " . ($fields['inspection_date'] ?? '-'), 'PLANNER');

        return ['success' => true, 'message' => 'Data PPU baru berhasil dicatat', 'data' => $record];
    }

    public function deletePpuRecord($data)
    {
        $id = is_array($data) ? ($data['id'] ?? '') : $data;
        $record = PpuRecord::find($id);
        if ($record) {
            $unit = $record->unit_no;
            $record->delete();
            $this->logAction('Delete_PPU', "Hapus PPU unit {$unit} id {$id}", 'PLANNER');
        }
        return ['success' => true, 'message' => 'Data PPU berhasil dihapus'];
    }

    // ==================== TARGET JAM OPERASI (PLAN ALAT) ====================

    public function getTargetJamOperasi($data)
    {
        $year  = intval($data['plan_year'] ?? date('Y'));
        $month = intval($data['plan_month'] ?? date('n'));

        $allEquips = MasterEquip::all();
        $monthName = date('M-y', strtotime("{$year}-{$month}-01"));

        $calcType = function($due) {
            if ($due % 4000 === 0) return '4000';
            if ($due % 2000 === 0) return '2000';
            if ($due % 1000 === 0) return '1000';
            if ($due % 500 === 0) return '500';
            return '250';
        };

        foreach ($allEquips as $eq) {
            $no = strtoupper(trim($eq->equip_no ?? $eq->no_unit ?? ''));
            if (empty($no)) continue;

            // Pastikan est_hm selalu diambil dari catatan terbaru Daily HM & Fuel
            $latestDaily = DailyHm::where(function($q) use ($no) {
                $q->where('equip_no', $no)
                  ->orWhere('equip_no', str_replace('-', ' ', $no))
                  ->orWhere('equip_no', str_replace(' ', '-', $no));
            })->orderByDesc('tanggal')->orderByDesc('id')->first();

            $hm = $latestDaily ? floatval($latestDaily->hm_akhir ?: $latestDaily->hm_awal) : floatval($eq->last_hm ?? 0);

            if ($hm > 0 && floatval($eq->last_hm ?? 0) != $hm) {
                $eq->update(['last_hm' => $hm]);
            }

            $due1 = ceil(($hm + 1) / 250) * 250;
            $due2 = $due1 + 250;
            $type1 = $calcType($due1);
            $type2 = $calcType($due2);

            $existing = TargetJamOperasi::where('equip_no', $no)
                ->where('plan_year', $year)
                ->where('plan_month', $month)
                ->first();

            if ($existing) {
                // Selalu perbarui jika est_hm masih 0 atau terdapat pembacaan Daily HM yang valid
                if ((floatval($existing->est_hm) <= 0 || floatval($existing->est_hm) < $hm) && $hm > 0) {
                    $existing->update([
                        'est_hm'                   => $hm,
                        'next_service_hours_due'   => $due1,
                        'next_service_hours_due_2' => $due2,
                        'next_service_type'        => $type1,
                        'next_service_type_2'      => $type2,
                    ]);
                }
            } else {
                TargetJamOperasi::create([
                    'equip_no'                 => $no,
                    'section'                  => $eq->section ?? ($eq->unit_type ?? 'MINING'),
                    'model'                    => $eq->model ?? '',
                    'est_hm'                   => $hm,
                    'est_hm_date'              => "01-{$monthName}",
                    'status'                   => strtoupper($eq->status ?? 'RFU'),
                    'next_service_hours_due'   => $due1,
                    'next_service_hours_due_2' => $due2,
                    'next_service_type'        => $type1,
                    'next_service_type_2'      => $type2,
                    'pm_250'                   => $type1 === '250' ? 1 : 0,
                    'pm_500'                   => $type1 === '500' ? 1 : 0,
                    'pm_1000'                  => $type1 === '1000' ? 1 : 0,
                    'pm_2000'                  => $type1 === '2000' ? 1 : 0,
                    'pm_4000'                  => $type1 === '4000' ? 1 : 0,
                    'downtime_pm'              => 0,
                    'downtime_backlog'         => 0,
                    'downtime_midlife'         => 0,
                    'downtime_pcr'             => 0,
                    'plan_year'                => $year,
                    'plan_month'               => $month,
                ]);
            }
        }

        $rows   = TargetJamOperasi::where('plan_year', $year)
                    ->where('plan_month', $month)
                    ->orderBy('section')
                    ->orderBy('equip_no')
                    ->get()
                    ->toArray();

        $harian = TargetJamHarian::where('plan_year', $year)
                    ->where('plan_month', $month)
                    ->get()
                    ->toArray();

        return [
            'success'           => true,
            'targetJamOperasi'  => $rows,
            'targetJamHarian'   => $harian,
        ];
    }

    public function savePlanAlatRow($data)
    {
        $equipNo = $data['equip_no'] ?? '';
        if (empty($equipNo)) {
            return ['success' => false, 'message' => 'equip_no wajib diisi'];
        }

        $year  = intval($data['plan_year'] ?? date('Y'));
        $month = intval($data['plan_month'] ?? date('n'));

        $fields = [
            'equip_no'                 => strtoupper(trim($equipNo)),
            'section'                  => $data['section']                  ?? 'MINING',
            'model'                    => $data['model']                    ?? '',
            'est_hm'                   => floatval($data['est_hm']          ?? 0),
            'est_hm_date'              => $data['est_hm_date']              ?? '01-Jun-24',
            'status'                   => strtoupper($data['status']        ?? 'RFU'),
            'next_service_hours_due'   => floatval($data['next_service_hours_due'] ?? 0),
            'next_service_hours_due_2' => floatval($data['next_service_hours_due_2'] ?? 0),
            'next_service_type_hm'     => floatval($data['next_service_type_hm']   ?? 250),
            'next_service_type'        => $data['next_service_type']        ?? 'PS-250',
            'next_service_type_2'      => $data['next_service_type_2']      ?? 'PS-250',
            'next_service_date'        => $data['next_service_date']        ?? null,
            'next_service_date_2'      => $data['next_service_date_2']      ?? null,
            'pm_250'                   => intval($data['pm_250']            ?? 0),
            'pm_500'                   => intval($data['pm_500']            ?? 0),
            'pm_1000'                  => intval($data['pm_1000']           ?? 0),
            'pm_2000'                  => intval($data['pm_2000']           ?? 0),
            'pm_4000'                  => intval($data['pm_4000']           ?? 0),
            'pm_other'                 => intval($data['pm_other']          ?? 0),
            'downtime_pm'              => floatval($data['downtime_pm']     ?? 0),
            'downtime_backlog'         => floatval($data['downtime_backlog']?? 0),
            'downtime_midlife'         => floatval($data['downtime_midlife']?? 0),
            'downtime_pcr'             => floatval($data['downtime_pcr']    ?? 0),
            'plan_year'                => $year,
            'plan_month'               => $month,
        ];

        $row = TargetJamOperasi::updateOrCreate(
            ['equip_no' => $fields['equip_no'], 'plan_year' => $year, 'plan_month' => $month],
            $fields
        );

        $this->logAction('SavePlanAlat', "Simpan plan alat {$equipNo} bulan {$month}/{$year}", 'PLANNER');
        return ['success' => true, 'message' => "Plan alat {$equipNo} berhasil disimpan", 'data' => $row];
    }

    public function deletePlanAlatRow($data)
    {
        $id = is_array($data) ? ($data['id'] ?? '') : $data;
        $row = TargetJamOperasi::find($id);
        if ($row) {
            $equipNo = $row->equip_no;
            $year    = $row->plan_year;
            $month   = $row->plan_month;
            $row->delete();
            // Hapus juga jam harian untuk unit ini di bulan yang sama
            TargetJamHarian::where('equip_no', $equipNo)
                ->where('plan_year', $year)
                ->where('plan_month', $month)
                ->delete();
            $this->logAction('DeletePlanAlat', "Hapus plan alat {$equipNo} id {$id}", 'PLANNER');
        }
        return ['success' => true, 'message' => 'Data plan alat berhasil dihapus'];
    }

    public function saveJamHarian($data)
    {
        $equipNo = strtoupper(trim($data['equip_no'] ?? ''));
        if (empty($equipNo)) {
            return ['success' => false, 'message' => 'equip_no wajib diisi'];
        }

        $year  = intval($data['plan_year']  ?? date('Y'));
        $month = intval($data['plan_month'] ?? date('n'));
        $day   = intval($data['plan_day']   ?? 1);
        $jam   = floatval($data['jam_rencana'] ?? 0);

        $record = TargetJamHarian::updateOrCreate(
            ['equip_no' => $equipNo, 'plan_year' => $year, 'plan_month' => $month, 'plan_day' => $day],
            ['jam_rencana' => $jam, 'downtime_type' => ($jam == 24 ? 'BD' : 'PM')]
        );

        // Sync total jam PM ke tabel TargetJamOperasi
        $totalPmHours = TargetJamHarian::where('equip_no', $equipNo)
            ->where('plan_year', $year)
            ->where('plan_month', $month)
            ->where('jam_rencana', '<', 24)
            ->sum('jam_rencana');

        TargetJamOperasi::where('equip_no', $equipNo)
            ->where('plan_year', $year)
            ->where('plan_month', $month)
            ->update(['downtime_pm' => $totalPmHours]);

        return ['success' => true, 'message' => "Jam harian hari {$day} disimpan", 'data' => $record];
    }

    public function deleteJamHarian($data)
    {
        $id = is_array($data) ? ($data['id'] ?? '') : $data;
        $rec = TargetJamHarian::find($id);
        if ($rec) {
            $equipNo = $rec->equip_no;
            $year    = $rec->plan_year;
            $month   = $rec->plan_month;
            $rec->delete();

            $totalPmHours = TargetJamHarian::where('equip_no', $equipNo)
                ->where('plan_year', $year)
                ->where('plan_month', $month)
                ->where('jam_rencana', '<', 24)
                ->sum('jam_rencana');

            TargetJamOperasi::where('equip_no', $equipNo)
                ->where('plan_year', $year)
                ->where('plan_month', $month)
                ->update(['downtime_pm' => $totalPmHours]);
        }
        return ['success' => true, 'message' => 'Jam harian berhasil dihapus'];
    }

    public function bulkSaveJamHarian($data)
    {
        $equipNo = strtoupper(trim($data['equip_no'] ?? ''));
        $year    = intval($data['plan_year']  ?? date('Y'));
        $month   = intval($data['plan_month'] ?? date('n'));
        $days    = $data['days'] ?? []; // [{day: 1, jam: 24}, ...]

        if (empty($equipNo) || empty($days)) {
            return ['success' => false, 'message' => 'equip_no dan days wajib diisi'];
        }

        foreach ($days as $d) {
            $day = intval($d['day'] ?? $d['plan_day'] ?? 0);
            $jam = floatval($d['jam'] ?? $d['jam_rencana'] ?? 0);
            if ($day < 1 || $day > 31) continue;
            TargetJamHarian::updateOrCreate(
                ['equip_no' => $equipNo, 'plan_year' => $year, 'plan_month' => $month, 'plan_day' => $day],
                ['jam_rencana' => $jam, 'downtime_type' => ($jam == 24 ? 'BD' : 'PM')]
            );
        }

        // Sync total jam PM ke tabel TargetJamOperasi
        $totalPmHours = TargetJamHarian::where('equip_no', $equipNo)
            ->where('plan_year', $year)
            ->where('plan_month', $month)
            ->where('jam_rencana', '<', 24)
            ->sum('jam_rencana');

        TargetJamOperasi::where('equip_no', $equipNo)
            ->where('plan_year', $year)
            ->where('plan_month', $month)
            ->update(['downtime_pm' => $totalPmHours]);

        return ['success' => true, 'message' => "Jam harian bulk untuk {$equipNo} berhasil disimpan"];
    }

    public function seedDemoTargetJam($data)
    {
        $year = intval($data['plan_year'] ?? 2026);
        $month = intval($data['plan_month'] ?? 9);

        $units = [
            [
                'section' => 'MINING', 'equip_no' => 'DZ 201', 'model' => 'D85ESS-2', 'est_hm' => 46700, 'est_hm_date' => '01-Sep-26', 'status' => 'RFU',
                'next_service_hours_due' => 47000, 'next_service_hours_due_2' => 47250,
                'next_service_type' => '1000', 'next_service_type_2' => '250',
                'next_service_date' => '2026-09-18', 'next_service_date_2' => '2026-10-09',
                'pm_250' => 0, 'pm_500' => 0, 'pm_1000' => 1, 'pm_2000' => 0, 'pm_4000' => 0,
                'downtime_pm' => 6, 'downtime_backlog' => 0, 'downtime_midlife' => 0, 'downtime_pcr' => 0,
                'daily' => [17 => 24, 18 => 24]
            ],
            [
                'section' => 'MINING', 'equip_no' => 'DZ 222', 'model' => 'D85ESS-2', 'est_hm' => 49000, 'est_hm_date' => '01-Sep-26', 'status' => 'RFU',
                'next_service_hours_due' => 49250, 'next_service_hours_due_2' => 49500,
                'next_service_type' => '250', 'next_service_type_2' => '500',
                'next_service_date' => '2026-09-13', 'next_service_date_2' => '2026-10-04',
                'pm_250' => 1, 'pm_500' => 0, 'pm_1000' => 0, 'pm_2000' => 0, 'pm_4000' => 0,
                'downtime_pm' => 5, 'downtime_backlog' => 0, 'downtime_midlife' => 0, 'downtime_pcr' => 0,
                'daily' => [13 => 5]
            ],
            [
                'section' => 'MINING', 'equip_no' => 'DZ 273', 'model' => 'D85ESS-2', 'est_hm' => 43900, 'est_hm_date' => '01-Sep-26', 'status' => 'RFU',
                'next_service_hours_due' => 44000, 'next_service_hours_due_2' => 44250,
                'next_service_type' => '4000', 'next_service_type_2' => '250',
                'next_service_date' => '2026-09-09', 'next_service_date_2' => '2026-09-30',
                'pm_250' => 1, 'pm_500' => 0, 'pm_1000' => 0, 'pm_2000' => 0, 'pm_4000' => 1,
                'downtime_pm' => 17, 'downtime_backlog' => 0, 'downtime_midlife' => 0, 'downtime_pcr' => 0,
                'daily' => [10 => 12, 29 => 24, 30 => 24]
            ],
            [
                'section' => 'MINING', 'equip_no' => 'DZ 281', 'model' => 'D85ESS-2', 'est_hm' => 45700, 'est_hm_date' => '01-Sep-26', 'status' => 'RFU',
                'next_service_hours_due' => 45750, 'next_service_hours_due_2' => 46000,
                'next_service_type' => '250', 'next_service_type_2' => '2000',
                'next_service_date' => '2026-09-04', 'next_service_date_2' => '2026-09-25',
                'pm_250' => 1, 'pm_500' => 0, 'pm_1000' => 0, 'pm_2000' => 1, 'pm_4000' => 0,
                'downtime_pm' => 13, 'downtime_backlog' => 0, 'downtime_midlife' => 0, 'downtime_pcr' => 0,
                'daily' => [5 => 5, 26 => 24, 27 => 24, 28 => 24]
            ],
            [
                'section' => 'MINING', 'equip_no' => 'DZ 294', 'model' => 'D85ESS-2', 'est_hm' => 46200, 'est_hm_date' => '01-Sep-26', 'status' => 'RFU',
                'next_service_hours_due' => 46250, 'next_service_hours_due_2' => 46500,
                'next_service_type' => '250', 'next_service_type_2' => '500',
                'next_service_date' => '2026-09-01', 'next_service_date_2' => '2026-09-22',
                'pm_250' => 1, 'pm_500' => 1, 'pm_1000' => 0, 'pm_2000' => 0, 'pm_4000' => 0,
                'downtime_pm' => 5, 'downtime_backlog' => 0, 'downtime_midlife' => 0, 'downtime_pcr' => 0,
                'daily' => [2 => 24, 3 => 24, 4 => 24, 5 => 24, 6 => 24, 7 => 24, 8 => 24, 9 => 24, 10 => 24, 11 => 24, 12 => 24, 13 => 24, 14 => 24, 15 => 24, 16 => 24, 17 => 24, 18 => 24, 22 => 5]
            ],
            [
                'section' => 'MINING', 'equip_no' => 'DZ 331', 'model' => 'D85ESS-2', 'est_hm' => 40800, 'est_hm_date' => '01-Sep-26', 'status' => 'RFU',
                'next_service_hours_due' => 41000, 'next_service_hours_due_2' => 41250,
                'next_service_type' => '1000', 'next_service_type_2' => '250',
                'next_service_date' => '2026-09-14', 'next_service_date_2' => '2026-10-05',
                'pm_250' => 0, 'pm_500' => 0, 'pm_1000' => 1, 'pm_2000' => 0, 'pm_4000' => 0,
                'downtime_pm' => 6, 'downtime_backlog' => 0, 'downtime_midlife' => 0, 'downtime_pcr' => 0,
                'daily' => [15 => 24, 16 => 24]
            ],
            [
                'section' => 'MINING', 'equip_no' => 'DZ 365', 'model' => 'D85ESS-2', 'est_hm' => 46900, 'est_hm_date' => '01-Sep-26', 'status' => 'RFU',
                'next_service_hours_due' => 47000, 'next_service_hours_due_2' => 47250,
                'next_service_type' => '1000', 'next_service_type_2' => '250',
                'next_service_date' => '2026-09-08', 'next_service_date_2' => '2026-09-29',
                'pm_250' => 1, 'pm_500' => 0, 'pm_1000' => 1, 'pm_2000' => 0, 'pm_4000' => 0,
                'downtime_pm' => 11, 'downtime_backlog' => 0, 'downtime_midlife' => 0, 'downtime_pcr' => 0,
                'daily' => [7 => 6, 30 => 5]
            ],
            [
                'section' => 'MINING', 'equip_no' => 'DZ 373', 'model' => 'D65P-12', 'est_hm' => 4702, 'est_hm_date' => '01-Sep-26', 'status' => 'RFU',
                'next_service_hours_due' => 4750, 'next_service_hours_due_2' => 5000,
                'next_service_type' => '250', 'next_service_type_2' => '1000',
                'next_service_date' => '2026-09-05', 'next_service_date_2' => '2026-09-25',
                'pm_250' => 1, 'pm_500' => 0, 'pm_1000' => 1, 'pm_2000' => 0, 'pm_4000' => 0,
                'downtime_pm' => 9, 'downtime_backlog' => 0, 'downtime_midlife' => 0, 'downtime_pcr' => 0,
                'daily' => [5 => 24, 6 => 24, 25 => 6]
            ],
            [
                'section' => 'MINING', 'equip_no' => 'DZ 393', 'model' => 'D65P-12', 'est_hm' => 1752, 'est_hm_date' => '01-Sep-26', 'status' => 'RFU',
                'next_service_hours_due' => 2000, 'next_service_hours_due_2' => 2250,
                'next_service_type' => '2000', 'next_service_type_2' => '250',
                'next_service_date' => '2026-09-21', 'next_service_date_2' => '2026-10-12',
                'pm_250' => 0, 'pm_500' => 0, 'pm_1000' => 0, 'pm_2000' => 1, 'pm_4000' => 0,
                'downtime_pm' => 8, 'downtime_backlog' => 0, 'downtime_midlife' => 0, 'downtime_pcr' => 0,
                'daily' => [19 => 24, 20 => 24, 21 => 24]
            ],
            [
                'section' => 'MINING', 'equip_no' => 'DZ 422', 'model' => 'D65P-12', 'est_hm' => 774, 'est_hm_date' => '01-Sep-26', 'status' => 'RFU',
                'next_service_hours_due' => 1000, 'next_service_hours_due_2' => 1250,
                'next_service_type' => '1000', 'next_service_type_2' => '250',
                'next_service_date' => '2026-09-19', 'next_service_date_2' => '2026-10-10',
                'pm_250' => 0, 'pm_500' => 0, 'pm_1000' => 1, 'pm_2000' => 0, 'pm_4000' => 0,
                'downtime_pm' => 6, 'downtime_backlog' => 0, 'downtime_midlife' => 0, 'downtime_pcr' => 0,
                'daily' => [18 => 6]
            ],
            [
                'section' => 'MINING', 'equip_no' => 'MG 081', 'model' => 'GD535', 'est_hm' => 12984, 'est_hm_date' => '01-Sep-26', 'status' => 'RFU',
                'next_service_hours_due' => 13000, 'next_service_hours_due_2' => 13250,
                'next_service_type' => '1000', 'next_service_type_2' => '250',
                'next_service_date' => '2026-09-02', 'next_service_date_2' => '2026-09-23',
                'pm_250' => 1, 'pm_500' => 0, 'pm_1000' => 1, 'pm_2000' => 0, 'pm_4000' => 0,
                'downtime_pm' => 9, 'downtime_backlog' => 0, 'downtime_midlife' => 0, 'downtime_pcr' => 0,
                'daily' => [2 => 24, 3 => 24, 22 => 3]
            ],
            [
                'section' => 'HAULING', 'equip_no' => 'MG 123', 'model' => 'GD535', 'est_hm' => 17493, 'est_hm_date' => '01-Sep-26', 'status' => 'RFU',
                'next_service_hours_due' => 17500, 'next_service_hours_due_2' => 17750,
                'next_service_type' => '500', 'next_service_type_2' => '250',
                'next_service_date' => '2026-09-01', 'next_service_date_2' => '2026-09-22',
                'pm_250' => 0, 'pm_500' => 1, 'pm_1000' => 0, 'pm_2000' => 0, 'pm_4000' => 0,
                'downtime_pm' => 3, 'downtime_backlog' => 0, 'downtime_midlife' => 0, 'downtime_pcr' => 0,
                'daily' => [21 => 24, 22 => 24]
            ],
            [
                'section' => 'MINING', 'equip_no' => 'MG 212', 'model' => 'GD535', 'est_hm' => 995, 'est_hm_date' => '01-Sep-26', 'status' => 'RFU',
                'next_service_hours_due' => 1000, 'next_service_hours_due_2' => 1250,
                'next_service_type' => '1000', 'next_service_type_2' => '250',
                'next_service_date' => '2026-09-01', 'next_service_date_2' => '2026-09-22',
                'pm_250' => 1, 'pm_500' => 0, 'pm_1000' => 1, 'pm_2000' => 0, 'pm_4000' => 0,
                'downtime_pm' => 3, 'downtime_backlog' => 0, 'downtime_midlife' => 0, 'downtime_pcr' => 0,
                'daily' => [22 => 3]
            ],
            [
                'section' => 'MINING', 'equip_no' => 'VB 124', 'model' => 'BW211D-40', 'est_hm' => 8388, 'est_hm_date' => '01-Sep-26', 'status' => 'BD',
                'next_service_hours_due' => 8500, 'next_service_hours_due_2' => 8750,
                'next_service_type' => '500', 'next_service_type_2' => '250',
                'next_service_date' => null, 'next_service_date_2' => null,
                'pm_250' => 0, 'pm_500' => 0, 'pm_1000' => 0, 'pm_2000' => 0, 'pm_4000' => 0,
                'downtime_pm' => 0, 'downtime_backlog' => 0, 'downtime_midlife' => 0, 'downtime_pcr' => 0,
                'daily' => array_fill_keys(range(1, 20), 24)
            ]
        ];

        foreach ($units as $u) {
            $daily = $u['daily'] ?? [];
            unset($u['daily']);
            $u['plan_year'] = $year;
            $u['plan_month'] = $month;

            TargetJamOperasi::updateOrCreate(
                ['equip_no' => $u['equip_no'], 'plan_year' => $year, 'plan_month' => $month],
                $u
            );

            foreach ($daily as $day => $jam) {
                TargetJamHarian::updateOrCreate(
                    ['equip_no' => $u['equip_no'], 'plan_year' => $year, 'plan_month' => $month, 'plan_day' => $day],
                    ['jam_rencana' => $jam, 'downtime_type' => ($jam == 24 ? 'BD' : 'PM')]
                );
            }
        }

        $this->logAction('SeedDemoTargetJam', "Memuat 14 data riil screenshot Juni 2024", 'PLANNER');
        return [
            'success' => true,
            'message' => 'Data Schedule Service & Downtime Gantt Juni 2024 berhasil dimuat (14 Unit)',
            'data'    => $this->getTargetJamOperasi(['plan_year' => $year, 'plan_month' => $month])
        ];
    }
}

