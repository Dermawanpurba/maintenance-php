<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            switch ($action) {
                case 'ping':
                    return response()->json(['success' => true, 'message' => 'API OK', 'version' => 'maintenance-v1-laravel13']);

                case 'getOptimizedData':
                    return response()->json($this->getOptimizedData());

                case 'login':
                    return response()->json($this->loginUser($data));

                case 'getSettings':
                    return response()->json(['success' => true, 'settings' => $this->getSettingsArray()]);

                case 'saveSettings':
                    return response()->json($this->saveSettings($data));

                case 'getUsersList':
                    return response()->json(['success' => true, 'users' => User::all()]);

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

                // PM Records
                case 'savePMRecord':
                    return response()->json($this->savePMRecord($data));

                case 'deletePMRecord':
                    return response()->json($this->deletePMRecord($data));

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
     * Replicates getOptimizedData() from code.gs line 1751
     */
    public function getOptimizedData()
    {
        // Build user access map
        $accessData = UserAccess::all();
        $userAccessMap = [];
        foreach ($accessData as $ua) {
            $u = strtolower(trim($ua->username));
            $f = trim($ua->feature);
            if (!empty($u) && !empty($f)) {
                if (!isset($userAccessMap[$u])) {
                    $userAccessMap[$u] = [];
                }
                $userAccessMap[$u][] = $f;
            }
        }

        $planAlat = $this->mapRecords(PlanAlat::all());

        return [
            'success' => true,
            'equip' => $this->mapRecords(MasterEquip::all()),
            'parts' => $this->mapRecords(MasterPart::all()),
            'stock' => $this->mapRecords(Stock::all()),
            'planAlat' => $planAlat,
            'planService' => $this->mapRecords(PlanService::all()),
            'dailyHM' => $this->mapRecords(DailyHm::all()),
            'components' => $this->mapRecords(MasterComponent::all()),
            'usersData' => $this->mapRecords(User::all()),
            'mekanikList' => $this->mapRecords(MasterMekanik::all()),
            'pelaporList' => $this->mapRecords(MasterPelapor::all()),
            'activities' => $this->mapRecords(MechanicActivity::all()),
            'wo' => $this->mapRecords(WorkOrder::all()),
            'backlog' => $this->mapRecords(Backlog::all()),
            'serviceHistory' => $this->mapRecords(ServiceHistory::all()),
            'inspections' => $this->mapRecords(Inspection::all()),
            'pcr' => $this->mapRecords(PcrComponent::all()),
            'pmRecords' => $this->mapRecords(PmRecord::all()),
            'monthlyBudget' => $this->mapRecords(MonthlyBudget::all()),
            'equipmentCosts' => $this->mapRecords(EquipmentCost::all()),
            'equipmentProductivity' => [],
            'farRecords' => $this->mapRecords(FailureAnalysis::all()),
            'swabComponents' => $this->mapRecords(SwabComponent::all()),
            'meetingNotes' => $this->mapRecords(MeetingNote::all()),
            'masterTools' => $this->mapRecords(MasterTool::all()),
            'userAccess' => $userAccessMap,
            'settings' => $this->getSettingsArray(),
            'planHours' => $planAlat
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
        $features = $data['features'] ?? [];
        if (is_string($features)) $features = json_decode($features, true) ?: [$features];

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
        UserAccess::where('username', $data['username'] ?? '')
            ->where('feature', $data['feature'] ?? '')
            ->delete();
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
        return ['success' => true, 'message' => "Work Order {$no_wo} berhasil disimpan", 'no_wo' => $no_wo];
    }

    public function updateWOStatus($data)
    {
        $no_wo = $data['no_wo'] ?? '';
        $status = $data['status'] ?? 'Closed';
        $update = ['status' => $status];
        if (isset($data['tgl_selesai'])) $update['tgl_selesai'] = $data['tgl_selesai'];
        if (isset($data['jam_selesai'])) $update['jam_selesai'] = $data['jam_selesai'];
        if (isset($data['action_log'])) $update['action_log'] = $data['action_log'];

        WorkOrder::where('no_wo', $no_wo)->update($update);
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
        $fields = [
            'item_id' => $id,
            'tanggal' => $data['tanggal'] ?? date('Y-m-d'),
            'equip_no' => $data['equip_no'] ?? '',
            'deskripsi_backlog' => $data['deskripsi_backlog'] ?? '',
            'status' => $data['status'] ?? 'Open',
            'rencana_eksekusi' => $data['rencana_eksekusi'] ?? '',
            'est_hours' => $data['est_hours'] ?? 0
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
        $fields = [
            'item_id' => $id,
            'tanggal' => $data['tanggal'] ?? date('Y-m-d'),
            'equip_no' => $data['equip_no'] ?? '',
            'hm_awal' => $data['hm_awal'] ?? 0,
            'hm_akhir' => $data['hm_akhir'] ?? 0,
            'total_hm' => $data['total_hm'] ?? 0,
            'timestamp' => now()->format('Y-m-d H:i:s')
        ];

        DailyHm::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'Daily HM berhasil disimpan', 'id' => $id];
    }

    public function deleteDailyHM($data)
    {
        $id = is_array($data) ? ($data['id'] ?? '') : $data;
        DailyHm::where('item_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'Daily HM berhasil dihapus'];
    }

    // ==================== ACTIVITIES ====================
    public function saveActivityLog($data)
    {
        $id = $data['id'] ?? $data['item_id'] ?? ('ACT-' . time());
        $fields = [
            'item_id' => $id,
            'tanggal' => $data['tanggal'] ?? date('Y-m-d'),
            'no_wo' => $data['no_wo'] ?? '',
            'mekanik' => $data['mekanik'] ?? '',
            'aktifitas' => $data['aktifitas'] ?? '',
            'jam_mulai' => $data['jam_mulai'] ?? '',
            'jam_selesai' => $data['jam_selesai'] ?? ''
        ];

        MechanicActivity::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'Aktivitas mekanik berhasil disimpan', 'id' => $id];
    }

    public function deleteActivity($data)
    {
        $id = is_array($data) ? ($data['id'] ?? '') : $data;
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
        $payload = $data['payload'] ?? $data;

        switch ($type) {
            case 'MasterEquip':
                MasterEquip::updateOrCreate(['equip_no' => $payload['equip_no']], $payload);
                break;
            case 'PlanAlat':
                PlanAlat::updateOrCreate(['equip_no' => $payload['equip_no']], $payload);
                break;
            case 'PlanService':
                PlanService::updateOrCreate(['equip_no' => $payload['equip_no']], $payload);
                break;
            case 'MasterParts':
                MasterPart::updateOrCreate(['part_number' => $payload['part_number']], $payload);
                Stock::updateOrCreate(['part_number' => $payload['part_number']], $payload);
                break;
            case 'MasterComponent':
                MasterComponent::create($payload);
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
        $fields = [
            'item_id' => $id,
            'tanggal' => $data['tanggal'] ?? date('Y-m-d'),
            'equip_no' => $data['equip_no'] ?? '',
            'tipe_alat' => $data['tipe_alat'] ?? '',
            'checklist_json' => is_array($data['checklist_json'] ?? null) ? json_encode($data['checklist_json']) : ($data['checklist_json'] ?? '[]'),
            'inspector' => $data['inspector'] ?? '',
            'timestamp' => now()->format('Y-m-d H:i:s')
        ];

        Inspection::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'Inspeksi berhasil disimpan', 'id' => $id];
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
        $fields = [
            'item_id' => $id,
            'equip_no' => $data['equip_no'] ?? '',
            'component_name' => $data['component_name'] ?? '',
            'target_lifetime_hm' => $data['target_lifetime_hm'] ?? 0,
            'current_hm' => $data['current_hm'] ?? 0,
            'remaining_hm' => $data['remaining_hm'] ?? 0,
            'status' => $data['status'] ?? 'Normal',
            'estimated_cost' => $data['estimated_cost'] ?? 0,
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
            'hm_pm' => $data['hm_pm'] ?? 0,
            'status' => $data['status'] ?? 'Completed'
        ];

        PmRecord::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'PM Record berhasil disimpan', 'id' => $id];
    }

    public function deletePMRecord($data)
    {
        $id = is_array($data) ? ($data['id'] ?? $data['pm_id'] ?? '') : $data;
        PmRecord::where('item_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'PM Record berhasil dihapus'];
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
        $id = $data['id'] ?? $data['item_id'] ?? ('FAR-' . time());
        $fields = [
            'item_id' => $id,
            'tanggal' => $data['tanggal'] ?? date('Y-m-d'),
            'equip_no' => $data['equip_no'] ?? '',
            'component_name' => $data['component_name'] ?? '',
            'chronology' => $data['chronology'] ?? '',
            'five_why_json' => is_array($data['five_why_json'] ?? null) ? json_encode($data['five_why_json']) : ($data['five_why_json'] ?? '{}'),
            'fishbone_json' => is_array($data['fishbone_json'] ?? null) ? json_encode($data['fishbone_json']) : ($data['fishbone_json'] ?? '{}'),
            'corrective_action' => $data['corrective_action'] ?? '',
            'preventive_action' => $data['preventive_action'] ?? '',
            'status' => $data['status'] ?? 'Open',
            'lead_investigator' => $data['lead_investigator'] ?? ''
        ];

        FailureAnalysis::updateOrCreate(['item_id' => $id], $fields);
        return ['success' => true, 'message' => 'FAR berhasil disimpan', 'id' => $id];
    }

    public function deleteFAR($data)
    {
        $id = is_array($data) ? ($data['id'] ?? $data['far_no'] ?? '') : $data;
        FailureAnalysis::where('item_id', $id)->orWhere('id', $id)->delete();
        return ['success' => true, 'message' => 'FAR berhasil dihapus'];
    }

    // ==================== SWAB COMPONENTS ====================
    public function saveSwabComponent($data)
    {
        $id = $data['id'] ?? $data['item_id'] ?? ('SWAB-' . time());
        $fields = [
            'item_id' => $id,
            'tanggal' => $data['tanggal'] ?? date('Y-m-d'),
            'donor_unit' => $data['donor_unit'] ?? '',
            'target_unit' => $data['target_unit'] ?? '',
            'component_name' => $data['component_name'] ?? '',
            'reason' => $data['reason'] ?? '',
            'authorized_by' => $data['authorized_by'] ?? '',
            'mechanic' => $data['mechanic'] ?? '',
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
}
