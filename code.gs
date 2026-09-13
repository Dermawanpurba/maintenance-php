// develop by : dermawan.prb@gmail.com | LinkedIn: www.linkedin.com/in/dermawan-purba-5b69241a9
// Enterprise Maintenance Management System Backend - Google Apps Script Standalone Edition

// ==========================================
// 1. CORE ROUTING & API
// ==========================================
const API_VERSION = "maintenance-v1-2026-09-11";

function doGet(e) {
  if (e && e.parameter && e.parameter.action) {
    const action = e.parameter.action;
    let data = {};
    if (e.parameter.data) {
      try { data = JSON.parse(e.parameter.data); } catch(err) { data = e.parameter; }
    } else {
      data = e.parameter;
    }
    
    let result = { success: false, message: "Unknown action" };
    switch(action) {
      case "ping": result = { success: true, message: "API OK", version: API_VERSION }; break;
      case "getOptimizedData": result = getOptimizedData(); break;
      case "getSettings": result = getSettings(); break;
      case "getUsersList": result = getUsersList(); break;
      case "getAllUserAccess": result = getAllUserAccess(); break;
      case "getSystemLogs": result = getSystemLogs(); break;
      case "setupDatabase": result = { success: false, message: "Setup database hanya diizinkan melalui POST." }; break;
      default: result = { success: false, message: "Action tidak dikenal via GET" };
    }
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }

  // Nama file HtmlService bersifat case-sensitive. Project harus memiliki file index.html.
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('WOSys ERP - Professional')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1');
}

function doPost(e) {
  try {
    const req = JSON.parse(e.postData.contents || "{}");
    const action = req.action || "";
    const data = req.data || {};

    let result = { success: false, message: "Unknown action" };

    switch(action) {
      case "ping": result = { success: true, message: "API OK", version: API_VERSION }; break;
      case "setupDatabase":
      case "seedRealisticData":
        result = { success: true, message: setupDatabase(data && data.forceSeed !== undefined ? data.forceSeed : true) };
        break;
      case "login": result = loginUser(data); break;
      case "getOptimizedData": result = getOptimizedData(); break;
      case "saveWorkOrder": result = saveWorkOrder(data); break;
      case "updateWOStatus": result = updateWOStatus(data.no_wo, data.status, data.tgl_selesai, data.jam_selesai, data.action_log); break;
      case "deleteWO": result = deleteWO(data.no_wo); break;
      case "saveBacklog": result = saveBacklog(data); break;
      case "updateBacklogStatus": result = updateBacklogStatus(data.id, data.status); break;
      case "deleteBacklog": result = deleteBacklog(data.id); break;
      case "saveDailyHM": result = saveDailyHM(data); break;
      case "deleteDailyHM": result = deleteDailyHM(data.id); break;
      case "saveActivityLog": result = saveActivityLog(data); break;
      case "deleteActivity": result = deleteActivity(data.id); break;
      case "saveServiceHistory": result = saveServiceHistory(data); break;
      case "deleteServiceHistory": result = deleteServiceHistory(data.id); break;
      case "saveMaster": result = saveMaster(data.type, data.payload); break;
      case "deleteMasterEquip": result = deleteMasterEquip(data.equip_no); break;
      case "deletePlan": result = deletePlan(data.equip_no, data.type); break;
      case "getSettings": result = getSettings(); break;
      case "saveSettings": result = saveSettings(data); break;
      case "saveUser": result = saveUser(data); break;
      case "approveUser": result = approveUser(data.username, data.status); break;
      case "getUsersList": result = getUsersList(); break;
      case "deleteUser": result = deleteUser(data.username); break;
      case "getUserAccess": result = getUserAccess(data.username); break;
      case "saveUserAccess": result = saveUserAccess(data.username, data.features); break;
      case "deleteUserAccess": result = deleteUserAccess(data.username, data.feature); break;
      case "getAllUserAccess": result = getAllUserAccess(); break;
      case "saveInspection": result = saveInspection(data); break;
      case "deleteInspection": result = deleteInspection(data.id); break;
      case "getSystemLogs": result = getSystemLogs(); break;
      
      // NEW MODULE ACTIONS
      case "savePCR": result = savePCR(data); break;
      case "deletePCR": result = deletePCR(data.id || data.pcr_id); break;
      case "savePMRecord": result = savePMRecord(data); break;
      case "deletePMRecord": result = deletePMRecord(data.id || data.pm_id); break;
      case "saveMonthlyBudget": result = saveMonthlyBudget(data); break;
      case "deleteMonthlyBudget": result = deleteMonthlyBudget(data.id || data.budget_id); break;
      case "saveEquipmentCost": result = saveEquipmentCost(data); break;
      case "deleteEquipmentCost": result = deleteEquipmentCost(data.id || data.cost_id); break;
      case "deleteLegacyProductivitySheet": result = deleteLegacyProductivitySheet(); break;
      case "saveFAR": result = saveFAR(data); break;
      case "deleteFAR": result = deleteFAR(data.id || data.far_no); break;
      case "saveSwabComponent": result = saveSwabComponent(data); break;
      case "updateSwabStatus": result = updateSwabStatus(data.id || data.swab_id, data.status, data.restoration_date || data.target_restore_date); break;
      case "deleteSwabComponent": result = deleteSwabComponent(data.id || data.swab_id); break;
      case "saveMeetingNotes": result = saveMeetingNotes(data); break;
      case "deleteMeetingNotes": result = deleteMeetingNotes(data.id || data.meeting_id); break;
      case "saveMasterTool": result = saveMasterTool(data); break;
      case "updateToolBorrowStatus": result = updateToolBorrowStatus(data.tool_id, data.status, data.borrower); break;
      case "deleteMasterTool": result = deleteMasterTool(data.tool_id || data.id); break;
      case "deleteStock":
      case "deleteMasterPart":
      case "deletePart":
        result = deleteStock(data.part_number || data.partNo || data.id);
        break;
      case "deleteMasterComponent":
      case "deleteComponent":
        result = deleteMasterComponent(data.component_id || data.component || data.id);
        break;

      case "generateBacklogIDs": result = generateBacklogIDs(); break;
      case "generateDailyHMIDs": result = generateDailyHMIDs(); break;
      case "generateActivityIDs": result = generateActivityIDs(); break;
      case "generateServiceHistoryIDs": result = generateServiceHistoryIDs(); break;
      case "migratePartUsageToWorkOrdersSheet": result = migratePartUsageToWorkOrdersSheet(); break;
      case "saveMekanik": result = saveMekanik(data); break;
      case "deleteMekanik": result = deleteMekanik(data.id || data.nama_mekanik); break;
      case "savePelapor": result = savePelapor(data); break;
      case "deletePelapor": result = deletePelapor(data.id || data.nama_pelapor); break;
      case "clearSheetData": result = clearSheetData(data.sheetName); break;
      case "clearAllOperationalData": result = clearAllOperationalData(); break;
      default: result = { success: false, message: "Action tidak dikenal" };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    logSystem("doPost_Error", err.toString(), "SYSTEM");
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function router(action, data) {
  try {
    const e = { 
      postData: { 
        contents: JSON.stringify({ action: action, data: data }) 
      } 
    };
    const response = doPost(e);
    return response.getContent(); 
  } catch(err) {
    return JSON.stringify({ success: false, message: "Router Error: " + err.toString() });
  }
}

// ==========================================
// 2. SYSTEM & DATABASE SETUP
// ==========================================
function getSpreadsheet_() {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;

  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error("Spreadsheet tidak terhubung. Isi Script Property SPREADSHEET_ID dengan ID Google Spreadsheet, lalu deploy ulang Web App.");
  }

  return SpreadsheetApp.openById(spreadsheetId);
}

function setSpreadsheetId(spreadsheetId) {
  const normalizedId = String(spreadsheetId || "").trim();
  if (!normalizedId) throw new Error("Spreadsheet ID wajib diisi.");
  const spreadsheet = SpreadsheetApp.openById(normalizedId);
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', normalizedId);
  return "Spreadsheet terhubung: " + spreadsheet.getName();
}

function logSystem(action, message, user) {
  user = user || "SYSTEM";
  try {
    const ss = getSpreadsheet_();
    let logSheet = ss.getSheetByName('SystemLogs');
    if (!logSheet) {
      logSheet = ss.insertSheet('SystemLogs');
      logSheet.appendRow(['Timestamp', 'Action', 'Message', 'User']);
    }
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    logSheet.appendRow([timestamp, action, message, user]);
  } catch (e) {}
}

// ==========================================
// SHORTCUT EDITOR: Pilih fungsi ini di GAS Editor
// lalu klik ▶ Run untuk mengisi semua sheet.
// ==========================================
function runSetupDatabase() {
  const msg = setupDatabase(true);
  try {
    SpreadsheetApp.getUi().alert('✅ Setup Selesai', msg, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch(e) {
    Logger.log('Setup selesai: ' + msg);
  }
}

function setupDatabase(forceSeed) {
  // forceSeed=true  → hapus & isi ulang semua data sample (default saat dipanggil manual)
  // forceSeed=false → hanya buat struktur header, jangan hapus data operasional
  if (typeof forceSeed === 'undefined') forceSeed = true;
  const ss = getSpreadsheet_();
  const tz = Session.getScriptTimeZone() || "GMT+8";
  
  // Tanggal dinamis: Otomatis menggunakan tanggal hari ini saat dieksekusi
  const baseDate = new Date();
  const todayStr = Utilities.formatDate(baseDate, tz, "yyyy-MM-dd");
  
  // Fixed reference date for consistent sample data (Sep 1, 2026)
  const refDate = new Date("2026-09-01T00:00:00");
  const refDateStr = "2026-09-01";
  
  function getSampleDate(daysAgo) {
    const d = new Date(refDate.getTime() + (daysAgo * 24 * 60 * 60 * 1000));
    return Utilities.formatDate(d, tz, "yyyy-MM-dd");
  }
  
  function getTodaySampleDate() {
    return todayStr;
  }

  function ensureSheet(name, headers, sampleRows) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    
    // Set headers
    if (lastRow === 0 || lastCol < headers.length) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    // Sample data is destructive and may only be written by explicit setupDatabase(true).
    if (forceSeed && sampleRows && sampleRows.length > 0) {
      const normalizedRows = sampleRows.map(function(row) {
        const normalized = row.slice(0, headers.length);
        while (normalized.length < headers.length) normalized.push("");
        return normalized;
      });
      sheet.clearContents();
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(2, 1, normalizedRows.length, headers.length).setValues(normalizedRows);
    }
    return sheet;
  }

  // 1. USERS & AUTHS (identitas mengacu workbook populasi PT. KUK)
  const userHeaders = ['Username', 'Password', 'Nama', 'Role', 'Status'];
  const userRows = [
    ['planner', '123456', 'Andi Herwan', 'PMC', 'ACTIVE'],
    ['admin', '123456', 'Brayen', 'Logistic', 'ACTIVE'],
    ['mekanik1', '123456', 'Tim Mekanik KBCT', 'Mekanik', 'ACTIVE'],
    ['mekanik2', '123456', 'Tim Mekanik LMP', 'Mekanik', 'ACTIVE'],
    ['boss', '123456', 'Hariadi', 'GM & Mgr. Maintenance', 'ACTIVE'],
    ['direksi', '123456', 'M. Nur Salam', 'Direksi', 'ACTIVE']
  ];
  ensureSheet('Users', userHeaders, userRows);

  // 2. USER ACCESS (HAK AKSES FITUR PER USER)
  const allFeatures = [
    'dashboard', 'top-management', 'database-3d', 'buat-wo', 'list-wo',
    'backlog', 'pm-hub', 'pm-washing', 'pm-greasing', 'pm-inspection', 'pm-torque', 'pm-battery', 'pcr', 'swab-component', 'far',
    'daily-hm', 'aktifitas', 'inspection', 
    'monthly-budget', 'meeting-notes', 'pesan-instan', 
    'master-unit', 'master-stock', 'master-tools', 'master-mekanik', 'master-comp', 
    'manage-users', 'pengaturan', 'systemlogs'
  ];
  const accessHeaders = ['Username', 'Feature', 'Timestamp'];
  const accessRows = [];
  
  ['planner', 'admin'].forEach(u => {
    allFeatures.forEach(f => accessRows.push([u, f, todayStr + ' 08:00:00']));
  });
  
  ['mekanik1', 'mekanik2'].forEach(u => {
    ['dashboard', 'buat-wo', 'list-wo', 'backlog', 'pm-hub', 'pm-washing', 'pm-greasing', 'pm-inspection', 'pm-torque', 'pm-battery', 'pcr', 'swab-component', 'far', 'daily-hm', 'aktifitas', 'inspection', 'pesan-instan', 'master-tools'].forEach(f => {
      accessRows.push([u, f, todayStr + ' 08:00:00']);
    });
  });

  ['boss', 'direksi'].forEach(u => {
    ['top-management', 'database-3d', 'dashboard', 'list-wo', 'monthly-budget', 'meeting-notes', 'pesan-instan', 'far', 'pcr', 'inspection', 'master-unit', 'master-stock', 'master-tools', 'master-comp', 'systemlogs'].forEach(f => {
      accessRows.push([u, f, todayStr + ' 08:00:00']);
    });
  });
  ensureSheet('UserAccess', accessHeaders, accessRows);

  // 3. MASTER PLAN ALAT (POPULASI UNIT KUK-KBCT 2026 - SEMUA 39 UNIT DARI EXCEL)
  const planHeaders = ['Equip_No', 'Model', 'Plan_Hours_Per_Month', 'Plan_PA', 'MOHH', 'Category', 'Status'];
  const planRows = [
    // BULLDOZER (7 unit) - Excel row 6-12
    ['DZ-002', 'ZOOMLION ZD-320-3', 720, 85, 450, 'BULLDOZER', 'AKTIF'],
    ['DZ-005', 'SEM 822D', 720, 85, 450, 'BULLDOZER', 'AKTIF'],
    ['DZ-069', 'ZOOMLION ZD-220-3', 720, 85, 450, 'BULLDOZER', 'AKTIF'],
    ['DZ-007', 'CAT D8 GC', 720, 85, 450, 'BULLDOZER', 'AKTIF'],
    ['DZ-008', 'CAT D8 GC', 720, 85, 450, 'BULLDOZER', 'AKTIF'],
    ['DZ-010', 'CAT D8 GC', 720, 85, 450, 'BULLDOZER', 'AKTIF'],
    ['DZ-012', 'SEM 822D', 720, 85, 450, 'BULLDOZER', 'AKTIF'],
    // EXCAVATOR / EXCAVATOR LONG ARM (9 unit) - Excel row 13-21
    ['EX-201', 'HYUNDAY HX220S', 720, 88, 500, 'EXCAVATOR', 'AKTIF'],
    ['EX-205', 'CAT 320 GX', 720, 90, 500, 'EXCAVATOR', 'AKTIF'],
    ['EX-302', 'SANY SY330H', 720, 90, 500, 'EXCAVATOR', 'AKTIF'],
    ['EX-304', 'SANY SY330H', 720, 90, 500, 'EXCAVATOR', 'AKTIF'],
    ['EX-305', 'SANY SY330H', 720, 90, 500, 'EXCAVATOR', 'AKTIF'],
    ['EX-306', 'DOSAN DX300LCA-7M', 720, 90, 500, 'EXCAVATOR', 'AKTIF'],
    ['EX-309', 'CAT 330 GX', 720, 90, 500, 'EXCAVATOR', 'AKTIF'],
    ['EX-310', 'CAT 330 GX', 720, 90, 500, 'EXCAVATOR', 'AKTIF'],
    ['EX-311', 'CAT 330 GX', 720, 90, 500, 'EXCAVATOR', 'AKTIF'],
    // WHEEL LOADER (4 unit) - Excel row 22-25
    ['WL-010', 'SEM 660D', 720, 88, 450, 'WHEEL LOADER', 'AKTIF'],
    ['WL-016', 'LUGONG T-930', 720, 85, 450, 'WHEEL LOADER', 'AKTIF'],
    ['WL-017', 'LOVOL FL955F-II', 720, 88, 450, 'WHEEL LOADER', 'AKTIF'],
    ['WL-019', 'LIU GONG CLG870H', 720, 85, 450, 'WHEEL LOADER', 'AKTIF'],
    // SKID STEER LOADER (4 unit) - Excel row 26-29
    ['SL-100', 'BOBCAT S570', 640, 90, 400, 'SKID STEER LOADER', 'AKTIF'],
    ['SL-200', 'LIUGONG CLG375B', 640, 90, 400, 'SKID STEER LOADER', 'AKTIF'],
    ['SL-300', 'CAT 226B3', 640, 90, 400, 'SKID STEER LOADER', 'AKTIF'],
    ['SL-400', 'LIUGONG CLG375B', 640, 90, 400, 'SKID STEER LOADER', 'AKTIF'],
    // DUMP TRUCK (5 unit) - Excel row 30-34
    ['DT-3011', 'SHACMAN F3000', 800, 90, 550, 'DUMP TRUCK', 'AKTIF'],
    ['DT-3012', 'SHACMAN F3000', 800, 90, 550, 'DUMP TRUCK', 'AKTIF'],
    ['DT-3017', 'SHACMAN F3000', 800, 90, 550, 'DUMP TRUCK', 'AKTIF'],
    ['DT-3018', 'SHACMAN F3000', 800, 90, 550, 'DUMP TRUCK', 'AKTIF'],
    ['DT-3019', 'SHACMAN F3000', 800, 90, 550, 'DUMP TRUCK', 'AKTIF'],
    // WATER TRUCK (2 unit) - Excel row 35-36
    ['WT-009', 'QUESTER CWE 280', 720, 92, 500, 'WATER TRUCK', 'AKTIF'],
    ['WT-011', 'QUESTER CWE 280', 720, 92, 500, 'WATER TRUCK', 'AKTIF'],
    // LUBE TRUCK (1 unit) - Excel row 37
    ['ST-002', 'FAW 140LT', 600, 92, 350, 'LUBE TRUCK', 'AKTIF'],
    // GENSET 40 KVa (2 unit) - Excel row 38-39
    ['GST-003', 'V-GEN VG40-I', 720, 95, 300, 'GENSET', 'AKTIF'],
    ['GST-004', 'V-GEN VG40-I', 720, 95, 300, 'GENSET', 'AKTIF']
  ];
  ensureSheet('PlanAlat', planHeaders, planRows);

  // 4. PLAN SERVICE (service interval semua unit - populasi KUK-LMP KBCT 2026)
  // Service interval berdasarkan tipe alat: Bulldozer/Excavator 250H, Wheel Loader 500H,
  // Truck/Genset 500H, Skid Steer 250H. HM diselaraskan dengan populationHM.
  const planServiceHeaders = ['Equip_No', 'Model', 'Plan_Hours_Per_Month', 'Plan_PA', 'Last_Service_Date', 'Last_Service_HM', 'Next_Service_HM', 'Kategori'];
  const planServiceRows = [
    // BULLDOZER - interval 250H (HM_last = populationHM start - sisa ke servis berikutnya)
    ['DZ-002', 'ZOOMLION ZD-320-3', 720, 85, getSampleDate(-14), 8250, 8500, 'SERVICE 250H'],
    ['DZ-005', 'SEM 822D', 720, 85, getSampleDate(-12), 7000, 7250, 'SERVICE 250H'],
    ['DZ-069', 'ZOOMLION ZD-220-3', 720, 85, getSampleDate(-15), 6750, 7000, 'SERVICE 250H'],
    ['DZ-007', 'CAT D8 GC', 720, 85, getSampleDate(-5), 11750, 12000, 'SERVICE 250H'],
    ['DZ-008', 'CAT D8 GC', 720, 85, getSampleDate(-10), 11500, 11750, 'SERVICE 250H'],
    ['DZ-010', 'CAT D8 GC', 720, 85, getSampleDate(-14), 9000, 9250, 'SERVICE 250H'],
    ['DZ-012', 'SEM 822D', 720, 85, getSampleDate(-18), 7000, 7250, 'SERVICE 250H'],
    // EXCAVATOR - interval 250H
    ['EX-201', 'HYUNDAY HX220S', 720, 88, getSampleDate(-14), 4250, 4500, 'SERVICE 250H'],
    ['EX-205', 'CAT 320 GX', 720, 90, getSampleDate(-6), 4250, 4500, 'SERVICE 250H'],
    ['EX-302', 'SANY SY330H', 720, 90, getSampleDate(-20), 3750, 4000, 'SERVICE 250H'],
    ['EX-304', 'SANY SY330H', 720, 90, getSampleDate(-18), 3000, 3250, 'SERVICE 250H'],
    ['EX-305', 'SANY SY330H', 720, 90, getSampleDate(-16), 2750, 3000, 'SERVICE 250H'],
    ['EX-306', 'DOSAN DX300LCA-7M', 720, 90, getSampleDate(-16), 5250, 5500, 'SERVICE 250H'],
    ['EX-309', 'CAT 330 GX', 720, 90, getSampleDate(-10), 250, 500, 'SERVICE 250H'],
    ['EX-310', 'CAT 330 GX', 720, 90, getSampleDate(-22), 1500, 1750, 'SERVICE 250H'],
    ['EX-311', 'CAT 330 GX', 720, 90, getSampleDate(-22), 1500, 1750, 'SERVICE 250H'],
    // WHEEL LOADER - interval 500H
    ['WL-010', 'SEM 660D', 720, 88, getSampleDate(-16), 5000, 5500, 'SERVICE 500H'],
    ['WL-016', 'LIUGONG T-930', 720, 85, getSampleDate(-14), 2000, 2500, 'SERVICE 500H'],
    ['WL-017', 'LOVOL FL955F-II', 720, 88, getSampleDate(-14), 6750, 7250, 'SERVICE 500H'],
    ['WL-019', 'LIU GONG CLG870H', 720, 85, getSampleDate(-8), 3750, 4250, 'SERVICE 500H'],
    // SKID STEER - interval 250H
    ['SL-100', 'BOBCAT S570', 640, 90, getSampleDate(-18), 1750, 2000, 'SERVICE 250H'],
    ['SL-200', 'LIUGONG CLG375B', 640, 90, getSampleDate(-16), 2250, 2500, 'SERVICE 250H'],
    ['SL-300', 'CAT 226B3', 640, 90, getSampleDate(-20), 1750, 2000, 'SERVICE 250H'],
    ['SL-400', 'LIUGONG CLG375B', 640, 90, getSampleDate(-14), 1500, 1750, 'SERVICE 250H'],
    // DUMP TRUCK - interval 500H
    ['DT-3011', 'SHACMAN F3000', 800, 90, getSampleDate(-8), 6000, 6500, 'SERVICE 500H'],
    ['DT-3012', 'SHACMAN F3000', 800, 90, getSampleDate(-12), 5250, 5750, 'SERVICE 500H'],
    ['DT-3017', 'SHACMAN F3000', 800, 90, getSampleDate(-10), 5750, 6250, 'SERVICE 500H'],
    ['DT-3018', 'SHACMAN F3000', 800, 90, getSampleDate(-14), 4750, 5250, 'SERVICE 500H'],
    ['DT-3019', 'SHACMAN F3000', 800, 90, getSampleDate(-15), 6250, 6750, 'SERVICE 500H'],
    // WATER TRUCK - interval 500H
    ['WT-009', 'QUESTER CWE 280', 720, 92, getSampleDate(-20), 3250, 3750, 'SERVICE 500H'],
    ['WT-011', 'QUESTER CWE 280', 720, 92, getSampleDate(-12), 3000, 3500, 'SERVICE 500H'],
    // LUBE TRUCK - interval 250H
    ['ST-002', 'FAW 140LT', 600, 92, getSampleDate(-5), 750, 1000, 'SERVICE 250H'],
    // GENSET - interval 500H
    ['GST-003', 'V-GEN VG40-I', 720, 95, getSampleDate(-15), 4750, 5250, 'SERVICE 500H'],
    ['GST-004', 'V-GEN VG40-I', 720, 95, getSampleDate(-10), 4500, 5000, 'SERVICE 500H']
  ];
  ensureSheet('PlanService', planServiceHeaders, planServiceRows);

  // 5. MASTER EQUIPMENTS (34 unit dari workbook POPULASI UNIT KUK-LMP KBCT 2026 - EXACT MATCH EXCEL)
  // Column mapping Excel: DESCRIPTION->Unit_Type, CODE INVENTORY->Equip_No, STATUS->Warranty_Status,
  // MODEL->Model, SERIAL NO->Serial_No, MODEL ENGINE->Model_Engine, SERIAL ENGINE->Serial_Engine,
  // Kapasitas Unit->Capacity_Unit, Kapasitas Bucket->Capacity_Attachment(m³), Dimensi Unit->Dimension_Unit,
  // Dimensi Bucket->Dimension_Attachment(m³), Rate Power->Rate_Power_Kw, YEAR->Year, STATUS2->Status, LOCATION->Location
  const equipHeaders = [
    'Equip_No', 'Brand', 'Unit_Type', 'Warranty_Status', 'Model', 'Serial_No',
    'Model_Engine', 'Serial_Engine', 'Capacity_Unit', 'Capacity_Attachment',
    'Dimension_Unit', 'Dimension_Attachment', 'Rate_Power_Kw', 'Year', 'Status', 'Location'
  ];
  const equipRows = [
    // BULLDOZER (7 unit) - Excel baris 6-12
    ['DZ-002','ZOOMLION','BULLDOZER','NON WARRANTY','ZOOMLION ZD-320-3','ZMTZD062PN0001169','CUMMINS NTA855-C360S10','41326274','35.044 kg','11,6 m³','6.625x4.030x3.725','4.030x1.705',257,2022,'READY','KBCT'],
    ['DZ-005','SEM','BULLDOZER','NON WARRANTY','SEM 822D','SEM00822VS8T00933','WEICHAI WD12G240E206','1122S001731','24.000 kg','6,4 m³','5.845x3.660x3.170','3.660x1.520',175,2022,'READY','KBCT'],
    ['DZ-069','ZOOMLION','BULLDOZER','NON WARRANTY','ZOOMLION ZD-220-3','ZMTZD030TN0005482','CUMMINS NTA855-C280','41331692','23.600 kg','6,4 m³','5.460x3.725x3.395','3.725x1.315',175,2022,'READY','KBCT'],
    ['DZ-007','CATERPILLAR','BULLDOZER','NON WARRANTY','CAT D8 GC','CAT000D8LKGX00408','CAT 3406C','TXJ02310','37.000 kg','0,93 m³','','',130,2022,'BREAKDOWN','KBCT'],
    ['DZ-008','CATERPILLAR','BULLDOZER','NON WARRANTY','CAT D8 GC','CAT000D8LKGX00452','CAT 3406C','TXJ02531','37.000 kg','0,93 m³','','',130,2022,'READY','KBCT'],
    ['DZ-010','CATERPILLAR','BULLDOZER','WARRANTY','CAT D8 GC','CAT000D8HKGX00474','CAT 3406C','','37.000 kg','0,93 m³','','',130,2023,'READY','LMP'],
    ['DZ-012','SEM','BULLDOZER','WARRANTY','SEM 822D','SEM00822AS8T01064','WEICHAI WD12G240E206','1123D000428','24.000 kg','6,4 m³','5.845x3.660x3.170','3.660x1.520',175,2023,'READY','KBCT'],
    // EXCAVATOR / EXCAVATOR LONG ARM (8 unit) - Excel baris 13-21
    ['EX-201','HYUNDAI','EXCAVATOR LONG ARM','NON WARRANTY','HYUNDAY HX220S','HHKHK606JE0003070','6BTAA-5.9','84962481','24.390 kg','0,52 m³','12.030x3.190x3.280','',110,2022,'READY','LMP'],
    ['EX-205','CATERPILLAR','EXCAVATOR','WARRANTY','CAT 320 GX','CAT00320JSYW40665','CAT C4.4','2W239272','20.500 kg','1,00 m³','9.580x2.990x3.240','0,93',108,2024,'READY','KBCT'],
    ['EX-302','SANY','EXCAVATOR','NON WARRANTY','SANY SY330H','SY0332CB13708','ISUZU 6HK1XKSC-01','966626','31.500 kg','2,0 m³','10.667x3.190x3.470','',212,2022,'READY','KBCT'],
    ['EX-304','SANY','EXCAVATOR','NON WARRANTY','SANY SY330H','SY0332CB13578','ISUZU 6HK1XKSC-01','966606','31.500 kg','2,0 m³','10.667x3.190x3.470','',212,2022,'READY','KBCT'],
    ['EX-305','SANY','EXCAVATOR','NON WARRANTY','SANY SY330H','SY0332CB15188','ISUZU 6HK1XKSC-01','968608','31.500 kg','2,0 m³','10.667x3.190x3.470','',212,2022,'READY','KBCT'],
    ['EX-306','DOOSAN','EXCAVATOR','NON WARRANTY','DOSAN DX300LCA-7M','CECFK-001257','DOSAN DE08TIS','284561','31.400 kg','1,72 m³','10.710x3.200x6.615','',205,2022,'READY','KBCT'],
    ['EX-309','CATERPILLAR','EXCAVATOR','WARRANTY','CAT 330 GX','CAT00330LFEK60026','','','','','','','',2024,'READY','KBCT'],
    ['EX-310','CATERPILLAR','EXCAVATOR','WARRANTY','CAT 330 GX','CAT00330TFEK60694','C7.1','E7A67577','1848 kg','2,4 m³','','',159,2025,'READY','KBCT'],
    ['EX-311','CATERPILLAR','EXCAVATOR','WARRANTY','CAT 330 GX','CAT00330JFEK60697','C7.1','E7A67576','1848 kg','2,4 m³','','',159,2025,'READY','KBCT'],
    // WHEEL LOADER (4 unit) - Excel baris 22-25
    ['WL-010','SEM','WHEEL LOADER','NON WARRANTY','SEM 660D','SEM00660CS6203075','WEICHAI WD10G240E203','1221G008520','20.000 kg','3,3 m³ - 5,5 m³','8.414x3.370x3.458','3370',178,2022,'READY','KBCT'],
    ['WL-016','LIUGONG','WHEEL LOADER','NON WARRANTY','LUGONG T-930','T92823060173','SD490','SD5061623','1.900 kg','0,8 m³','5.530x1.860x2.750','1900',65,2023,'BREAKDOWN','KBCT'],
    ['WL-017','LOVOL','WHEEL LOADER','NON WARRANTY','LOVOL FL955F-II','HKD2B2J1A301','WD10G220E23','1222SO11299','16620 kg','3 m³','7700x2980x3430','',162,2024,'READY','KBCT'],
    ['WL-019','LIUGONG','WHEEL LOADER','WARRANTY','LIU GONG CLG870H','CLG870HZHPL813667','QSL9.313TC190A2','','','','','',190,2024,'BREAKDOWN','KBCT'],
    // SKID STEER LOADER (4 unit) - Excel baris 26-29
    ['SL-100','BOBCAT','SKID STEER LOADER','NON WARRANTY','BOBCAT S570','AZNB14327','KUBOTA V2607-DI-T-EU4','V2607-8MM8854','2.900 kg','2,6 m³','3.378x1.727x1.972','828',45.5,2022,'READY','KBCT'],
    ['SL-200','LIUGONG','SKID STEER LOADER','NON WARRANTY','LIUGONG CLG375B','LGC375BZJPC505808','4TNV98-ZCPLYSC','B0416A','3.100 kg','0,45 m³','3.610X2.000X1.960','',43,2024,'READY','KBCT'],
    ['SL-300','CATERPILLAR','SKID STEER LOADER','WARRANTY','CAT 226B3','CAT0226BLDXZ04062','CAT C2.2 T','CZ212464','2641 kg','0,36 m³','2.519X1.950X1.525','1524',45.5,2024,'READY','KBCT'],
    ['SL-400','LIUGONG','SKID STEER LOADER','WARRANTY','LIUGONG CLG375B','LGC375BZLPC505801','4TNV98-ZCPLYSC','B0408A','3.100 kg','0,45 m³','3.610X2.000X1.960','',43,2024,'READY','KBCT'],
    // DUMP TRUCK (5 unit) - Excel baris 30-34
    ['DT-3011','SHACMAN','DUMP TRUCK','WARRANTY','SHACMAN F3000','LZGJLDR42RX094520','WP10.340E22','1624S054055','41.500 kg','20 m³','8600x2500x3550','',250,2024,'READY','KBCT'],
    ['DT-3012','SHACMAN','DUMP TRUCK','WARRANTY','SHACMAN F3000','LZGJLDR44RX094521','WP10.340E22','1624S053548','41.500 kg','20 m³','8600x2500x3550','',250,2024,'READY','KBCT'],
    ['DT-3017','SHACMAN','DUMP TRUCK','WARRANTY','SHACMAN F3000','LZGJLDR43RX094526','WP10.340E22','1624S054065','41.500 kg','20 m³','8600x2500x3550','',250,2024,'READY','KBCT'],
    ['DT-3018','SHACMAN','DUMP TRUCK','WARRANTY','SHACMAN F3000','LZGJLDR45RX094527','WP10.340E22','','41.500 kg','20 m³','8600x2500x3550','',250,2024,'READY','KBCT'],
    ['DT-3019','SHACMAN','DUMP TRUCK','WARRANTY','SHACMAN F3000','LZGJLDR44RX067092','WP10.340E22','1624S053838','41.500 kg','20 m³','8600x2500x3550','',250,2024,'READY','KBCT'],
    // WATER TRUCK (2 unit) - Excel baris 35-36
    ['WT-009','UD TRUCKS','WATER TRUCK 20.000 KL','NON WARRANTY','QUESTER CWE 280','MFFCWZ50GRK826769','GH8E280E5','634112','26.000 kg','20 m³','11875x2500x3220','',280,2024,'READY','KBCT'],
    ['WT-011','UD TRUCKS','WATER TRUCK 20.000 KL','WARRANTY','QUESTER CWE 280','MFFCWZ50GRJ829721','GH8E280E5','GH8E*665623*C1*P','26.000 kg','20 m³','11875x2500x3220','',280,2024,'READY','KBCT'],
    // LUBE TRUCK (1 unit) - Excel baris 37
    ['ST-002','FAW','LUBE TRUCK','WARRANTY','FAW 140LT','','YC4D140-48','D58Y1R10021','','','','',98,2025,'READY','KBCT'],
    // GENSET 40 KVa (2 unit) - Excel baris 38-39
    ['GST-003','V-GEN','GENSET 40 KVA','WARRANTY','V-GEN VG40-I','VG24312128','ISUZU 4JA1-F1','5108291','40 KvA','','','','',2025,'READY','KBCT'],
    ['GST-004','V-GEN','GENSET 40 KVA','WARRANTY','V-GEN VG40-I','VG24312136','ISUZU 4JA1-F1','5108284','40 KvA','','','','',2025,'READY','KBCT']
  ];

  // Migrate legacy four-column schema by header name before writing new columns.
  let equipSheet = ss.getSheetByName('MasterEquip');
  if (equipSheet && equipSheet.getLastRow() > 0) {
    const oldValues = equipSheet.getDataRange().getValues();
    const oldHeaders = oldValues[0].map(String);
    const schemaChanged = equipHeaders.some(function(header, index) { return oldHeaders[index] !== header; });
    if (schemaChanged) {
      const migrated = oldValues.slice(1).filter(function(row) { return row[0] !== '' && row[0] !== null; }).map(function(row) {
        return equipHeaders.map(function(header) {
          const oldIndex = oldHeaders.indexOf(header);
          return oldIndex >= 0 ? row[oldIndex] : '';
        });
      });
      equipSheet.clearContents();
      equipSheet.getRange(1, 1, 1, equipHeaders.length).setValues([equipHeaders]);
      if (migrated.length) equipSheet.getRange(2, 1, migrated.length, equipHeaders.length).setValues(migrated);
    }
  }
  equipSheet = ensureSheet('MasterEquip', equipHeaders, equipRows);
  if (!forceSeed) syncRowsByKey_(equipSheet, equipRows);

  // 6. MASTER PARTS & STOCK INVENTORY
  const partsHeaders = ['Part_Number', 'Description', 'UOM', 'Stock', 'Min_Stock', 'Price', 'Category_Spare_Part', 'Qty_Final'];
  const partsRows = [
    ['6732-71-6120', 'FILTER OLI MESIN PC200-8', 'PC', 24, 5, 350000, 'FILTER', 24],
    ['600-319-3550', 'FILTER SOLAR FUEL WATER SEPARATOR', 'PC', 18, 5, 520000, 'FILTER', 18],
    ['07000-12065', 'O-RING SEAL HYDRAULIC ARM CYLINDER', 'PC', 35, 10, 175000, 'SEAL & O-RING', 35],
    ['708-2L-00300', 'MAIN HYDRAULIC PUMP ASSY', 'SET', 2, 1, 28500000, 'HYDRAULIC', 2],
    ['600-821-6120', 'ALTERNATOR 24V 60A KOMATSU', 'PC', 4, 2, 4200000, 'ELECTRICAL', 4],
    ['07108-20512', 'HYDRAULIC HOSE HIGH PRESSURE 3/4 INCH', 'MTR', 50, 15, 480000, 'HOSE', 50],
    ['205-70-19570', 'BUCKET TOOTH POINT PC200', 'PC', 40, 10, 275000, 'GET / ATTACHMENT', 40],
    ['VG1500090065', 'ALTERNATOR DONGFENG DF375 28V 70A', 'PC', 5, 2, 3850000, 'ELECTRICAL', 5],
    ['WG9100440027', 'BRAKE PAD ASSY FRONT/REAR', 'SET', 12, 4, 1250000, 'BRAKE SYSTEM', 12],
    ['15607-2190', 'OIL FILTER HINO FM260TI', 'PC', 16, 5, 280000, 'FILTER', 16],
    ['14X-27-11110', 'TRACK SHOE BOLT & NUT D85ESS', 'SET', 120, 30, 85000, 'UNDERCARRIAGE', 120],
    ['SAE-15W40', 'OLI MESIN MEDITRAN SX SAE 15W-40', 'LTR', 800, 200, 55000, 'LUBRICANT', 800],
    ['ISO-VG68', 'OLI HIDROLIK TURALIK 68 ISO-VG68', 'LTR', 600, 200, 62000, 'LUBRICANT', 600],
    ['GREASE-EP2', 'CHASSIS GREASE LITHIUM EP-2', 'KG', 150, 40, 75000, 'GREASE', 150],
    ['714-16-00010', 'TRANSMISSION OVERHAUL SEAL KIT', 'SET', 3, 1, 45000000, 'TRANSMISSION & DRIVE', 3],
    ['20Y-27-11500', 'FINAL DRIVE BEARING & SEAL KIT', 'SET', 4, 1, 14500000, 'UNDERCARRIAGE', 4],
    ['6742-01-4120', 'FUEL INJECTION PUMP REBUILD KIT', 'SET', 3, 1, 12000000, 'ENGINE', 3]
  ];
  ensureSheet('MasterParts', partsHeaders, partsRows);
  ensureSheet('Stock', partsHeaders, partsRows);

  // 7. MASTER COMPONENT (MAJOR & MINOR)
  const compHeaders = ['Major_Component', 'Minor_Component'];
  const compRows = [
    ['ENGINE', 'CYLINDER HEAD'],
    ['ENGINE', 'CYLINDER BLOCK'],
    ['ENGINE', 'TURBOCHARGER'],
    ['ENGINE', 'FUEL INJECTION PUMP'],
    ['ENGINE', 'RADIATOR & COOLING SYSTEM'],
    ['ENGINE', 'STARTING MOTOR'],
    ['HYDRAULIC', 'MAIN PUMP'],
    ['HYDRAULIC', 'CONTROL VALVE'],
    ['HYDRAULIC', 'BOOM CYLINDER'],
    ['HYDRAULIC', 'ARM CYLINDER'],
    ['HYDRAULIC', 'HYDRAULIC HOSE'],
    ['HYDRAULIC', 'OIL COOLER'],
    ['ELECTRICAL', 'ALTERNATOR'],
    ['ELECTRICAL', 'BATTERY & WIRING'],
    ['ELECTRICAL', 'STARTING SWITCH'],
    ['ELECTRICAL', 'WORK LAMP & CABIN LIGHT'],
    ['ELECTRICAL', 'CONTROLLER / ECM'],
    ['TRANSMISSION & DRIVE', 'TORQUE CONVERTER'],
    ['TRANSMISSION & DRIVE', 'TRANSMISSION ASSY'],
    ['TRANSMISSION & DRIVE', 'DIFFERENTIAL'],
    ['TRANSMISSION & DRIVE', 'PROPELLER SHAFT'],
    ['TRANSMISSION & DRIVE', 'FINAL DRIVE'],
    ['UNDERCARRIAGE', 'TRACK LINK & SHOE'],
    ['UNDERCARRIAGE', 'TRACK ROLLER'],
    ['UNDERCARRIAGE', 'IDLER'],
    ['UNDERCARRIAGE', 'SPROCKET'],
    ['UNDERCARRIAGE', 'TRACK ADJUSTER'],
    ['BRAKE SYSTEM', 'BRAKE SHOE & PAD'],
    ['BRAKE SYSTEM', 'BRAKE VALVE'],
    ['BRAKE SYSTEM', 'AIR COMPRESSOR'],
    ['ATTACHMENT & BUCKET', 'BUCKET TOOTH'],
    ['ATTACHMENT & BUCKET', 'BLADE ASSY']
  ];
  ensureSheet('MasterComponent', compHeaders, compRows);

  // 8. PERSONEL RUJUKAN WORKBOOK PT. KUK
  ensureSheet('MasterMekanik', ['Nama_Mekanik'], [
    ['Tim Mekanik KBCT'],
    ['Tim Mekanik LMP'],
    ['Andi Herwan (PMC)'],
    ['Hariadi (GM & Mgr. Maintenance)']
  ]);
  // 9. MASTER PELAPOR
  ensureSheet('MasterPelapor', ['Nama_Pelapor'], [['Brayen (Logistic)'], ['Andi Herwan (PMC)']]);

  // 9. WORK ORDERS (SEP 1-7 DENGAN HARGA PARTS & SIKLUS BREAKDOWN BERULANG)
  const woHeaders = [
    'No_WO', 'Equip_No', 'Brand', 'Unit_Type', 'HM_KM',
    'Tgl_Input', 'Tgl_Rusak', 'Jam_Rusak', 'Tgl_Selesai', 'Jam_Selesai',
    'Pelanggan', 'PM_Service', 'Major_Comp', 'Minor_Comp', 'SCH_UNSCH',
    'Reported_By', 'Kendala', 'Failure_Reason', 'Status', 'Parts_JSON',
    'Tech', 'Action_Log'
  ];
  const woRows = [
    // Sep 1: DZ-007 Breakdown pertama (Transmission) -> Selesai Sep 4 jam 14:30
    [
      'WO2609-0001', 'DZ-007', 'CAT', 'BULLDOZER', '11842.2',
      '2026-09-01', '2026-09-01', '07:30', '2026-09-04', '14:30',
      'KUK-KBCT', '-', 'TRANSMISSION & DRIVE', 'TORQUE CONVERTER', 'UNSCH',
      'Hariadi (GM & Mgr. Maintenance)', 'Torqflow transmission slip & over-temperature saat ripping',
      'Disc clutch wear & valve body pressure drop', 'CLOSED',
      JSON.stringify([
        { no: '714-16-00010', desc: 'TRANSMISSION OVERHAUL SEAL KIT', qty: 1, uom: 'SET', price: 45000000 },
        { no: 'ISO-VG68', desc: 'OLI HIDROLIK TURALIK 68 ISO-VG68', qty: 80, uom: 'LTR', price: 62000 }
      ]),
      'Tim Mekanik KBCT', 'Overhaul transmission & replace torque converter discs. Dyno test OK. Unit READY tgl 4 jam 14:30.'
    ],
    // Sep 1: EX-205 Servis Rutin PM 250H (SCH) -> Selesai Sep 1 jam 14:00
    [
      'WO2609-0002', 'EX-205', 'CATERPILLAR', 'EXCAVATOR', '4330.0',
      '2026-09-01', '2026-09-01', '08:00', '2026-09-01', '14:00',
      'KUK-KBCT', 'PM 250H', 'ENGINE', 'CYLINDER HEAD', 'SCH',
      'Andi Herwan (PMC)', 'Servis Berkala PM 250H', 'Jadwal rutin berkala 250 jam', 'CLOSED',
      JSON.stringify([
        { no: '6732-71-6120', desc: 'FILTER OLI MESIN PC200-8', qty: 1, uom: 'PC', price: 350000 },
        { no: '600-319-3550', desc: 'FILTER SOLAR FUEL WATER SEPARATOR', qty: 1, uom: 'PC', price: 520000 },
        { no: 'SAE-15W40', desc: 'OLI MESIN MEDITRAN SX SAE 15W-40', qty: 35, uom: 'LTR', price: 55000 }
      ]),
      'Tim Mekanik KBCT', 'Ganti filter oli, filter solar, oli mesin. Cek kelistrikan & greasing.'
    ],
    // Sep 1: WL-016 Breakdown pertama (Main Pump) -> Selesai Sep 3 jam 15:00
    [
      'WO2609-0003', 'WL-016', 'LIUGONG', 'WHEEL LOADER', '2121.5',
      '2026-09-01', '2026-09-01', '09:00', '2026-09-03', '15:00',
      'KUK-KBCT', '-', 'HYDRAULIC', 'MAIN PUMP', 'UNSCH',
      'Andi Herwan (PMC)', 'Main hydraulic pump abnormal sound & pressure drop drastis',
      'Cavitation & internal piston pump wear', 'CLOSED',
      JSON.stringify([
        { no: '708-2L-00300', desc: 'MAIN HYDRAULIC PUMP ASSY', qty: 1, uom: 'SET', price: 28500000 },
        { no: '07000-12065', desc: 'O-RING SEAL HYDRAULIC ARM CYLINDER', qty: 4, uom: 'PC', price: 175000 },
        { no: 'ISO-VG68', desc: 'OLI HIDROLIK TURALIK 68 ISO-VG68', qty: 50, uom: 'LTR', price: 62000 }
      ]),
      'Tim Mekanik KBCT', 'Ganti pump assembly baru, flushing tangki hidrolik, setting relief valve 210 bar. Ready tgl 3.'
    ],
    // Sep 1: DT-3011 Rem blong / kebocoran brake valve -> Selesai Sep 1 jam 18:00
    [
      'WO2609-0004', 'DT-3011', 'SHACMAN', 'DUMP TRUCK', '6133.5',
      '2026-09-01', '2026-09-01', '10:00', '2026-09-01', '18:00',
      'KUK-KBCT', '-', 'BRAKE SYSTEM', 'BRAKE VALVE', 'UNSCH',
      'Brayen (Logistic)', 'Rem belakang kurang pakem, angin bocor di pedal valve',
      'Pneumatic seal internal valve aus', 'CLOSED',
      JSON.stringify([
        { no: 'WG9100440027', desc: 'BRAKE PAD ASSY FRONT/REAR', qty: 2, uom: 'SET', price: 1250000 }
      ]),
      'Tim Mekanik KBCT', 'Ganti brake valve assembly & brake pads. Test pengereman OK.'
    ],
    // Sep 2: WL-019 Breakdown pertama (Control Valve) -> Selesai Sep 4 jam 16:00
    [
      'WO2609-0005', 'WL-019', 'LIUGONG', 'WHEEL LOADER', '3952.0',
      '2026-09-02', '2026-09-02', '08:00', '2026-09-04', '16:00',
      'KUK-KBCT', '-', 'HYDRAULIC', 'CONTROL VALVE', 'UNSCH',
      'Hariadi (GM & Mgr. Maintenance)', 'Bucket tidak bisa dump, relief valve control valve macet',
      'Spool valve macet karena kontaminasi gram partikel', 'CLOSED',
      JSON.stringify([
        { no: '07000-12065', desc: 'O-RING SEAL HYDRAULIC ARM CYLINDER', qty: 6, uom: 'PC', price: 175000 },
        { no: 'ISO-VG68', desc: 'OLI HIDROLIK TURALIK 68 ISO-VG68', qty: 30, uom: 'LTR', price: 62000 }
      ]),
      'Tim Mekanik KBCT', 'Menggunakan relief valve pinjam (Swab dari WL-016), flushing sirkuit, testing operasional normal.'
    ],
    // Sep 2: DZ-002 Servis Rutin PM 250H (SCH) -> Selesai Sep 2 jam 16:00
    [
      'WO2609-0006', 'DZ-002', 'ZOOMLION', 'BULLDOZER', '8398.0',
      '2026-09-02', '2026-09-02', '10:00', '2026-09-02', '16:00',
      'KUK-KBCT', 'PM 250H', 'ENGINE', 'RADIATOR & COOLING SYSTEM', 'SCH',
      'Andi Herwan (PMC)', 'Servis PM 250H berkala', 'Rutin service schedule', 'CLOSED',
      JSON.stringify([
        { no: '6732-71-6120', desc: 'FILTER OLI MESIN PC200-8', qty: 1, uom: 'PC', price: 350000 },
        { no: 'SAE-15W40', desc: 'OLI MESIN MEDITRAN SX SAE 15W-40', qty: 40, uom: 'LTR', price: 55000 }
      ]),
      'Tim Mekanik KBCT', 'Ganti filter oli, oli mesin 40L, cek track tension.'
    ],
    // Sep 3: EX-302 Selang Hidrolik Arm Pecah -> Selesai Sep 3 jam 16:00 (Fast Repair MTTR 8h)
    [
      'WO2609-0007', 'EX-302', 'SANY', 'EXCAVATOR', '3906.0',
      '2026-09-03', '2026-09-03', '08:00', '2026-09-03', '16:00',
      'KUK-KBCT', '-', 'HYDRAULIC', 'HYDRAULIC HOSE', 'UNSCH',
      'Andi Herwan (PMC)', 'Selang hidrolik arm cylinder pecah saat menggali batu keras',
      'Fatigue & pressure spike pada selang flexible', 'CLOSED',
      JSON.stringify([
        { no: '07108-20512', desc: 'HYDRAULIC HOSE HIGH PRESSURE 3/4 INCH', qty: 6, uom: 'MTR', price: 480000 },
        { no: 'ISO-VG68', desc: 'OLI HIDROLIK TURALIK 68 ISO-VG68', qty: 25, uom: 'LTR', price: 62000 },
        { no: '07000-12065', desc: 'O-RING SEAL HYDRAULIC ARM CYLINDER', qty: 2, uom: 'PC', price: 175000 }
      ]),
      'Tim Mekanik KBCT', 'Crimping selang baru 6 meter, pasang fitting, top-up oli hidrolik 25L. Normal.'
    ],
    // Sep 3: SL-100 Bucket Tooth & Adapter Loose -> Selesai Sep 3 jam 17:00 (MTTR 4h)
    [
      'WO2609-0008', 'SL-100', 'BOBCAT', 'SKID STEER LOADER', '1910.5',
      '2026-09-03', '2026-09-03', '13:00', '2026-09-03', '17:00',
      'KUK-KBCT', '-', 'ATTACHMENT & BUCKET', 'BUCKET TOOTH', 'UNSCH',
      'Brayen (Logistic)', 'Baut pin quick coupler bucket longgar dan tooth aus',
      'Vibrasi kerja stockpile', 'CLOSED',
      JSON.stringify([
        { no: '205-70-19570', desc: 'BUCKET TOOTH POINT PC200', qty: 4, uom: 'PC', price: 275000 }
      ]),
      'Tim Mekanik KBCT', 'Ganti 4 tooth point, kencangkan pin adapter dengan torque wrench.'
    ],
    // Sep 4: SL-300 Servis PM 250H (SCH) -> Selesai Sep 5 jam 09:00
    [
      'WO2609-0009', 'SL-300', 'CAT', 'SKID STEER LOADER', '2022.5',
      '2026-09-04', '2026-09-04', '13:00', '2026-09-05', '09:00',
      'KUK-KBCT', 'PM 250H', 'HYDRAULIC', 'CONTROL VALVE', 'SCH',
      'Andi Herwan (PMC)', 'Servis PM 250H + check spool valve', 'Jadwal servis berkala rutin', 'CLOSED',
      JSON.stringify([
        { no: '6732-71-6120', desc: 'FILTER OLI MESIN PC200-8', qty: 1, uom: 'PC', price: 350000 },
        { no: 'SAE-15W40', desc: 'OLI MESIN MEDITRAN SX SAE 15W-40', qty: 15, uom: 'LTR', price: 55000 }
      ]),
      'Tim Mekanik KBCT', 'Ganti filter oli mesin, ganti oli mesin 15L, cleaning control valve block.'
    ],
    // Sep 5: DT-3011 Kompresor Angin Rem Tersumbat -> Selesai Sep 5 jam 17:00 (MTTR 8h)
    [
      'WO2609-0010', 'DT-3011', 'SHACMAN', 'DUMP TRUCK', '6171.0',
      '2026-09-05', '2026-09-05', '09:00', '2026-09-05', '17:00',
      'KUK-KBCT', '-', 'BRAKE SYSTEM', 'AIR COMPRESSOR', 'UNSCH',
      'Brayen (Logistic)', 'Pengisian angin rem lambat (pressure gauge drop)',
      'Unloader valve compressor kotor & tersumbat kerak oli', 'CLOSED',
      JSON.stringify([
        { no: 'WG9100440027', desc: 'BRAKE PAD ASSY FRONT/REAR', qty: 1, uom: 'SET', price: 1250000 }
      ]),
      'Tim Mekanik KBCT', 'Overhaul unloader valve, pembersihan carbon deposit, drain tangki angin.'
    ],
    // Sep 5: EX-305 Baut Track Shoe Lepas -> Selesai Sep 5 jam 15:00 (MTTR 8h)
    [
      'WO2609-0011', 'EX-305', 'SANY', 'EXCAVATOR', '2940.5',
      '2026-09-05', '2026-09-05', '07:00', '2026-09-05', '15:00',
      'KUK-KBCT', '-', 'UNDERCARRIAGE', 'TRACK LINK & SHOE', 'UNSCH',
      'Andi Herwan (PMC)', 'Baut track shoe sebelah kanan lepas 8 pcs, link aus',
      'Beban impact batuan tajam', 'CLOSED',
      JSON.stringify([
        { no: '14X-27-11110', desc: 'TRACK SHOE BOLT & NUT D85ESS', qty: 16, uom: 'SET', price: 85000 }
      ]),
      'Tim Mekanik KBCT', 'Penggantian 16 set bolt & nut track shoe, tightening torque 850 Nm.'
    ],
    // Sep 6: DZ-007 BREAKDOWN LAGI TGL 6 (Track Adjuster Leak) -> Selesai Sep 6 jam 16:30 (MTTR 8.5h)
    [
      'WO2609-0012', 'DZ-007', 'CAT', 'BULLDOZER', '11858.7',
      '2026-09-06', '2026-09-06', '08:00', '2026-09-06', '16:30',
      'KUK-KBCT', '-', 'UNDERCARRIAGE', 'TRACK ADJUSTER', 'UNSCH',
      'Hariadi (GM & Mgr. Maintenance)', 'DZ-007 breakdown lagi: Grease cylinder track adjuster bocor, rantai kendor',
      'Seal piston track adjuster rusak terkena debu batu', 'CLOSED',
      JSON.stringify([
        { no: '07000-12065', desc: 'O-RING SEAL HYDRAULIC ARM CYLINDER', qty: 2, uom: 'PC', price: 175000 },
        { no: 'GREASE-EP2', desc: 'CHASSIS GREASE LITHIUM EP-2', qty: 15, uom: 'KG', price: 75000 }
      ]),
      'Tim Mekanik KBCT', 'Ganti seal kit track adjuster, pompa grease EP-2 hingga tension standar. Unit ready jam 16:30.'
    ],
    // Sep 6: WL-016 BREAKDOWN LAGI TGL 6 (Brake Caliper) -> Selesai Sep 7 jam 11:00
    [
      'WO2609-0013', 'WL-016', 'LIUGONG', 'WHEEL LOADER', '2137.5',
      '2026-09-06', '2026-09-06', '10:00', '2026-09-07', '11:00',
      'KUK-KBCT', '-', 'BRAKE SYSTEM', 'BRAKE SHOE & PAD', 'UNSCH',
      'Andi Herwan (PMC)', 'WL-016 breakdown lagi: Piston caliper rem roda depan macet dan minyak rem bocor',
      'Seal caliper aus & korosi piston rem', 'CLOSED',
      JSON.stringify([
        { no: 'WG9100440027', desc: 'BRAKE PAD ASSY FRONT/REAR', qty: 2, uom: 'SET', price: 1250000 }
      ]),
      'Tim Mekanik KBCT', 'Rebuild caliper rem depan, ganti seal kit & bleeding minyak rem. Unit test operasional ready tgl 7 jam 11:00.'
    ],
    // Sep 6: EX-302 Breakdown lagi Tgl 6 (Alternator 24V) -> Selesai Sep 6 jam 13:30 (MTTR 6h)
    [
      'WO2609-0014', 'EX-302', 'SANY', 'EXCAVATOR', '3945.5',
      '2026-09-06', '2026-09-06', '07:30', '2026-09-06', '13:30',
      'KUK-KBCT', '-', 'ELECTRICAL', 'ALTERNATOR', 'UNSCH',
      'Andi Herwan (PMC)', 'Lampu indikator aki menyala, charging alternator drop ke 22V',
      'Diode bridge alternator putus', 'CLOSED',
      JSON.stringify([
        { no: '600-821-6120', desc: 'ALTERNATOR 24V 60A KOMATSU', qty: 1, uom: 'PC', price: 4200000 }
      ]),
      'Tim Mekanik KBCT', 'Ganti alternator assy 24V baru, cek belt tension. Pengisian kembali normal 27.8V.'
    ],
    // Sep 6: EX-311 ECM Error Code 14 -> Selesai Sep 7 jam 14:00
    [
      'WO2609-0015', 'EX-311', 'CATERPILLAR', 'EXCAVATOR', '1651.0',
      '2026-09-06', '2026-09-06', '07:00', '2026-09-07', '14:00',
      'KUK-KBCT', '-', 'ELECTRICAL', 'CONTROLLER / ECM', 'UNSCH',
      'Hariadi (GM & Mgr. Maintenance)', 'ECM error code 14 pada EX-311, power engine drop mode limp',
      'Sensor pressure common rail loss signal', 'CLOSED',
      JSON.stringify([
        { no: '07000-12065', desc: 'O-RING SEAL HYDRAULIC ARM CYLINDER', qty: 1, uom: 'PC', price: 175000 }
      ]),
      'Tim Mekanik KBCT', 'Scanning CAT ET, perbaikan wiring harness socket sensor common rail, clear error code. Unit RFU.'
    ],
    // Sep 6: ST-002 Lube Truck Pompa Bocor -> Selesai Sep 7 jam 10:00
    [
      'WO2609-0016', 'ST-002', 'FAW', 'LUBE TRUCK', '969.5',
      '2026-09-06', '2026-09-06', '08:00', '2026-09-07', '10:00',
      'KUK-KBCT', '-', 'HYDRAULIC', 'HYDRAULIC HOSE', 'UNSCH',
      'Brayen (Logistic)', 'Pompa hidrolik dispensing oil lube truck rembes oli deras',
      'Shaft seal pompa aus', 'CLOSED',
      JSON.stringify([
        { no: '07108-20512', desc: 'HYDRAULIC HOSE HIGH PRESSURE 3/4 INCH', qty: 2, uom: 'MTR', price: 480000 }
      ]),
      'Tim Mekanik KBCT', 'Ganti hose dan seal kit pompa lube. Tekanan pompa kembali normal.'
    ],
    // Sep 6: DZ-010 Final Drive Noise (ACTIVE BREAKDOWN STATUS: IN PROGRESS)
    [
      'WO2609-0017', 'DZ-010', 'CAT', 'BULLDOZER', '9320.0',
      '2026-09-06', '2026-09-06', '09:00', '', '',
      'KUK-LMP', '-', 'TRANSMISSION & DRIVE', 'FINAL DRIVE', 'UNSCH',
      'Andi Herwan (PMC)', 'Final drive kiri DZ-010 noise keras & getaran saat belok',
      'Bearing roller final drive rontok', 'IN PROGRESS',
      JSON.stringify([]),
      'Tim Mekanik LMP', 'Bongkar cover final drive, inspeksi gear planet & bearing spalling. Menunggu part bearing dari Surabaya.'
    ],
    // Sep 6: WT-009 Fuel Injection Pump (ACTIVE BREAKDOWN STATUS: WAITING PART)
    [
      'WO2609-0018', 'WT-009', 'UD TRUCKS', 'WATER TRUCK 20.000 KL', '3486.0',
      '2026-09-06', '2026-09-06', '06:00', '', '',
      'KUK-KBCT', '-', 'ENGINE', 'FUEL INJECTION PUMP', 'UNSCH',
      'Andi Herwan (PMC)', 'Mesin water truck susah start pagi hari, tenaga ngempos',
      'Supply pump fuel injection aus & filter buntu', 'WAITING PART',
      JSON.stringify([
        { no: '600-319-3550', desc: 'FILTER SOLAR FUEL WATER SEPARATOR', qty: 1, uom: 'PC', price: 520000 }
      ]),
      'Tim Mekanik KBCT', 'Ganti filter solar, supply pump fuel dikirim ke bengkel kalibrasi.'
    ],
    // Sep 7: WL-019 BREAKDOWN LAGI TGL 7 (Oil Cooler Overheat) -> (ACTIVE BREAKDOWN STATUS: OPEN)
    [
      'WO2609-0019', 'WL-019', 'LIUGONG', 'WHEEL LOADER', '3986.0',
      '2026-09-07', '2026-09-07', '07:30', '', '',
      'KUK-KBCT', '-', 'TRANSMISSION & DRIVE', 'TORQUE CONVERTER', 'UNSCH',
      'Hariadi (GM & Mgr. Maintenance)', 'WL-019 breakdown lagi: Temperature transmisi panas berlebih (overheat >110C)',
      'Oil cooler transmission tersumbat lumpur padat', 'OPEN',
      JSON.stringify([]),
      'Tim Mekanik KBCT', 'Investigasi sirkulasi oil cooler, siapkan flushing radiator & oil cooler.'
    ],
    // Sep 7: DT-3019 Vessel Retak Hinge Pin -> Selesai Sep 7 jam 15:00 (MTTR 7h)
    [
      'WO2609-0020', 'DT-3019', 'SHACMAN', 'DUMP TRUCK', '6571.5',
      '2026-09-07', '2026-09-07', '08:00', '2026-09-07', '15:00',
      'KUK-KBCT', '-', 'ATTACHMENT & BUCKET', 'BLADE ASSY', 'UNSCH',
      'Brayen (Logistic)', 'Vessel dump truck retak pada pengait hinge pin belakang',
      'Fatigue beban hauling batubara', 'CLOSED',
      JSON.stringify([
        { no: '14X-27-11110', desc: 'TRACK SHOE BOLT & NUT D85ESS', qty: 4, uom: 'SET', price: 85000 }
      ]),
      'Tim Mekanik KBCT', 'Gouging retakan, re-welding dengan kawat las LB-52, pasang stiffener plate. Selesai jam 15:00.'
    ]
  ];
  ensureSheet('WorkOrders', woHeaders, woRows);

  // 10. BACKLOG MANAGEMENT (SEP 1-7 - SMRP STANDARD WITH MAN-HOURS)
  const blHeaders = ['ID', 'Tanggal', 'Equip_No', 'Deskripsi_Backlog', 'Status', 'Rencana_Eksekusi', 'Est_Hours'];
  const blRows = [
    ['BL-001', '2026-09-01', 'EX-205', 'Ganti tooth bucket yang aus', 'CLOSED', 'Diselesaikan bersamaan servis PM 250H', 4],
    ['BL-002', '2026-09-01', 'DZ-007', 'Overhaul transmission dan evaluasi torqflow', 'CLOSED', 'Overhaul tuntas tgl 4 Sep 2026', 16],
    ['BL-003', '2026-09-02', 'WL-016', 'Ganti kampas rem dan periksa caliper rem', 'CLOSED', 'Rebuild caliper selesai tgl 7 Sep', 6],
    ['BL-004', '2026-09-02', 'WL-019', 'Periksa main hydraulic pump & relief valve', 'CLOSED', 'Relief valve tuntas diswab tgl 4 Sep', 8],
    ['BL-005', '2026-09-02', 'GST-003', 'Evaluasi alternator V-GEN VG40-I setelah ganti baru', 'CLOSED', 'Monitoring performa 48 jam stabil', 2],
    ['BL-006', '2026-09-03', 'DT-3017', 'Investigasi getaran propeller shaft', 'CLOSED', 'Balancing propeller shaft tuntas tgl 5 Sep', 6],
    ['BL-007', '2026-09-03', 'SL-100', 'Penggantian selang hidrolik bocor', 'CLOSED', 'Seal kit & hose baru terpasang', 4],
    ['BL-008', '2026-09-04', 'ST-002', 'Service pompa hidrolik lube truck', 'CLOSED', 'Ganti shaft seal pompa tuntas tgl 7 Sep', 6],
    ['BL-009', '2026-09-04', 'WT-009', 'Diagnosa susah start mesin GH8E280', 'WAITING PART', 'Supply pump fuel injection dikalibrasi di vendor', 8],
    ['BL-010', '2026-09-05', 'EX-305', 'Penggantian track link dan shoe assembly', 'CLOSED', '16 set bolt & nut track shoe terpasang', 8],
    ['BL-011', '2026-09-05', 'DT-3019', 'Welding hinge pin vessel yang retak', 'CLOSED', 'Re-welding stiffener plate selesai tgl 7 Sep', 7],
    ['BL-012', '2026-09-06', 'EX-311', 'ECM error code 14 common rail pressure sensor', 'CLOSED', 'Wiring harness diperbaiki & error clear tgl 7 Sep', 4],
    ['BL-013', '2026-09-06', 'DZ-010', 'Diagnosa final drive noise kiri & bearing rontok', 'IN PROGRESS', 'Measurement clearance & order bearing Trakindo', 12],
    ['BL-014', '2026-09-07', 'WL-019', 'Transmission temperature overheat >110C', 'OPEN', 'Flushing radiator & oil cooler transmission', 6]
  ];
  ensureSheet('Backlog', blHeaders, blRows);
  // 11. DAILY HOUR METER (POPULASI LENGKAP 34 UNIT EXCEL KUK-LMP KBCT 2026: SEP 1-7)
  const hmHeaders = ['ID', 'Tanggal', 'Equip_No', 'HM_Awal', 'HM_Akhir', 'Total_HM', 'Timestamp'];
  const hmRows = [];
  // DAILY HOUR METER POPULATION - SEMUA 36 UNIT EXCEL KUK-LMP KBCT 2026
  // Bulldozer 12-16 H/harinya, Excavator 10-15, Wheel Loader 10-14,
  // Skid Steer 8-12, Dump Truck 10-16, Water Truck 8-12, Lube Truck 6-10, Genset bervariasi
  const populationHM = [
    // BULLDOZER (7 unit) - HM start 5000-12000, rate 12-16 H/day
    { no: 'DZ-002', hm_start: 8370.0, rate_d1: 14.0, rate_d2: 14.0 },
    { no: 'DZ-005', hm_start: 7240.0, rate_d1: 14.5, rate_d2: 15.0 },
    { no: 'DZ-069', hm_start: 6890.0, rate_d1: 13.5, rate_d2: 13.0 },
    { no: 'DZ-007', hm_start: 11840.2, rate_d1: 1.0, rate_d2: 0.0 }, // BREAKDOWN
    { no: 'DZ-008', hm_start: 11650.0, rate_d1: 14.0, rate_d2: 15.5 },
    { no: 'DZ-010', hm_start: 9230.0, rate_d1: 15.0, rate_d2: 15.0 },
    { no: 'DZ-012', hm_start: 7146.0, rate_d1: 10.5, rate_d2: 14.0 },
    // EXCAVATOR / LONG ARM (9 unit) - HM start 2000-5000, rate 10-15 H/day
    { no: 'EX-201', hm_start: 4520.0, rate_d1: 12.0, rate_d2: 12.5 },
    { no: 'EX-205', hm_start: 4316.0, rate_d1: 14.0, rate_d2: 14.5 },
    { no: 'EX-302', hm_start: 3880.0, rate_d1: 13.0, rate_d2: 13.5 },
    { no: 'EX-304', hm_start: 3250.0, rate_d1: 14.0, rate_d2: 14.0 },
    { no: 'EX-305', hm_start: 2890.0, rate_d1: 12.5, rate_d2: 13.0 },
    { no: 'EX-306', hm_start: 5395.0, rate_d1: 14.0, rate_d2: 14.0 },
    { no: 'EX-309', hm_start: 480.0, rate_d1: 15.0, rate_d2: 15.5 },
    { no: 'EX-310', hm_start: 1620.0, rate_d1: 14.5, rate_d2: 14.0 },
    { no: 'EX-311', hm_start: 1580.0, rate_d1: 14.0, rate_d2: 14.5 },
    // WHEEL LOADER (4 unit) - HM start 2000-5000, rate 10-14 H/day
    { no: 'WL-010', hm_start: 5104.0, rate_d1: 13.5, rate_d2: 13.0 },
    { no: 'WL-016', hm_start: 2120.0, rate_d1: 1.5, rate_d2: 0.0 }, // BREAKDOWN
    { no: 'WL-017', hm_start: 6920.0, rate_d1: 12.0, rate_d2: 12.5 },
    { no: 'WL-019', hm_start: 3950.0, rate_d1: 2.0, rate_d2: 0.0 }, // BREAKDOWN
    // SKID STEER LOADER (4 unit) - HM start 1500-2000, rate 8-12 H/day
    { no: 'SL-100', hm_start: 1890.0, rate_d1: 10.0, rate_d2: 10.5 },
    { no: 'SL-200', hm_start: 2340.0, rate_d1: 11.0, rate_d2: 11.0 },
    { no: 'SL-300', hm_start: 1988.0, rate_d1: 11.0, rate_d2: 11.5 },
    { no: 'SL-400', hm_start: 1650.0, rate_d1: 9.5, rate_d2: 10.0 },
    // DUMP TRUCK (5 unit) - HM start 4000-6500, rate 10-16 H/day
    { no: 'DT-3011', hm_start: 6122.0, rate_d1: 11.5, rate_d2: 15.0 },
    { no: 'DT-3012', hm_start: 5395.0, rate_d1: 14.0, rate_d2: 14.5 },
    { no: 'DT-3017', hm_start: 5820.0, rate_d1: 13.5, rate_d2: 14.0 },
    { no: 'DT-3018', hm_start: 4920.0, rate_d1: 12.0, rate_d2: 13.5 },
    { no: 'DT-3019', hm_start: 6480.0, rate_d1: 15.0, rate_d2: 15.5 },
    // WATER TRUCK (2 unit) - HM start 3000-3500, rate 8-12 H/day
    { no: 'WT-009', hm_start: 3416.0, rate_d1: 12.0, rate_d2: 12.0 },
    { no: 'WT-011', hm_start: 3080.0, rate_d1: 10.0, rate_d2: 10.5 },
    // LUBE TRUCK (1 unit) - HM start 800-900, rate 6-10 H/day
    { no: 'ST-002', hm_start: 920.0, rate_d1: 8.0, rate_d2: 8.5 },
    // GENSET 40 KVA (2 unit) - HM start bervariasi, rate usage-dependent
    { no: 'GST-003', hm_start: 4920.0, rate_d1: 16.0, rate_d2: 16.0 },
    { no: 'GST-004', hm_start: 4680.0, rate_d1: 16.0, rate_d2: 16.0 }
  ];

  // DAILY HM POPULATION - SEP 1 TO SEP 7 (7 HARI OPERASI LENGKAP)
  const dailyRates = [
    // Sep 1: DZ-007 BD (1.0h), WL-016 BD (1.5h), DT-3011 BD rem (4.5h)
    { 'DZ-002': 14.0, 'DZ-005': 14.5, 'DZ-069': 13.5, 'DZ-007': 1.0, 'DZ-008': 14.0, 'DZ-010': 15.0, 'DZ-012': 10.5,
      'EX-201': 12.0, 'EX-205': 14.0, 'EX-302': 13.0, 'EX-304': 14.0, 'EX-305': 12.5, 'EX-306': 14.0,
      'EX-309': 15.0, 'EX-310': 14.5, 'EX-311': 14.0,
      'WL-010': 13.5, 'WL-016': 1.5, 'WL-017': 12.0, 'WL-019': 12.5,
      'SL-100': 10.0, 'SL-200': 11.0, 'SL-300': 11.0, 'SL-400': 9.5,
      'DT-3011': 4.5, 'DT-3012': 14.0, 'DT-3017': 13.5, 'DT-3018': 12.0, 'DT-3019': 15.0,
      'WT-009': 12.0, 'WT-011': 10.0, 'ST-002': 8.0, 'GST-003': 16.0, 'GST-004': 16.0 },
    // Sep 2: DZ-007 BD (0h), WL-016 BD (0h), WL-019 BD (1.0h)
    { 'DZ-002': 14.0, 'DZ-005': 15.0, 'DZ-069': 13.0, 'DZ-007': 0.0, 'DZ-008': 15.5, 'DZ-010': 15.0, 'DZ-012': 14.0,
      'EX-201': 12.5, 'EX-205': 14.5, 'EX-302': 13.5, 'EX-304': 14.0, 'EX-305': 13.0, 'EX-306': 14.0,
      'EX-309': 15.5, 'EX-310': 14.0, 'EX-311': 14.5,
      'WL-010': 13.0, 'WL-016': 0.0, 'WL-017': 12.5, 'WL-019': 1.0,
      'SL-100': 10.5, 'SL-200': 11.0, 'SL-300': 11.5, 'SL-400': 10.0,
      'DT-3011': 15.0, 'DT-3012': 14.5, 'DT-3017': 14.0, 'DT-3018': 13.5, 'DT-3019': 15.5,
      'WT-009': 12.0, 'WT-011': 10.5, 'ST-002': 8.5, 'GST-003': 16.0, 'GST-004': 16.0 },
    // Sep 3: DZ-007 BD (0h), WL-016 Ready sore (4.0h), WL-019 BD (0h), EX-302 selang pecah (6.0h), SL-100 tooth loose (6.0h)
    { 'DZ-002': 14.5, 'DZ-005': 14.0, 'DZ-069': 13.0, 'DZ-007': 0.0, 'DZ-008': 14.0, 'DZ-010': 15.5, 'DZ-012': 14.5,
      'EX-201': 12.0, 'EX-205': 14.0, 'EX-302': 6.0, 'EX-304': 14.5, 'EX-305': 12.0, 'EX-306': 14.5,
      'EX-309': 15.0, 'EX-310': 14.0, 'EX-311': 14.0,
      'WL-010': 13.0, 'WL-016': 4.0, 'WL-017': 12.5, 'WL-019': 0.0,
      'SL-100': 6.0, 'SL-200': 11.5, 'SL-300': 11.0, 'SL-400': 10.0,
      'DT-3011': 12.0, 'DT-3012': 14.0, 'DT-3017': 14.0, 'DT-3018': 13.0, 'DT-3019': 15.0,
      'WT-009': 11.5, 'WT-011': 10.0, 'ST-002': 8.0, 'GST-003': 16.0, 'GST-004': 15.5 },
    // Sep 4: DZ-007 Ready sore tgl 4 (5.0h), WL-016 Running (10.0h), WL-019 Ready sore (4.0h), SL-300 PM (8.0h)
    { 'DZ-002': 15.0, 'DZ-005': 14.5, 'DZ-069': 14.0, 'DZ-007': 5.0, 'DZ-008': 14.5, 'DZ-010': 14.5, 'DZ-012': 14.0,
      'EX-201': 12.5, 'EX-205': 14.0, 'EX-302': 13.5, 'EX-304': 14.0, 'EX-305': 12.5, 'EX-306': 14.0,
      'EX-309': 15.5, 'EX-310': 14.5, 'EX-311': 14.0,
      'WL-010': 13.5, 'WL-016': 10.0, 'WL-017': 13.0, 'WL-019': 4.0,
      'SL-100': 10.5, 'SL-200': 11.0, 'SL-300': 8.0, 'SL-400': 10.5,
      'DT-3011': 11.5, 'DT-3012': 14.5, 'DT-3017': 13.5, 'DT-3018': 13.0, 'DT-3019': 15.0,
      'WT-009': 12.0, 'WT-011': 10.5, 'ST-002': 8.5, 'GST-003': 16.0, 'GST-004': 16.0 },
    // Sep 5: DZ-007 Running penuh (14.5h), WL-016 Running (11.0h), WL-019 Running (12.0h), EX-305 track bolt (6.5h), DT-3011 kompresor (6.0h)
    { 'DZ-002': 14.0, 'DZ-005': 15.0, 'DZ-069': 13.5, 'DZ-007': 14.5, 'DZ-008': 15.0, 'DZ-010': 15.0, 'DZ-012': 14.0,
      'EX-201': 12.0, 'EX-205': 14.5, 'EX-302': 13.0, 'EX-304': 14.5, 'EX-305': 6.5, 'EX-306': 14.0,
      'EX-309': 15.0, 'EX-310': 14.0, 'EX-311': 14.5,
      'WL-010': 13.0, 'WL-016': 11.0, 'WL-017': 12.0, 'WL-019': 12.0,
      'SL-100': 10.0, 'SL-200': 11.5, 'SL-300': 11.0, 'SL-400': 10.0,
      'DT-3011': 6.0, 'DT-3012': 14.0, 'DT-3017': 14.0, 'DT-3018': 13.5, 'DT-3019': 15.5,
      'WT-009': 11.5, 'WT-011': 10.0, 'ST-002': 8.0, 'GST-003': 16.0, 'GST-004': 16.0 },
    // Sep 6: DZ-007 BD LAGI TGL 6 lalu Ready sore (4.5h), WL-016 BD LAGI TGL 6 (2.0h), EX-302 alternator (7.5h), DZ-010 final drive BD (2.0h), WT-009 BD (0h), EX-311 ECM (1.0h), ST-002 lube pump (1.5h)
    { 'DZ-002': 14.5, 'DZ-005': 14.0, 'DZ-069': 14.0, 'DZ-007': 4.5, 'DZ-008': 14.0, 'DZ-010': 2.0, 'DZ-012': 13.5,
      'EX-201': 12.5, 'EX-205': 14.0, 'EX-302': 7.5, 'EX-304': 14.0, 'EX-305': 12.5, 'EX-306': 14.5,
      'EX-309': 15.0, 'EX-310': 14.5, 'EX-311': 1.0,
      'WL-010': 13.5, 'WL-016': 2.0, 'WL-017': 12.5, 'WL-019': 12.5,
      'SL-100': 10.5, 'SL-200': 11.0, 'SL-300': 11.5, 'SL-400': 10.0,
      'DT-3011': 11.5, 'DT-3012': 14.5, 'DT-3017': 13.5, 'DT-3018': 13.0, 'DT-3019': 15.0,
      'WT-009': 0.0, 'WT-011': 10.5, 'ST-002': 1.5, 'GST-003': 16.0, 'GST-004': 16.0 },
    // Sep 7: DZ-007 Running normal (12.0h), WL-016 Ready jam 11 (6.0h), WL-019 BD LAGI overheat tgl 7 (0.5h OPEN), EX-311 Ready siang (4.0h), ST-002 Ready pagi (5.5h), DT-3019 vessel weld (7.0h), DZ-010 IN PROGRESS (0h), WT-009 WAITING PART (0h)
    { 'DZ-002': 14.0, 'DZ-005': 14.5, 'DZ-069': 13.0, 'DZ-007': 12.0, 'DZ-008': 14.0, 'DZ-010': 0.0, 'DZ-012': 14.0,
      'EX-201': 12.0, 'EX-205': 14.0, 'EX-302': 13.0, 'EX-304': 14.0, 'EX-305': 13.0, 'EX-306': 14.0,
      'EX-309': 15.0, 'EX-310': 14.0, 'EX-311': 4.0,
      'WL-010': 13.0, 'WL-016': 6.0, 'WL-017': 12.5, 'WL-019': 0.5,
      'SL-100': 11.0, 'SL-200': 11.0, 'SL-300': 11.5, 'SL-400': 10.0,
      'DT-3011': 14.0, 'DT-3012': 14.0, 'DT-3017': 14.0, 'DT-3018': 13.5, 'DT-3019': 7.0,
      'WT-009': 0.0, 'WT-011': 10.0, 'ST-002': 5.5, 'GST-003': 16.0, 'GST-004': 16.0 }
  ];
  
  let hmIdx = 1;
  const dates = ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-05', '2026-09-06', '2026-09-07'];
  const runningHM = {};
  populationHM.forEach(u => { runningHM[u.no] = u.hm_start; });
  
  // Generate all 7 days of HM data
  dates.forEach((date, dayIdx) => {
    const rates = dailyRates[dayIdx];
    populationHM.forEach(u => {
      const rate = rates[u.no] !== undefined ? rates[u.no] : 10.0;
      const startHM = runningHM[u.no];
      const endHM = startHM + rate;
      runningHM[u.no] = endHM;
      hmRows.push([
        'HM-' + String(hmIdx++).padStart(4, '0'),
        date,
        u.no,
        startHM.toFixed(1),
        endHM.toFixed(1),
        rate.toFixed(1),
        date + ' 18:00:00'
      ]);
    });
  });

  ensureSheet('DailyHM', hmHeaders, hmRows);

  // 12. MECHANIC ACTIVITY LOG (TERHUBUNG KE NO_WO, MEKANIK, DAN TOOL - SEP 1-7)
  const actHeaders = ['ID', 'Tanggal', 'No_WO', 'Mekanik', 'Aktifitas', 'Jam_Mulai', 'Jam_Selesai'];
  const actRows = [
    // Sep 1 activities
    ['ACT-001', '2026-09-01', 'WO2609-0001', 'Tim Mekanik KBCT', 'Diagnosis transmission dan torqflow Bulldozer DZ-007', '07:30', '16:00'],
    ['ACT-002', '2026-09-01', 'WO2609-0002', 'Tim Mekanik KBCT', 'Servis PM 250H Excavator EX-205 - ganti oli dan filter', '08:00', '14:00'],
    ['ACT-003', '2026-09-01', 'WO2609-0004', 'Tim Mekanik KBCT', 'Ganti brake valve dump truck DT-3011', '10:00', '18:00'],
    ['ACT-004', '2026-09-01', 'WO2609-0003', 'Tim Mekanik KBCT', 'Bongkar main hydraulic pump WL-016 untuk inspeksi internal', '09:00', '17:00'],
    ['ACT-005', '2026-09-01', '-', 'Tim Mekanik KBCT', 'Inspeksi umum armada area KBCT - checking unit standby', '06:00', '08:00'],
    // Sep 2 activities
    ['ACT-006', '2026-09-02', 'WO2609-0001', 'Tim Mekanik KBCT', 'Penurunan transmisi DZ-007 dan disassembly torque converter', '08:00', '17:00'],
    ['ACT-007', '2026-09-02', 'WO2609-0005', 'Tim Mekanik KBCT', 'Pressure test hydraulic Wheel Loader WL-019 & cek control valve', '08:00', '14:00'],
    ['ACT-008', '2026-09-02', 'WO2609-0006', 'Tim Mekanik KBCT', 'Servis PM 250H Bulldozer DZ-002', '10:00', '16:00'],
    ['ACT-009', '2026-09-02', 'WO2609-0003', 'Tim Mekanik KBCT', 'Honing barrel cylinder dan assembly pompa hidrolik baru WL-016', '08:30', '16:00'],
    ['ACT-010', '2026-09-02', '-', 'Tim Mekanik LMP', 'Inspeksi harian unit area LMP - monitoring Bulldozer DZ-010', '06:00', '08:00'],
    // Sep 3 activities
    ['ACT-011', '2026-09-03', 'WO2609-0007', 'Tim Mekanik KBCT', 'Crimping dan pasang selang hidrolik arm cylinder EX-302', '08:00', '16:00'],
    ['ACT-012', '2026-09-03', 'WO2609-0008', 'Tim Mekanik KBCT', 'Ganti tooth bucket Skid Steer SL-100 dan tightening pin', '13:00', '17:00'],
    ['ACT-013', '2026-09-03', 'WO2609-0003', 'Tim Mekanik KBCT', 'Testing operasional hidrolik WL-016 setelah pasang pump. Unit READY', '11:00', '15:00'],
    ['ACT-014', '2026-09-03', 'WO2609-0001', 'Tim Mekanik KBCT', 'Pemasangan disc clutch baru torqflow transmission DZ-007', '08:00', '17:00'],
    ['ACT-015', '2026-09-03', '-', 'Tim Mekanik KBCT', 'Greasing 30 unit - jadwal rutin mingguan', '06:00', '12:00'],
    // Sep 4 activities
    ['ACT-016', '2026-09-04', 'WO2609-0001', 'Tim Mekanik KBCT', 'Instalasi transmisi ke DZ-007, running test & setting pressure. READY tgl 4', '08:00', '14:30'],
    ['ACT-017', '2026-09-04', 'WO2609-0005', 'Tim Mekanik KBCT', 'Instalasi valve relief swab ke WL-019, flushing system. READY tgl 4', '09:00', '16:00'],
    ['ACT-018', '2026-09-04', 'WO2609-0009', 'Tim Mekanik KBCT', 'Servis PM 250H Skid Steer SL-300', '13:00', '17:00'],
    ['ACT-019', '2026-09-04', '-', 'Tim Mekanik KBCT', 'Kalibrasi torque wrench TOHNICHI untuk workshop', '06:00', '08:00'],
    // Sep 5 activities
    ['ACT-020', '2026-09-05', 'WO2609-0009', 'Tim Mekanik KBCT', 'Penyelesaian servis PM 250H SL-300 + check control valve. READY', '07:00', '09:00'],
    ['ACT-021', '2026-09-05', 'WO2609-0010', 'Tim Mekanik KBCT', 'Overhaul unloader valve air compressor DT-3011', '09:00', '17:00'],
    ['ACT-022', '2026-09-05', 'WO2609-0011', 'Tim Mekanik KBCT', 'Penggantian 16 set track shoe bolt & nut EX-305', '07:00', '15:00'],
    ['ACT-023', '2026-09-05', '-', 'Tim Mekanik LMP', 'Monitoring operasional unit LMP area', '06:00', '08:00'],
    // Sep 6 activities
    ['ACT-024', '2026-09-06', 'WO2609-0012', 'Tim Mekanik KBCT', 'DZ-007 BD LAGI: Ganti seal kit track adjuster & grease pumping. READY jam 16:30', '08:00', '16:30'],
    ['ACT-025', '2026-09-06', 'WO2609-0013', 'Tim Mekanik KBCT', 'WL-016 BD LAGI: Pembongkaran caliper rem depan & re-sealing', '10:00', '17:00'],
    ['ACT-026', '2026-09-06', 'WO2609-0014', 'Tim Mekanik KBCT', 'Penggantian alternator 24V 60A Excavator EX-302. READY jam 13:30', '07:30', '13:30'],
    ['ACT-027', '2026-09-06', 'WO2609-0015', 'Tim Mekanik KBCT', 'Diagnosa ECM error code 14 EX-311 dengan scanning CAT ET', '07:00', '16:00'],
    ['ACT-028', '2026-09-06', 'WO2609-0016', 'Tim Mekanik KBCT', 'Bongkar pompa dispensing lube truck ST-002 ganti shaft seal', '08:00', '15:00'],
    ['ACT-029', '2026-09-06', 'WO2609-0017', 'Tim Mekanik LMP', 'Diagnosa final drive noise DZ-010 di area LMP - cek clearance', '09:00', '17:00'],
    ['ACT-030', '2026-09-06', 'WO2609-0018', 'Tim Mekanik KBCT', 'Lepas supply pump fuel injection WT-009 kirim ke vendor kalibrasi', '06:00', '11:00'],
    // Sep 7 activities
    ['ACT-031', '2026-09-07', 'WO2609-0013', 'Tim Mekanik KBCT', 'Bleeding minyak rem WL-016 & brake performance test. READY jam 11:00', '08:00', '11:00'],
    ['ACT-032', '2026-09-07', 'WO2609-0015', 'Tim Mekanik KBCT', 'Perbaikan socket harness pressure sensor EX-311 & clearing code. READY jam 14:00', '08:00', '14:00'],
    ['ACT-033', '2026-09-07', 'WO2609-0016', 'Tim Mekanik KBCT', 'Finishing pasang pompa ST-002, test flow oli. READY jam 10:00', '07:30', '10:00'],
    ['ACT-034', '2026-09-07', 'WO2609-0019', 'Tim Mekanik KBCT', 'WL-019 BD LAGI: Investigasi overheat transmisi & sirkulasi oil cooler', '07:30', '14:00'],
    ['ACT-035', '2026-09-07', 'WO2609-0020', 'Tim Mekanik KBCT', 'Welding stiffener plate pengait vessel dump truck DT-3019. READY jam 15:00', '08:00', '15:00']
  ];
  ensureSheet('MechanicActivity', actHeaders, actRows);

  // 13. SERVICE HISTORY (RIWAYAT PM TERINTEGRASI INTERVAL 250H - SEP 1-7)
  const shHeaders = ['ID', 'Equip_No', 'Plan_HM', 'Plan_Date', 'Actual_HM', 'Actual_Date', 'Timestamp'];
  const shRows = [
    ['SH-001', 'EX-205', 4250, refDateStr, 4250.0, '2026-08-22', '2026-08-22 12:30:00'],
    ['SH-002', 'DZ-002', 8250, refDateStr, 8250.0, '2026-08-18', '2026-08-18 15:00:00'],
    ['SH-003', 'DT-3011', 6000, refDateStr, 6000.0, '2026-08-17', '2026-08-17 11:30:00'],
    ['SH-004', 'EX-306', 5250, refDateStr, 5250.0, '2026-08-10', '2026-08-10 11:30:00'],
    ['SH-005', 'DZ-012', 7000, refDateStr, 7000.0, '2026-08-12', '2026-08-12 14:00:00'],
    ['SH-006', 'SL-300', 1950, refDateStr, 1950.0, '2026-08-24', '2026-08-24 11:00:00'],
    ['SH-007', 'DT-3012', 5250, refDateStr, 5250.0, '2026-08-08', '2026-08-08 13:00:00'],
    ['SH-008', 'WL-010', 5000, refDateStr, 5000.0, '2026-08-16', '2026-08-16 15:30:00'],
    ['SH-009', 'WT-009', 3250, refDateStr, 3250.0, '2026-08-09', '2026-08-09 11:00:00'],
    ['SH-010', 'EX-302', 3750, refDateStr, 3750.0, '2026-08-14', '2026-08-14 16:00:00'],
    // Sep 1 service history
    ['SH-011', 'EX-205', 4390, refDateStr, 4330.0, '2026-09-01', '2026-09-01 12:30:00'],
    ['SH-012', 'DZ-005', 7230, refDateStr, 7254.5, '2026-09-01', '2026-09-01 15:00:00'],
    // Sep 2 service history
    ['SH-013', 'DZ-002', 8384, refDateStr, 8384.0, '2026-09-02', '2026-09-02 16:00:00'],
    ['SH-014', 'WL-010', 5104, refDateStr, 5090.5, '2026-09-02', '2026-09-02 14:00:00'],
    // Sep 3 service history
    ['SH-015', 'SL-200', 2450, refDateStr, 2351.0, '2026-09-03', '2026-09-03 12:00:00'],
    // Sep 4 service history
    ['SH-016', 'EX-310', 1830, refDateStr, 1634.5, '2026-09-04', '2026-09-04 16:00:00'],
    ['SH-017', 'GST-004', 4700, refDateStr, 4696.0, '2026-09-05', '2026-09-05 06:00:00'],
    // Sep 5 service history
    ['SH-018', 'DZ-008', 11890, refDateStr, 11665.5, '2026-09-05', '2026-09-05 16:00:00'],
    ['SH-019', 'SL-300', 2070, refDateStr, 1999.0, '2026-09-05', '2026-09-05 09:00:00'],
    // Sep 7 service history
    ['SH-020', 'EX-304', 3500, refDateStr, 3348.0, '2026-09-07', '2026-09-07 14:00:00']
  ];
  ensureSheet('ServiceHistory', shHeaders, shRows);

  // 14. INSPECTION MODULE (P2H HARIAN DENGAN TEMUAN TERHUBUNG KE WO & BACKLOG - SEP 1-7)
  const inspHeaders = ['ID', 'Tanggal', 'Equip_No', 'Tipe_Alat', 'Checklist_JSON', 'Inspector', 'Timestamp'];
  const inspRows = [
    // Sep 1 inspections
    ['INSP-001', '2026-09-01', 'EX-205', 'EXCAVATOR', JSON.stringify({ engine_oil: 'GOOD', coolant_level: 'GOOD', hydraulic_oil: 'GOOD', track_condition: 'GOOD', cabin_ac: 'GOOD', work_lamp: 'GOOD' }), 'Andi Herwan (PMC)', '2026-09-01 06:45:00'],
    ['INSP-002', '2026-09-01', 'DT-3011', 'DUMP TRUCK', JSON.stringify({ engine_oil: 'GOOD', brake_system: 'FAIL', tire_pressure: 'GOOD', dump_hoist: 'GOOD', cabin_lamp: 'GOOD' }), 'Andi Herwan (PMC)', '2026-09-01 06:50:00'],
    ['INSP-003', '2026-09-01', 'DZ-007', 'BULLDOZER', JSON.stringify({ engine_oil: 'GOOD', blade_cutting_edge: 'GOOD', track_tension: 'GOOD', transmission: 'FAIL', cooling_system: 'GOOD' }), 'Hariadi (GM & Mgr. Maintenance)', '2026-09-01 07:00:00'],
    ['INSP-004', '2026-09-01', 'WL-016', 'WHEEL LOADER', JSON.stringify({ engine_oil: 'GOOD', brake_system: 'GOOD', hydraulic_pressure: 'FAIL', tire_condition: 'GOOD', steering: 'GOOD' }), 'Andi Herwan (PMC)', '2026-09-01 07:10:00'],
    // Sep 2 inspections
    ['INSP-005', '2026-09-02', 'DZ-002', 'BULLDOZER', JSON.stringify({ engine_oil: 'GOOD', blade_cutting_edge: 'GOOD', track_tension: 'GOOD', transmission: 'GOOD', cooling_system: 'GOOD' }), 'Hariadi (GM & Mgr. Maintenance)', '2026-09-02 07:00:00'],
    ['INSP-006', '2026-09-02', 'WL-019', 'WHEEL LOADER', JSON.stringify({ engine_oil: 'GOOD', brake_system: 'GOOD', hydraulic_pressure: 'FAIL', work_lamp: 'GOOD' }), 'Hariadi (GM & Mgr. Maintenance)', '2026-09-02 07:20:00'],
    ['INSP-007', '2026-09-02', 'SL-100', 'SKID STEER LOADER', JSON.stringify({ engine_oil: 'GOOD', hydraulic_oil: 'GOOD', track_condition: 'GOOD', work_lamp: 'GOOD', cabin_ac: 'GOOD' }), 'Andi Herwan (PMC)', '2026-09-02 08:00:00'],
    ['INSP-008', '2026-09-02', 'WT-011', 'WATER TRUCK', JSON.stringify({ engine_oil: 'GOOD', brake_system: 'GOOD', tire_pressure: 'GOOD', pump_system: 'GOOD', water_tank: 'GOOD' }), 'Andi Herwan (PMC)', '2026-09-02 08:30:00'],
    // Sep 3 inspections
    ['INSP-009', '2026-09-03', 'EX-302', 'EXCAVATOR', JSON.stringify({ engine_oil: 'GOOD', coolant_level: 'GOOD', hydraulic_oil: 'FAIL', track_condition: 'GOOD', boom_cylinder: 'WARN' }), 'Andi Herwan (PMC)', '2026-09-03 06:45:00'],
    ['INSP-010', '2026-09-03', 'DZ-005', 'BULLDOZER', JSON.stringify({ engine_oil: 'GOOD', blade_cutting_edge: 'GOOD', track_tension: 'GOOD', transmission: 'GOOD', cooling_system: 'GOOD' }), 'Hariadi (GM & Mgr. Maintenance)', '2026-09-03 07:00:00'],
    ['INSP-011', '2026-09-03', 'DT-3017', 'DUMP TRUCK', JSON.stringify({ engine_oil: 'GOOD', brake_system: 'GOOD', tire_pressure: 'GOOD', propeller_shaft: 'WARN', dump_hoist: 'GOOD' }), 'Andi Herwan (PMC)', '2026-09-03 07:30:00'],
    // Sep 4 inspections
    ['INSP-012', '2026-09-04', 'SL-300', 'SKID STEER LOADER', JSON.stringify({ engine_oil: 'GOOD', hydraulic_oil: 'GOOD', track_condition: 'GOOD', work_lamp: 'GOOD', cabin_ac: 'GOOD' }), 'Andi Herwan (PMC)', '2026-09-04 06:45:00'],
    ['INSP-013', '2026-09-04', 'EX-310', 'EXCAVATOR', JSON.stringify({ engine_oil: 'GOOD', coolant_level: 'GOOD', hydraulic_oil: 'GOOD', track_condition: 'GOOD', swing_system: 'GOOD' }), 'Hariadi (GM & Mgr. Maintenance)', '2026-09-04 07:00:00'],
    ['INSP-014', '2026-09-04', 'WL-017', 'WHEEL LOADER', JSON.stringify({ engine_oil: 'GOOD', torque_converter: 'WARN', brake_system: 'GOOD', tire_condition: 'GOOD', bucket_teeth: 'GOOD' }), 'Andi Herwan (PMC)', '2026-09-04 07:30:00'],
    ['INSP-015', '2026-09-04', 'GST-004', 'GENSET 40 KVA', JSON.stringify({ engine_oil: 'GOOD', battery: 'WARN', alternator: 'GOOD', fuel_system: 'GOOD', cooling_system: 'GOOD' }), 'Hariadi (GM & Mgr. Maintenance)', '2026-09-04 22:00:00'],
    // Sep 5 inspections
    ['INSP-016', '2026-09-05', 'EX-305', 'EXCAVATOR', JSON.stringify({ engine_oil: 'GOOD', track_condition: 'FAIL', hydraulic_oil: 'GOOD', coolant_level: 'GOOD', boom_cylinder: 'GOOD' }), 'Andi Herwan (PMC)', '2026-09-05 06:45:00'],
    ['INSP-017', '2026-09-05', 'DT-3011', 'DUMP TRUCK', JSON.stringify({ engine_oil: 'GOOD', air_compressor: 'FAIL', brake_system: 'WARN', tire_pressure: 'GOOD', dump_hoist: 'GOOD' }), 'Brayen (Logistic)', '2026-09-05 07:00:00'],
    ['INSP-018', '2026-09-05', 'DZ-008', 'BULLDOZER', JSON.stringify({ engine_oil: 'GOOD', turbo: 'GOOD', blade_cutting_edge: 'GOOD', track_tension: 'GOOD', transmission: 'GOOD' }), 'Hariadi (GM & Mgr. Maintenance)', '2026-09-05 07:30:00'],
    // Sep 6 inspections
    ['INSP-019', '2026-09-06', 'DZ-007', 'BULLDOZER', JSON.stringify({ engine_oil: 'GOOD', track_adjuster: 'FAIL', blade_cutting_edge: 'GOOD', track_tension: 'FAIL', transmission: 'GOOD' }), 'Hariadi (GM & Mgr. Maintenance)', '2026-09-06 07:00:00'],
    ['INSP-020', '2026-09-06', 'WL-016', 'WHEEL LOADER', JSON.stringify({ engine_oil: 'GOOD', brake_caliper: 'FAIL', brake_system: 'FAIL', steering: 'GOOD', tire_condition: 'GOOD' }), 'Andi Herwan (PMC)', '2026-09-06 07:15:00'],
    ['INSP-021', '2026-09-06', 'EX-302', 'EXCAVATOR', JSON.stringify({ engine_oil: 'GOOD', alternator: 'FAIL', electrical_charging: 'FAIL', track_condition: 'GOOD', boom_cylinder: 'GOOD' }), 'Andi Herwan (PMC)', '2026-09-06 07:00:00'],
    ['INSP-022', '2026-09-06', 'EX-311', 'EXCAVATOR', JSON.stringify({ engine_oil: 'GOOD', ECM_status: 'FAIL', hydraulic_oil: 'GOOD', track_condition: 'GOOD', coolant_level: 'GOOD' }), 'Hariadi (GM & Mgr. Maintenance)', '2026-09-06 07:00:00'],
    ['INSP-023', '2026-09-06', 'ST-002', 'LUBE TRUCK', JSON.stringify({ engine_oil: 'GOOD', hydraulic_pump: 'FAIL', brake_system: 'GOOD', tire_pressure: 'GOOD', tank_integrity: 'GOOD' }), 'Brayen (Logistic)', '2026-09-06 07:30:00'],
    ['INSP-024', '2026-09-06', 'WT-009', 'WATER TRUCK', JSON.stringify({ engine_oil: 'GOOD', fuel_injection: 'FAIL', brake_system: 'GOOD', tire_pressure: 'GOOD', pump_system: 'GOOD' }), 'Andi Herwan (PMC)', '2026-09-06 06:00:00'],
    ['INSP-025', '2026-09-06', 'DZ-010', 'BULLDOZER', JSON.stringify({ engine_oil: 'GOOD', final_drive_left: 'FAIL', blade_cutting_edge: 'GOOD', track_tension: 'GOOD', transmission: 'GOOD' }), 'Andi Herwan (PMC)', '2026-09-06 09:00:00'],
    // Sep 7 inspections
    ['INSP-026', '2026-09-07', 'WL-019', 'WHEEL LOADER', JSON.stringify({ engine_oil: 'GOOD', transmission_temp: 'FAIL', oil_cooler: 'FAIL', brake_system: 'GOOD', steering: 'GOOD' }), 'Hariadi (GM & Mgr. Maintenance)', '2026-09-07 07:00:00'],
    ['INSP-027', '2026-09-07', 'DT-3019', 'DUMP TRUCK', JSON.stringify({ engine_oil: 'GOOD', vessel_hinge: 'FAIL', brake_system: 'GOOD', tire_pressure: 'GOOD', dump_hoist: 'GOOD' }), 'Brayen (Logistic)', '2026-09-07 07:30:00'],
    ['INSP-028', '2026-09-07', 'EX-205', 'EXCAVATOR', JSON.stringify({ engine_oil: 'GOOD', coolant_level: 'GOOD', hydraulic_oil: 'GOOD', track_condition: 'GOOD', swing_system: 'GOOD' }), 'Andi Herwan (PMC)', '2026-09-07 06:45:00']
  ];
  ensureSheet('Inspection', inspHeaders, inspRows);

  // 17. PLAN COMPONENT REPLACEMENT (PCR - MAJOR COMPONENT LIFETIME)
  // Current_HM diselaraskan dengan populationHM hm_start Sep 1
  const pcrHeaders = ['ID', 'Equip_No', 'Component_Name', 'Target_Lifetime_HM', 'Current_HM', 'Remaining_HM', 'Status', 'Estimated_Cost', 'Scheduled_Date'];
  const pcrRows = [
    ['PCR-001', 'EX-205', 'ENGINE ASSY (CAT C4.4)', 16000, 4316.0, 11684.0, 'AMAN', 280000000, getSampleDate(180)],
    ['PCR-002', 'EX-302', 'MAIN HYDRAULIC PUMP', 10000, 3880.0, 6120.0, 'AMAN', 120000000, getSampleDate(120)],
    ['PCR-003', 'EX-306', 'SWING REDUCTION GEARBOX', 12000, 5395.0, 6605.0, 'AMAN', 65000000, getSampleDate(150)],
    ['PCR-004', 'DZ-007', 'TRANSMISSION TORQFLOW', 12000, 11840.2, 159.8, 'CRITICAL', 175000000, getSampleDate(15)],
    ['PCR-005', 'DZ-002', 'FINAL DRIVE RH/LH', 15000, 8370.0, 6630.0, 'AMAN', 95000000, getSampleDate(180)],
    ['PCR-006', 'WL-017', 'TORQUE CONVERTER', 10000, 6920.0, 3080.0, 'WARNING', 85000000, getSampleDate(60)],
    ['PCR-007', 'DZ-008', 'ENGINE OVERHAUL (CAT 3406C)', 12000, 11650.0, 350.0, 'CRITICAL', 220000000, getSampleDate(10)],
    ['PCR-008', 'WL-019', 'MAIN HYDRAULIC PUMP', 10000, 3950.0, 6050.0, 'WARNING', 120000000, getSampleDate(90)],
    ['PCR-009', 'EX-309', 'ENGINE ASSY (CAT C7.1)', 16000, 480.0, 15520.0, 'AMAN', 280000000, getSampleDate(360)],
    ['PCR-010', 'DT-3019', 'DIFFERENTIAL ASSY REAR', 15000, 6480.0, 8520.0, 'AMAN', 45000000, getSampleDate(200)]
  ];
  ensureSheet('PCR_Components', pcrHeaders, pcrRows);

  // 18. PREVENTIVE MAINTENANCE (PM MODULAR 5-PILAR RECORDS - SEP 1-6)
  const pmHeaders = ['ID', 'Tanggal', 'Equip_No', 'PM_Type', 'Washing_Check', 'Greasing_Check', 'Inspection_Check', 'Torque_Check', 'Battery_Check', 'Mechanic', 'Notes', 'HM_PM', 'Status'];
  const pmRows = [
    // Sep 1 PM
    [
      'PM-2609', '2026-09-01', 'EX-205', 'PM 250H',
      'PASS (Steam Wash Undercarriage & Engine Bay Clean)',
      'PASS (24 Grease Points Lubricated Lithium EP-2)',
      'PASS (Oil & Filters Replaced, Zero Leakage)',
      'PASS (Track Shoe Bolts 450 Nm Verified)',
      'PASS (Alternator 27.8V Charging, Accu SG 1.26 OK)',
      'Tim Mekanik KBCT', 'Unit READY untuk operasi KBCT.', 4330, 'COMPLETED'
    ],
    [
      'PM-2610', '2026-09-01', 'DZ-005', 'PM 250H',
      'PASS (Undercarriage Heavy Mud Wash)',
      'PASS (Blade Trunnions & Equalizer Bar Greased)',
      'PASS (Fuel Water Separator Drained & Filter Changed)',
      'PASS (Sprocket Segment Bolts 650 Nm Verified)',
      'PASS (2x 12V 120Ah Battery Load Tested OK)',
      'Tim Mekanik KBCT', 'Servis 250H bulanan DZ-005.', 7254, 'COMPLETED'
    ],
    // Sep 2 PM
    [
      'PM-2611', '2026-09-02', 'DZ-002', 'PM 250H',
      'PASS (Undercarriage Heavy Mud Wash)',
      'PASS (Blade Trunnions & Equalizer Bar Greased)',
      'PASS (Fuel Water Separator Drained & Filter Changed)',
      'PASS (Sprocket Segment Bolts 650 Nm Verified)',
      'PASS (2x 12V 120Ah Battery Load Tested OK)',
      'Tim Mekanik KBCT', 'Servis 250H lengkap.', 8384, 'COMPLETED'
    ],
    [
      'PM-2612', '2026-09-02', 'WL-010', 'PM 500H',
      'PASS (Radiator Hydraulic C bersih)',
      'PASS (62 Grease Points Lubricated)',
      'PASS (Oil Level & Filter Normal)',
      'PASS (Bucket Bolt Torque 350 Nm)',
      'PASS (2x 12V 150Ah Battery OK)',
      'Tim Mekanik KBCT', 'Servis 500H WL-010 complete.', 5090, 'COMPLETED'
    ],
    // Sep 3 PM
    [
      'PM-2613', '2026-09-03', 'SL-200', 'PM 250H',
      'PASS (Skid Steer Steam Washed)',
      'PASS (Pivot and Attachment Points Greased)',
      'PASS (Hydraulic Level & Engine Oil OK)',
      'PASS (Wheel and Attachment Bolts Checked)',
      'PASS (Battery 12V 100Ah Tested OK)',
      'Tim Mekanik KBCT', 'PM 250H SL-200 selesai.', 2351, 'COMPLETED'
    ],
    // Sep 4 PM
    [
      'PM-2614', '2026-09-04', 'EX-310', 'PM 250H',
      'PASS (Undercarriage Cleaning)',
      'PASS (48 Grease Points Lubricated EP-2)',
      'PASS (Oil & Filters Changed, No Leak)',
      'PASS (Final Drive Bolts 850 Nm Verified)',
      'PASS (Alternator Charging 27.5V OK)',
      'Tim Mekanik KBCT', 'PM 250H + grease chassis full.', 1634, 'COMPLETED'
    ],
    [
      'PM-2615', '2026-09-04', 'GST-004', 'PM 250H',
      'PASS (Genset Compartment Blown Clean)',
      'PASS (Fuel Injector Valve Greased)',
      'PASS (Oil Level OK, Air Filter Clean)',
      'PASS (Voltage Regulator Calibrated)',
      'PASS (Battery Cranking 12.8V OK)',
      'Tim Mekanik KBCT', 'Genset test load 40A OK.', 4696, 'COMPLETED'
    ],
    // Sep 5 PM
    [
      'PM-2616', '2026-09-05', 'DZ-008', 'PM 250H',
      'PASS (Undercarriage Cleaning)',
      'PASS (Blade Pivot Greased)',
      'PASS (Engine Oil & Filter Changed)',
      'PASS (Turbo Inspection OK)',
      'PASS (Electrical System Check OK)',
      'Tim Mekanik KBCT', 'PM 250H + turbo check. All OK.', 11665, 'COMPLETED'
    ],
    [
      'PM-2617', '2026-09-05', 'SL-300', 'PM 250H',
      'PASS (Skid Steer Full Wash)',
      'PASS (All Pivot Points Greased)',
      'PASS (Hydraulic & Engine Oil OK)',
      'PASS (Control Valve Adjustment OK)',
      'PASS (Battery Load Test Pass)',
      'Tim Mekanik KBCT', 'PM 250H SL-300 done.', 1999, 'COMPLETED'
    ]
  ];
  ensureSheet('PM_Records', pmHeaders, pmRows);

  // 19. PLAN BUDGET BULANAN (REALISASI MAINTENANCE VS TARGET)
  const budgetHeaders = ['ID', 'Month_Year', 'Category', 'Budget_Plan', 'Actual_Spent', 'Variance', 'Status', 'Notes'];
  const curMonth = todayStr.slice(0, 7);
  const budgetRows = [
    ['BDG-01', curMonth, 'SPAREPART & FAST MOVING', 150000000, 85000000, 65000000, 'UNDER BUDGET', 'Prioritas: transmission DZ-007, seal kit WL-019, bucket teeth DT-3019'],
    ['BDG-02', curMonth, 'PELUMAS, OLI & GREASE', 75000000, 48000000, 27000000, 'UNDER BUDGET', 'Realisasi 9 PM service tercatat bulan ini; oli 800L terpakai'],
    ['BDG-03', curMonth, 'MAJOR COMPONENT OVERHAUL', 200000000, 175000000, 25000000, 'ON TRACK', 'Overhaul transmission DZ-007 estimasi Rp 175jt dalam proses'],
    ['BDG-04', curMonth, 'JASA SUBCON & BENGKEL LUAR', 50000000, 22000000, 28000000, 'UNDER BUDGET', 'Tidak ada subcon besar bulan ini - semua dikerjakan tim internal'],
    ['BDG-05', curMonth, 'SPECIAL TOOLS & WORKSHOP', 25000000, 18500000, 6500000, 'UNDER BUDGET', 'Kalibrasi torque wrench TOHNICHI dan order tooling minor']
  ];
  ensureSheet('Monthly_Budget', budgetHeaders, budgetRows);

  // 20. ACTUAL COST LEDGER PER EQUIPMENT (SEP 1-7 TRANSAKSI BIAYA LANGSUNG)
  const equipmentCostHeaders = [
    'ID', 'Transaction_Date', 'Equip_No', 'Category', 'Amount', 'Reference_No',
    'WO_No', 'Vendor', 'Description', 'Evidence_URL', 'Created_By', 'Timestamp'
  ];
  const equipmentCostRows = [
    ['CST-001', '2026-09-01', 'DZ-007', 'MAJOR COMPONENT OVERHAUL', 15000000, 'INV-TRX-007', 'WO2609-0001', 'PT TRAKINDO UTAMA', 'Jasa kalibrasi dan dyno test torqflow transmission DZ-007', '', 'Andi Herwan', '2026-09-01 16:00:00'],
    ['CST-002', '2026-09-01', 'EX-205', 'PELUMAS, OLI & GREASE', 1925000, 'INV-OIL-205', 'WO2609-0002', 'PT PERTAMINA PATRA NIAGA', 'Pengisian pelumas mesin Meditran SX SAE 15W-40 (35 Ltr)', '', 'Tim Mekanik KBCT', '2026-09-01 14:00:00'],
    ['CST-003', '2026-09-01', 'DT-3011', 'SPAREPART & FAST MOVING', 2500000, 'INV-BRK-011', 'WO2609-0004', 'TOKO BERKAT SPAREPART', 'Brake pad assembly set front/rear Shacman F3000', '', 'Brayen', '2026-09-01 18:00:00'],
    ['CST-004', '2026-09-02', 'WL-016', 'JASA SUBCON & BENGKEL LUAR', 4500000, 'INV-HYD-016', 'WO2609-0003', 'CV HIDROLIK JAYA', 'Jasa honing barrel cylinder hidrolik dan leak test tekanan tinggi', '', 'Tim Mekanik KBCT', '2026-09-02 15:00:00'],
    ['CST-005', '2026-09-02', 'DZ-002', 'PELUMAS, OLI & GREASE', 2200000, 'INV-OIL-002', 'WO2609-0006', 'PT PERTAMINA PATRA NIAGA', 'Oli mesin Meditran SX 40L servis PM 250H', '', 'Tim Mekanik KBCT', '2026-09-02 16:00:00'],
    ['CST-006', '2026-09-03', 'EX-302', 'SPAREPART & FAST MOVING', 4430000, 'INV-HSE-302', 'WO2609-0007', 'CV MITRA TEKNIK', 'Hydraulic hose 3/4 inch high pressure 6m + oli Turalik 25L', '', 'Andi Herwan', '2026-09-03 16:30:00'],
    ['CST-007', '2026-09-03', 'SL-100', 'SPAREPART & FAST MOVING', 1100000, 'INV-TTH-100', 'WO2609-0008', 'CV BUMI MAKMUR', 'Bucket tooth point PC200 4 pcs Skid Steer', '', 'Brayen', '2026-09-03 17:00:00'],
    ['CST-008', '2026-09-04', 'WL-019', 'JASA SUBCON & BENGKEL LUAR', 3800000, 'INV-VLV-019', 'WO2609-0005', 'CV HIDROLIK JAYA', 'Lapping & pressure calibration relief valve control valve', '', 'Hariadi', '2026-09-04 16:00:00'],
    ['CST-009', '2026-09-04', 'SL-300', 'PELUMAS, OLI & GREASE', 825000, 'INV-OIL-300', 'WO2609-0009', 'PT PERTAMINA PATRA NIAGA', 'Oli mesin SAE 15W-40 15L servis PM 250H', '', 'Tim Mekanik KBCT', '2026-09-04 18:00:00'],
    ['CST-010', '2026-09-05', 'DT-3011', 'SPAREPART & FAST MOVING', 1250000, 'INV-PNE-011', 'WO2609-0010', 'TOKO BERKAT SPAREPART', 'Brake pad set tambahan dan fitting pneumatic air compressor', '', 'Brayen', '2026-09-05 17:00:00'],
    ['CST-011', '2026-09-05', 'EX-305', 'SPAREPART & FAST MOVING', 1360000, 'INV-TRK-305', 'WO2609-0011', 'CV BUMI MAKMUR', 'Track shoe bolt & nut 16 set Sany SY330H', '', 'Tim Mekanik KBCT', '2026-09-05 15:00:00'],
    ['CST-012', '2026-09-06', 'DZ-007', 'PELUMAS, OLI & GREASE', 1125000, 'INV-GRS-007', 'WO2609-0012', 'PT PERTAMINA PATRA NIAGA', 'Chassis grease Lithium EP-2 (15 Kg) pengisian track adjuster', '', 'Tim Mekanik KBCT', '2026-09-06 16:30:00'],
    ['CST-013', '2026-09-06', 'EX-302', 'SPAREPART & FAST MOVING', 4200000, 'INV-ALT-302', 'WO2609-0014', 'PT CENTRAL MOTOR', 'Alternator 24V 60A baru SANY SY330H', '', 'Tim Mekanik KBCT', '2026-09-06 13:30:00'],
    ['CST-014', '2026-09-06', 'EX-311', 'SPECIAL TOOLS & WORKSHOP', 2500000, 'INV-SCN-311', 'WO2609-0015', 'PT TRAKINDO UTAMA', 'Jasa on-site electronic scanning diagnostic CAT ET & kalibrasi ECM', '', 'Hariadi', '2026-09-06 17:00:00'],
    ['CST-015', '2026-09-07', 'ST-002', 'SPAREPART & FAST MOVING', 960000, 'INV-HSE-002', 'WO2609-0016', 'CV MITRA TEKNIK', 'Hydraulic hose 3/4 inch 2 meter high pressure penggantian ST-002', '', 'Tim Mekanik KBCT', '2026-09-07 10:00:00']
  ];
  ensureSheet('Equipment_Cost', equipmentCostHeaders, equipmentCostRows);

  // Hapus sheet legacy 'Equipment_Productivity' jika masih ada di spreadsheet
  // (Data ritase/BCM tambang berada di luar lingkup Maintenance Management)
  try {
    const legacyProdSheet = ss.getSheetByName('Equipment_Productivity');
    if (legacyProdSheet) {
      ss.deleteSheet(legacyProdSheet);
      logSystem('SetupDatabase', "Sheet legacy 'Equipment_Productivity' dihapus (di luar lingkup Maintenance Management).", 'SYSTEM');
    }
  } catch (e) {}

  // 22. FAILURE ANALYSIS REPORT (FAR - ROOT CAUSE RCFA)
  const farHeaders = ['ID', 'Tanggal', 'Equip_No', 'Component_Name', 'Chronology', 'Five_Why_JSON', 'Fishbone_JSON', 'Corrective_Action', 'Preventive_Action', 'Status', 'Lead_Investigator'];
  const farRows = [
    [
      'FAR-2026-001', getSampleDate(1), 'DZ-007', 'TRANSMISSION TORQFLOW',
      'Saat operasi dozing overburden, unit DZ-007 tidak dapat bergerak maju/mundur. Tekanan torqflow terukur di bawah standar 17 kg/cm² yaitu hanya 9 kg/cm². Unit dinyatakan breakdown dan WO-001 dibuka.',
      JSON.stringify({
        w1: 'Unit tidak dapat bergerak karena torqflow tidak membangun tekanan.',
        w2: 'Pressure control valve torqflow macet dan tidak berfungsi.',
        w3: 'Kontaminasi metal debris pada circuit oli transmisi menyebabkan valve seret.',
        w4: 'Filter transmisi tidak diganti sesuai jadwal interval 250H karena stok kosong.',
        root_cause: 'Manajemen stok filter transmisi tidak terpantau; minimun stok tidak dijaga sehingga PM tidak bisa dilaksanakan tepat waktu.'
      }),
      JSON.stringify({
        man: 'PMC tidak memonitor ketersediaan sparepart filter transmisi sebelum jadwal PM.',
        machine: 'Torqflow DZ-007 usia pakai 11.840 jam - komponen sudah mendekati batas lifetime.',
        material: 'Kualitas oli transmisi tidak dicek sejak 500 jam terakhir.',
        method: 'Prosedur monitoring tekanan torqflow tidak ada dalam form P2H harian.',
        environment: 'Unit beroperasi di area berdebu tinggi yang mempercepat kontaminasi oli.'
      }),
      'Bersihkan circuit transmisi, ganti filter dan oli transmisi, setting ulang pressure control valve.',
      'Tambahkan item cek tekanan torqflow pada form P2H harian. Pastikan stok filter transmisi minimum 3 PC selalu tersedia di gudang.',
      'IN PROGRESS', 'Hariadi'
    ],
    [
      'FAR-2026-002', getSampleDate(2), 'WL-019', 'MAIN HYDRAULIC PUMP',
      'Gerakan bucket WL-019 terasa lambat dan tekanan hidrolik rendah di bawah 250 bar dari standar 320 bar. Pressure test menunjukkan main pump mengalami internal leakage.',
      JSON.stringify({
        w1: 'Tekanan hidrolik rendah menyebabkan gerakan bucket lambat dan tidak bertenaga.',
        w2: 'Main hydraulic pump mengalami internal leakage dan tidak dapat membangun pressure.',
        w3: 'Piston pump aus akibat kontaminasi partikel besi pada oli hidrolik.',
        w4: 'Filter return line hidrolik tidak diganti pada PM 500H terakhir.',
        root_cause: 'Prosedur PM 500H WL-019 tidak lengkap; penggantian filter return line terlewat menyebabkan kontaminasi oli dan kerusakan pump.'
      }),
      JSON.stringify({
        man: 'Mekanik melewatkan item penggantian filter return line saat PM 500H.',
        machine: 'Main pump WL-019 usia pakai 3.950 jam - komponen dalam periode rawan kerusakan.',
        material: 'Oli hidrolik terkontaminasi partikel besi dari keausan komponen.',
        method: 'Checklist PM 500H tidak mencantumkan verifikasi kondisi oli dengan analisis.',
        environment: 'Unit beroperasi di area loading berbatu yang mempercepat getaran komponen.'
      }),
      'Overhaul main hydraulic pump, ganti seal kit dan piston set, flush system hidrolik, ganti oli dan semua filter.',
      'Tambahkan oil analysis hidrolik pada PM 500H. Buat checklist verifikasi tekanan pompa setelah setiap PM.',
      'IN PROGRESS', 'Andi Herwan'
    ],
    [
      'FAR-2026-003', getSampleDate(5), 'GST-003', 'ALTERNATOR',
      'Genset GST-003 mati total saat operasi malam hari karena tegangan drop dari 28V ke 18V. Alternator ditemukan gosong pada rotor coil.',
      JSON.stringify({
        w1: 'Genset mati karena alternator tidak mengisi baterai sehingga tegangan drop.',
        w2: 'Rotor coil alternator short circuit dan terbakar.',
        w3: 'Suhu internal alternator overheat akibat debu batubara menyumbat ventilasi.',
        w4: 'Blowing debu pada housing alternator tidak dilakukan saat servis PM.',
        root_cause: 'Prosedur cleaning alternator belum masuk checklist mandatory servis PM 500H genset.'
      }),
      JSON.stringify({
        man: 'Mekanik tidak melakukan blowing debu pada kompartemen alternator saat PM.',
        machine: 'Alternator GST-003 usia pakai 4.920 jam tanpa penggantian.',
        material: 'Rotor coil kualitas standar rentan terhadap kontaminasi debu batubara.',
        method: 'Checklist PM genset tidak mencantumkan cleaning alternator secara spesifik.',
        environment: 'Lokasi genset di area stockpile berdebu tebal 24 jam.'
      }),
      'Ganti alternator baru P/N VG1500090065. Periksa wiring harness dan koneksi charging.',
      'Tambahkan item mandatory Blowing & Cleaning Alternator pada checklist PM genset. Lakukan inspeksi visual alternator setiap 250 jam.',
      'CLOSED', 'Hariadi'
    ]
  ];
  ensureSheet('Failure_Analysis', farHeaders, farRows);

  // 21. SWAB COMPONENT (KANIBALISASI ANTAR UNIT)
  const swabHeaders = ['ID', 'Tanggal', 'Donor_Unit', 'Target_Unit', 'Component_Name', 'Reason', 'Authorized_By', 'Mechanic', 'Status', 'Restoration_Date'];
  const swabRows = [
    ['SWAB-001', getSampleDate(5), 'WL-016', 'WL-019', 'MAIN CONTROL VALVE RELIEF', 'WL-016 dan WL-019 berstatus BREAKDOWN; komponen dipakai untuk percepatan pemulihan unit prioritas.', 'Hariadi', 'Tim Mekanik KBCT', 'ACTIVE (PINJAM)', '-'],
    ['SWAB-002', getSampleDate(12), 'DT-3012', 'DT-3011', 'PROPELLER SHAFT REAR', 'DT-3012 standby terencana, DT-3011 diprioritaskan untuk hauling KBCT.', 'Hariadi', 'Tim Mekanik KBCT', 'RESTORED (KEMBALI)', getSampleDate(7)]
  ];
  ensureSheet('Swab_Components', swabHeaders, swabRows);

  // 22. NOTULEN RAPAT & ACTION TRACKER
  const meetingHeaders = ['ID', 'Tanggal', 'Topic', 'Leader', 'Attendees', 'Discussion_Summary', 'Action_Items_JSON', 'Status', 'Plant_Health', 'Critical_Issue', 'Operational_Impact', 'Management_Decision'];
  const meetingRows = [
    [
      'NOTULEN-001', getSampleDate(3), 'Evaluasi Kesiapan Alat (PA) & Pengendalian Breakdown Mingguan',
      'Hariadi', 'Andi Herwan, Brayen, M. Nur Salam, M. Rahim',
      'Pembahasan target PA armada PT. KUK area KBCT/LMP. Disepakati percepatan sparepart untuk DZ-007, WL-016, dan WL-019 yang berstatus BREAKDOWN.',
      JSON.stringify([
        { item: 'Follow up sparepart brake WL-016', pic: 'Brayen', deadline: getSampleDate(1), status: 'IN PROGRESS' },
        { item: 'Siapkan special tool untuk transmission DZ-007', pic: 'Andi Herwan', deadline: getSampleDate(0), status: 'IN PROGRESS' },
        { item: 'Evaluasi hydraulic pump WL-019', pic: 'Hariadi', deadline: getSampleDate(0), status: 'IN PROGRESS' }
      ]),
      'ACTIVE',
      'PA Armada 85.2% dari target 88% - 3 unit BREAKDOWN',
      'DZ-007 transmission torqflow kritis - menghambat produksi overburden',
      'Kapasitas hauling berkurang ±15% selama DZ-007 & WL-016 tidak operasi',
      'Prioritaskan sparepart DZ-007 & WL-016, percepat overhaul transmission'
    ],
    [
      'NOTULEN-002', getSampleDate(6), 'Weekly Maintenance Review & Target PA September 2026',
      'Hariadi', 'Andi Herwan, Brayen, M. Rahim, Tim Mekanik KBCT',
      'Review progress WO minggu lalu: 8 CLOSED, 5 OPEN, 2 WAITING PART. PA sementara 85.5% dari target 88%.',
      JSON.stringify([
        { item: 'Selesaikan WO-007 (WL-019 hydraulic pump)', pic: 'Tim Mekanik KBCT', deadline: getSampleDate(7), status: 'IN PROGRESS' },
        { item: 'Order bucket teeth untuk DT-3019', pic: 'Brayen', deadline: getSampleDate(8), status: 'OPEN' },
        { item: 'Diagnosa final drive DZ-010 di area LMP', pic: 'Andi Herwan', deadline: getSampleDate(7), status: 'IN PROGRESS' }
      ]),
      'ACTIVE',
      'PA Armada 85.5% - target akhir bulan 88% masih achievable',
      'WL-019 hydraulic pump perlu overhaul - downtime estimasi 3 hari',
      'Produktivitas loading berkurang saat WL-019 off; EX-302 cover operasi sementara',
      'Approve PO sparepart minggu depan; push vendor untuk delivery cepat'
    ]
  ];
  ensureSheet('Meeting_Notes', meetingHeaders, meetingRows);

  // 23. MASTER TOOLS & WORKSHOP
  const toolHeaders = ['Tool_ID', 'Tool_Name', 'Category', 'Brand_Spec', 'Quantity', 'Condition', 'Location', 'Borrower', 'Status'];
  const toolRows = [
    ['TL-001', 'DIGITAL TORQUE WRENCH 100-1000 NM', 'SPECIAL TOOL', 'TOHNICHI 1000QL3', 2, 'GOOD (CALIBRATED)', 'RACK TOOLS A1', '-', 'AVAILABLE'],
    ['TL-002', 'HYDRAULIC PRESSURE TEST KIT 700 BAR', 'DIAGNOSTIC TOOL', 'HYDAC FULL COUPLER', 1, 'GOOD', 'CASE BOX B2', 'Budi Santoso', 'IN USE (EX-02)'],
    ['TL-003', 'BATTERY TESTER & REFRACTOMETER SG', 'ELECTRICAL TOOL', 'MIDTRONICS EXP-1000', 2, 'GOOD', 'CABINET EL-01', '-', 'AVAILABLE'],
    ['TL-004', 'PNEUMATIC IMPACT WRENCH 1 INCH', 'POWER TOOL', 'INGERSOLL RAND 285B', 3, 'GOOD', 'WORKSHOP BAY 2', 'Agus Prasetyo', 'IN USE (WL-01)'],
    ['TL-005', 'TRACK PIN PUSHER & INSTALLER 100 TON', 'UNDERCARRIAGE TOOL', 'ENERPAC MASTER PIN', 1, 'GOOD', 'HEAVY TOOL BAY', '-', 'AVAILABLE'],
    ['TL-006', 'LASER TACHOMETER & DIGITAL THERMOMETER', 'MEASURING TOOL', 'FLUKE 62 MAX+', 2, 'GOOD', 'CABINET EL-02', '-', 'AVAILABLE']
  ];
  ensureSheet('Master_Tools', toolHeaders, toolRows);

  // 14B. PART USAGE
  const puHeaders = ['No_WO', 'Equip_No', 'Tgl_Pakai', 'Part_Number', 'Description', 'Qty', 'UOM', 'Remarks'];
  ensureSheet('PartUsage', puHeaders, []);

  // 15. SETTINGS
  const setHeaders = ['Key', 'Value'];
  const setRows = [
    ['CompanyName', 'PT. KUK'],
    ['ThemeColor', '#0f172a'],
    ['CompanyLogo', ''],
    ['ShiftDate', todayStr],
    ['DocPrefix', 'PLANT-KUK/KBCT/2026']
  ];
  ensureSheet('Settings', setHeaders, setRows);

  // 16. SYSTEM LOGS
  const logHeaders = ['Timestamp', 'Action', 'Message', 'User'];
  const logRows = [
    [todayStr + ' 07:00:00', 'Setup_Database', 'Inisialisasi database dan injeksi data sample lengkap seluruh 24 modul berhasil.', 'SYSTEM'],
    [todayStr + ' 07:30:00', 'User_Login', 'User planner berhasil login ke sistem.', 'planner'],
    [todayStr + ' 08:30:00', 'WO_Created', 'Work Order WO-006 untuk unit WL-01 berhasil didaftarkan.', 'planner']
  ];
  ensureSheet('SystemLogs', logHeaders, logRows);

  SpreadsheetApp.flush();
  const setupMessage = forceSeed
    ? "Seluruh sheet dan data sample berhasil dibuat ulang serta disinkronkan."
    : "Struktur database berhasil diperiksa dan data populasi unit berhasil disinkronkan tanpa menghapus data operasional.";
  logSystem("Setup_Complete", setupMessage, "SYSTEM");
  return setupMessage;
}

// ==========================================
// 3. AUTH & USERS
// ==========================================
function loginUser(f) {
  try {
    if (typeof f === 'string') {
      try { f = JSON.parse(f); } catch (err) {}
    }
    f = f || {};

    const ss = getSpreadsheet_();
    let sheet = ss.getSheetByName('Users');
    
    if (!sheet || sheet.getLastRow() < 2) {
      setupDatabase(false);
      sheet = ss.getSheetByName('Users');
    }
    
    const data = sheet.getDataRange().getValues();
    const inputUser = String(f.username || "").trim().toLowerCase();
    const inputPass = String(f.password || "").trim();

    if (!inputUser || !inputPass) {
      return { success: false, message: "Username dan Password wajib diisi!" };
    }
    
    let candidateUser = null;
    let passwordMatched = false;

    for (let i = 1; i < data.length; i++) {
      const u = String(data[i][0] || "").trim().toLowerCase();
      const p = String(data[i][1] || "").trim();
      const nama = String(data[i][2] || "").trim().toLowerCase();
      const role = String(data[i][3] || "User").trim();
      const status = String(data[i][4] || "ACTIVE").trim().toUpperCase();
      
      // Cocokkan username (kolom A) atau nama lengkap (kolom C)
      if (u === inputUser || nama === inputUser) {
        candidateUser = {
          username: String(data[i][0] || "").trim(),
          nama: String(data[i][2] || data[i][0]).trim(),
          role: role,
          status: status || "ACTIVE"
        };
        if (p === inputPass) {
          passwordMatched = true;
          break;
        }
      }
    }

    // 1. Jika ditemukan di sheet Users
    if (candidateUser && passwordMatched) {
      const userStatus = String(candidateUser.status || "ACTIVE").toUpperCase();
      if (userStatus === "REJECTED") {
        return {
          success: false,
          message: "Akun Anda (" + candidateUser.username + ") telah dinonaktifkan / ditolak. Silakan hubungi IT Helpdesk."
        };
      }

      logSystem("Login", "User " + candidateUser.username + " berhasil login.", candidateUser.username);
      return {
        success: true,
        user: candidateUser
      };
    } else if (candidateUser && !passwordMatched) {
      logSystem("Login_Failed", "Password salah untuk user: " + candidateUser.username, "SYSTEM");
      return { success: false, message: "Password yang Anda masukkan salah!" };
    }
    
    logSystem("Login_Failed", "User tidak ditemukan: " + inputUser, "SYSTEM");
    return { success: false, message: "Username atau Nama '" + inputUser + "' tidak ditemukan di daftar pengguna!" };
  } catch (e) {
    return { success: false, message: "Server Error: " + e.toString() };
  }
}

function getUsersList() {
  try {
    const ss = getSpreadsheet_();
    const sheet = ss.getSheetByName('Users');
    if (!sheet) return { success: true, data: [] };
    return { success: true, data: cleanMaster(sheet.getDataRange().getValues()) };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function saveUser(u) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Users');
    if (!sheet) setupDatabase(false);
    
    if (sheet.getLastColumn() < 5) {
      sheet.getRange(1, 5).setValue('Status');
    }

    const data = sheet.getDataRange().getValues();
    const username = String(u.username || "").trim();
    if (!username) return { success: false, message: "Username wajib diisi" };

    const status = String(u.status || "ACTIVE").trim().toUpperCase();

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toLowerCase() === username.toLowerCase()) {
        sheet.getRange(i + 1, 2).setValue(u.password || data[i][1]);
        sheet.getRange(i + 1, 3).setValue(u.nama || data[i][2]);
        sheet.getRange(i + 1, 4).setValue(u.role || data[i][3]);
        if (u.status !== undefined) {
          sheet.getRange(i + 1, 5).setValue(status);
        }
        logSystem("User_Updated", "User " + username + " diupdate. Status: " + (u.status || data[i][4] || "ACTIVE"), "ADMIN");
        return { success: true, message: "User berhasil diperbarui!" };
      }
    }

    sheet.appendRow([username, u.password || "123456", u.nama || username, u.role || "User", status]);
    logSystem("User_Created", "User baru " + username + " dibuat di Users dengan status " + status, "ADMIN");
    return { 
      success: true, 
      status: status,
      message: "User baru berhasil dibuat di daftar Users!" 
    };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function approveUser(username, newStatus) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Users');
    if (!sheet) return { success: false, message: "Sheet Users tidak ditemukan" };
    
    if (sheet.getLastColumn() < 5) {
      sheet.getRange(1, 5).setValue('Status');
    }

    const target = String(username || "").trim().toLowerCase();
    const st = String(newStatus || "ACTIVE").trim().toUpperCase();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toLowerCase() === target) {
        sheet.getRange(i + 1, 5).setValue(st);
        logSystem("User_Approval", "User " + target + " diubah status menjadi " + st, "IT_HELPDESK");
        return { 
          success: true, 
          message: "Status akun " + target + " berhasil diubah menjadi " + (st === 'ACTIVE' ? 'DISETUJUI (Aktif)' : st) + "!" 
        };
      }
    }
    return { success: false, message: "User " + target + " tidak ditemukan di database" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function deleteUser(username) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Users');
    if (!sheet) return { success: false, message: "Sheet Users tidak ditemukan" };
    
    const target = String(username || "").trim().toLowerCase();
    if (target === 'planner' || target === 'admin') {
      return { success: false, message: "User default sistem tidak boleh dihapus!" };
    }

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toLowerCase() === target) {
        sheet.deleteRow(i + 1);
        logSystem("User_Deleted", "User " + target + " dihapus.", "ADMIN");
        return { success: true, message: "User berhasil dihapus!" };
      }
    }
    return { success: false, message: "User tidak ditemukan" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

// ==========================================
// 4. USER ACCESS CONTROL
// ==========================================
function getUserAccess(u) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('UserAccess');
    if (!sheet) return { success: true, features: [] };
    
    const target = String(u || "").trim().toLowerCase();
    const data = sheet.getDataRange().getValues();
    const features = [];
    
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toLowerCase() === target) {
        features.push(String(data[i][1]).trim());
      }
    }
    return { success: true, features: features };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function saveUserAccess(u, features) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('UserAccess');
    if (!sheet) {
      sheet = ss.insertSheet('UserAccess');
      sheet.appendRow(['Username', 'Feature', 'Timestamp']);
    }
    
    const target = String(u || "").trim().toLowerCase();
    const data = sheet.getDataRange().getValues();
    
    // Hapus akses lama
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).trim().toLowerCase() === target) {
        sheet.deleteRow(i + 1);
      }
    }
    
    // Tambah akses baru
    if (Array.isArray(features)) {
      features.forEach(f => {
        sheet.appendRow([target, f, new Date()]);
      });
    }
    
    SpreadsheetApp.flush();
    logSystem("UserAccess_Saved", "Akses diperbarui untuk " + target, "ADMIN");
    return { success: true, message: "Hak akses berhasil disimpan!" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function deleteUserAccess(u, feature) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('UserAccess');
    if (!sheet) return { success: true };
    
    const target = String(u || "").trim().toLowerCase();
    const targetFeat = String(feature || "").trim().toLowerCase();
    const data = sheet.getDataRange().getValues();
    
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).trim().toLowerCase() === target && String(data[i][1]).trim().toLowerCase() === targetFeat) {
        sheet.deleteRow(i + 1);
      }
    }
    return { success: true };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function getAllUserAccess() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('UserAccess');
    if (!sheet) return { success: true, data: {} };
    
    const data = sheet.getDataRange().getValues();
    const map = {};
    for (let i = 1; i < data.length; i++) {
      const u = String(data[i][0] || "").trim().toLowerCase();
      const f = String(data[i][1] || "").trim();
      if (u && f) {
        if (!map[u]) map[u] = [];
        map[u].push(f);
      }
    }
    return { success: true, data: map };
  } catch(e) { return { success: false, message: e.toString() }; }
}

// ==========================================
// 5. SETTINGS
// ==========================================
function getSettings() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Settings');
    if (!sheet) return { success: true, data: {}, settings: {} };
    
    const data = sheet.getDataRange().getValues();
    const settings = {};
    for (let i = 1; i < data.length; i++) {
      const key = String(data[i][0] || "").trim();
      const val = data[i][1];
      if (key) settings[key] = val;
    }
    return { success: true, data: settings, settings: settings };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function saveSettings(c) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Settings');
    if (!sheet) {
      sheet = ss.insertSheet('Settings');
      sheet.appendRow(['Key', 'Value']);
    }
    
    const existing = sheet.getDataRange().getValues();
    const map = {};
    for (let i = 1; i < existing.length; i++) {
      map[String(existing[i][0]).trim()] = i + 1;
    }
    
    for (let key in c) {
      if (map[key]) {
        sheet.getRange(map[key], 2).setValue(c[key]);
      } else {
        sheet.appendRow([key, c[key]]);
      }
    }
    
    SpreadsheetApp.flush();
    logSystem("Settings_Saved", "Pengaturan sistem diperbarui", "ADMIN");
    return { success: true, message: "Pengaturan berhasil disimpan!" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

// ==========================================
// 6. OPTIMIZED SYNC & CLEANERS
// ==========================================
function getOptimizedData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Batch read ALL sheets in a single operation (5-10x faster than 25 separate getSheetByName calls)
    const allSheets = ss.getSheets();
    const sheetMap = {};
    allSheets.forEach(s => {
      sheetMap[s.getName()] = s.getDataRange().getValues();
    });

    if (!sheetMap['MasterMekanik'] || sheetMap['MasterMekanik'].length <= 1) {
      setupDatabase(false);
      const reloadedSheets = ss.getSheets();
      reloadedSheets.forEach(s => {
        sheetMap[s.getName()] = s.getDataRange().getValues();
      });
    }
    
    // Build user access map
    const accessData = sheetMap['UserAccess'] || [];
    let userAccessMap = {};
    for (let i = 1; i < accessData.length; i++) {
      const username = String(accessData[i][0] || "").trim().toLowerCase();
      const feature = String(accessData[i][1] || "").trim();
      if (username && feature) {
        if (!userAccessMap[username]) userAccessMap[username] = [];
        userAccessMap[username].push(feature);
      }
    }

    const settingsData = sheetMap['Settings'] || [];
    let settingsObj = {};
    for (let i = 1; i < settingsData.length; i++) {
      const k = String(settingsData[i][0] || "").trim();
      const v = settingsData[i][1];
      if (k) settingsObj[k] = v;
    }
    
    return {
      success: true,
      equip: cleanMaster(sheetMap['MasterEquip'] || []),
      parts: cleanMaster(sheetMap['MasterParts'] || []),
      stock: cleanMaster(sheetMap['Stock'] || (sheetMap['MasterParts'] || [])),
      planAlat: cleanMaster(sheetMap['PlanAlat'] || []),
      planService: cleanMaster(sheetMap['PlanService'] || []),
      dailyHM: cleanData(sheetMap['DailyHM'] || []),
      components: cleanMaster(sheetMap['MasterComponent'] || []),
      usersData: cleanMaster(sheetMap['Users'] || []),
      mekanikList: cleanMaster(sheetMap['MasterMekanik'] || []),
      pelaporList: cleanMaster(sheetMap['MasterPelapor'] || []),
      activities: cleanData(sheetMap['MechanicActivity'] || []),
      wo: cleanData(sheetMap['WorkOrders'] || []),
      backlog: cleanData(sheetMap['Backlog'] || []),
      serviceHistory: cleanData(sheetMap['ServiceHistory'] || []),
      inspections: cleanData(sheetMap['Inspection'] || []),
      pcr: cleanData(sheetMap['PCR_Components'] || []),
      pmRecords: cleanData(sheetMap['PM_Records'] || []),
      monthlyBudget: cleanData(sheetMap['Monthly_Budget'] || []),
      equipmentCosts: cleanData(sheetMap['Equipment_Cost'] || []),
      equipmentProductivity: [],
      farRecords: cleanData(sheetMap['Failure_Analysis'] || []),
      swabComponents: cleanData(sheetMap['Swab_Components'] || []),
      meetingNotes: cleanData(sheetMap['Meeting_Notes'] || []),
      masterTools: cleanData(sheetMap['Master_Tools'] || []),
      userAccess: userAccessMap,
      settings: settingsObj,
      // Convenience aliases used by some frontend cache paths
      planHours: cleanMaster(sheetMap['PlanAlat'] || [])
    };
  } catch (e) { return { success: false, message: e.toString() }; }
}

function cleanMaster(v) {
  if (!v || v.length <= 1) return [];
  const h = v[0];
  return v.slice(1).filter(r => r[0] !== "" && r[0] !== null).map(r => { 
    let o = {}; 
    h.forEach((key, i) => { 
      let val = r[i]; 
      if (val instanceof Date) { 
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd"); 
      } 
      o[String(key).toLowerCase().replace(/\s+/g, '_')] = val; 
    }); 
    return o; 
  });
}

function cleanData(v) {
  if (!v || v.length <= 1) return [];
  const h = v[0];
  return v.slice(1).filter(r => r[0] !== "" && r[0] !== null).map(r => {
    let o = {};
    h.forEach((key, i) => {
      let val = r[i];
      if (val instanceof Date) {
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
      }
      const cleanKey = String(key).toLowerCase().replace(/\s+/g, '_');
      o[cleanKey] = val;

      const jsonAliases = {
        parts_json: 'parts',
        checklist_json: 'checklist',
        five_why_json: 'five_why',
        fishbone_json: 'fishbone',
        action_items_json: 'action_items'
      };
      if (jsonAliases[cleanKey] && val) {
        try { o[jsonAliases[cleanKey]] = typeof val === 'string' ? JSON.parse(val) : val; }
        catch(e) { o[jsonAliases[cleanKey]] = cleanKey === 'action_items_json' || cleanKey === 'parts_json' ? [] : {}; }
      }
    });

    // Frontend aliases. Keep original keys for backward compatibility.
    if (o.id !== undefined) {
      if (o.component_name !== undefined && o.target_lifetime_hm !== undefined) o.pcr_id = o.id;
      if (o.pm_type !== undefined) o.pm_id = o.id;
      if (o.month_year !== undefined) o.budget_id = o.id;
      if (o.transaction_date !== undefined && o.amount !== undefined) o.cost_id = o.id;
      if (o.chronology !== undefined) o.far_no = o.id;
      if (o.donor_unit !== undefined) o.swab_id = o.id;
      if (o.action_items_json !== undefined) o.meeting_id = o.id;
    }
    if (o.estimated_cost !== undefined) o.est_cost = o.estimated_cost;
    if (o.month_year !== undefined) o.period_month = o.month_year;
    if (o.budget_plan !== undefined) o.plan_amount = o.budget_plan;
    if (o.actual_spent !== undefined) o.actual_amount = o.actual_spent;
    if (o.donor_unit !== undefined) o.donor_equip = o.donor_unit;
    if (o.target_unit !== undefined) o.target_equip = o.target_unit;
    if (o.reason !== undefined) o.notes = o.reason;
    if (o.restoration_date !== undefined) o.target_restore_date = o.restoration_date;
    if (o.attendees !== undefined) o.participants = o.attendees;
    if (o.discussion_summary !== undefined) o.summary = o.discussion_summary;
    if (o.quantity !== undefined) o.qty = o.quantity;
    // Backlog: alias deskripsi_backlog -> deskripsi (frontend uses b.deskripsi)
    if (o.deskripsi_backlog !== undefined && o.deskripsi === undefined) o.deskripsi = o.deskripsi_backlog;
    if (o.est_hours !== undefined) o.est_hours = parseFloat(o.est_hours) || 4;
    else if (o.status !== undefined && o.deskripsi !== undefined) o.est_hours = 4;
    // Parts: alias qty_final -> fallback to stock
    if (o.qty_final === undefined && o.stock !== undefined) o.qty_final = o.stock;
    // PlanAlat: alias plan_hours_per_month -> plan_hours
    if (o.plan_hours_per_month !== undefined && o.plan_hours === undefined) o.plan_hours = o.plan_hours_per_month;

    const why = o.five_why || {};
    if (why && typeof why === 'object') {
      o.why1 = why.why1 || why.w1 || '';
      o.why2 = why.why2 || why.w2 || '';
      o.why3 = why.why3 || why.w3 || '';
      o.why4 = why.why4 || why.w4 || '';
      o.why5 = why.why5 || why.w5 || why.root_cause || '';
    }
    const fishbone = o.fishbone || {};
    if (fishbone && typeof fishbone === 'object') {
      o.fb_man = fishbone.fb_man || fishbone.man || '';
      o.fb_machine = fishbone.fb_machine || fishbone.machine || '';
      o.fb_material = fishbone.fb_material || fishbone.material || '';
      o.fb_method = fishbone.fb_method || fishbone.method || '';
      o.fb_environment = fishbone.fb_environment || fishbone.environment || '';
    }
    if (o.lead_investigator !== undefined) o.investigator = o.lead_investigator;
    return o;
  });
}

/**
 * Sinkronkan baris referensi berdasarkan kolom pertama tanpa menghapus data pengguna.
 * Baris lama hanya diisi pada sel kosong. Status MasterEquip lama dinormalisasi.
 */
function syncRowsByKey_(sheet, rows) {
  if (!sheet || !rows || !rows.length) return;

  const lastColumn = Math.max(sheet.getLastColumn(), rows[0].length);
  const values = sheet.getLastRow() > 0
    ? sheet.getRange(1, 1, sheet.getLastRow(), lastColumn).getValues()
    : [];
  const headers = values.length ? values[0].map(String) : [];
  const keyMap = {};

  for (let i = 1; i < values.length; i++) {
    const key = String(values[i][0] || '').trim().toUpperCase();
    if (key && !keyMap[key]) keyMap[key] = i + 1;
  }

  rows.forEach(function(sourceRow) {
    const normalized = sourceRow.slice(0, lastColumn);
    while (normalized.length < lastColumn) normalized.push('');
    const key = String(normalized[0] || '').trim().toUpperCase();
    if (!key) return;

    if (!keyMap[key]) {
      sheet.appendRow(normalized);
      keyMap[key] = sheet.getLastRow();
      return;
    }

    const rowNumber = keyMap[key];
    const current = sheet.getRange(rowNumber, 1, 1, lastColumn).getValues()[0];
    let changed = false;
    for (let column = 1; column < lastColumn; column++) {
      const header = headers[column] || '';
      const isEmpty = current[column] === '' || current[column] === null;
      const invalidEquipStatus = sheet.getName() === 'MasterEquip' &&
        header === 'Status' &&
        ['READY', 'BREAKDOWN'].indexOf(String(current[column] || '').trim().toUpperCase()) === -1;
      if ((isEmpty || invalidEquipStatus) && normalized[column] !== '' && normalized[column] !== null) {
        current[column] = normalized[column];
        changed = true;
      }
    }
    if (changed) sheet.getRange(rowNumber, 1, 1, lastColumn).setValues([current]);
  });
}

function upsertRowByKey_(sheet, row, keyColumn) {
  keyColumn = keyColumn || 1;
  const key = String(row[keyColumn - 1] || '').trim().toUpperCase();
  if (!key) throw new Error('Key data wajib diisi.');

  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const keys = sheet.getRange(2, keyColumn, lastRow - 1, 1).getValues();
    for (let i = 0; i < keys.length; i++) {
      if (String(keys[i][0] || '').trim().toUpperCase() === key) {
        sheet.getRange(i + 2, 1, 1, row.length).setValues([row]);
        return { action: 'updated', row: i + 2 };
      }
    }
  }

  sheet.appendRow(row);
  return { action: 'created', row: sheet.getLastRow() };
}

function normalizeUpper_(value) {
  return String(value === undefined || value === null ? '' : value).trim().toUpperCase();
}

function saveMaster(type, d) {
  try {
    d = d || {};
    const schemas = {
      MasterEquip: {
        headers: ['Equip_No', 'Brand', 'Unit_Type', 'Warranty_Status', 'Model', 'Serial_No', 'Model_Engine', 'Serial_Engine', 'Capacity_Unit', 'Capacity_Attachment', 'Dimension_Unit', 'Dimension_Attachment', 'Rate_Power_Kw', 'Year', 'Status', 'Location'],
        row: function(x) {
          const status = normalizeUpper_(x.status || 'READY');
          if (['READY', 'BREAKDOWN'].indexOf(status) === -1) throw new Error('Status unit harus READY atau BREAKDOWN.');
          return [
            normalizeUpper_(x.equip_no), normalizeUpper_(x.brand), normalizeUpper_(x.unit_type),
            normalizeUpper_(x.warranty_status), normalizeUpper_(x.model), normalizeUpper_(x.serial_no),
            normalizeUpper_(x.model_engine), normalizeUpper_(x.serial_engine), String(x.capacity_unit || '').trim(),
            String(x.capacity_attachment || '').trim(), String(x.dimension_unit || '').trim(),
            String(x.dimension_attachment || '').trim(), String(x.rate_power_kw || '').trim(),
            String(x.year || '').trim(), status, normalizeUpper_(x.location)
          ];
        }
      },
      MasterParts: {
        headers: ['Part_Number', 'Description', 'UOM', 'Stock', 'Min_Stock', 'Price', 'Category_Spare_Part', 'Qty_Final'],
        row: function(x) {
          const stk = Number(x.stock) || 0;
          const qtyFinal = Number(x.qty_final !== undefined ? x.qty_final : stk) || stk;
          return [normalizeUpper_(x.part_number), normalizeUpper_(x.description), normalizeUpper_(x.uom), stk, Number(x.min_stock) || 0, Number(x.price || x.harga || x.harga_satuan) || 0, normalizeUpper_(x.category_spare_part || x.category || ''), qtyFinal];
        }
      },
      Stock: {
        headers: ['Part_Number', 'Description', 'UOM', 'Stock', 'Min_Stock', 'Price', 'Category_Spare_Part', 'Qty_Final'],
        row: function(x) {
          const stk = Number(x.stock) || 0;
          const qtyFinal = Number(x.qty_final !== undefined ? x.qty_final : stk) || stk;
          return [normalizeUpper_(x.part_number), normalizeUpper_(x.description), normalizeUpper_(x.uom), stk, Number(x.min_stock) || 0, Number(x.price || x.harga || x.harga_satuan) || 0, normalizeUpper_(x.category_spare_part || x.category || ''), qtyFinal];
        }
      },
      MasterComponent: {
        headers: ['Major_Component', 'Minor_Component'],
        row: function(x) { return [normalizeUpper_(x.major_component), normalizeUpper_(x.minor_component)]; }
      },
      PlanAlat: {
        headers: ['Equip_No', 'Model', 'Plan_Hours_Per_Month', 'Plan_PA', 'MOHH', 'Category', 'Status'],
        row: function(x) { return [normalizeUpper_(x.equip_no), normalizeUpper_(x.model), Number(x.plan_hours_per_month || x.plan_hours) || 0, Number(x.plan_pa) || 0, Number(x.mohh) || 0, normalizeUpper_(x.category || ''), normalizeUpper_(x.status || 'AKTIF')]; }
      },
      PlanService: {
        headers: ['Equip_No', 'Model', 'Plan_Hours_Per_Month', 'Plan_PA', 'Last_Service_Date', 'Last_Service_HM', 'Next_Service_HM', 'Kategori'],
        row: function(x) { return [normalizeUpper_(x.equip_no), normalizeUpper_(x.model), Number(x.plan_hours_per_month) || 0, Number(x.plan_pa) || 0, x.last_service_date || '', Number(x.last_service_hm) || 0, Number(x.next_service_hm) || 0, normalizeUpper_(x.kategori || 'SERVICE')]; }
      },
      MasterMekanik: {
        headers: ['Nama_Mekanik'],
        row: function(x) { return [String(x.nama_mekanik || '').trim()]; }
      },
      MasterPelapor: {
        headers: ['Nama_Pelapor'],
        row: function(x) { return [String(x.nama_pelapor || '').trim()]; }
      }
    };

    const schema = schemas[type];
    if (!schema) return { success: false, message: 'Jenis master tidak diizinkan.' };

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(type);
    if (!sheet) {
      sheet = ss.insertSheet(type);
      sheet.getRange(1, 1, 1, schema.headers.length).setValues([schema.headers]);
    }

    const row = schema.row(d);
    if (!String(row[0] || '').trim()) return { success: false, message: 'Kolom kunci wajib diisi.' };

    let result;
    if (type === 'MasterComponent') {
      const componentKey = normalizeUpper_(row[0]) + '|' + normalizeUpper_(row[1]);
      const values = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues() : [];
      const duplicate = values.some(function(item) {
        return normalizeUpper_(item[0]) + '|' + normalizeUpper_(item[1]) === componentKey;
      });
      if (duplicate) return { success: true, message: 'Komponen sudah tersedia.', action: 'unchanged' };
      sheet.appendRow(row);
      result = { action: 'created' };
    } else {
      result = upsertRowByKey_(sheet, row, 1);
      // Jika MasterParts atau Stock, sinkronkan juga ke sheet kembarannya
      if (type === 'MasterParts' || type === 'Stock') {
        const otherType = (type === 'MasterParts') ? 'Stock' : 'MasterParts';
        let otherSheet = ss.getSheetByName(otherType);
        if (!otherSheet) {
          otherSheet = ss.insertSheet(otherType);
          otherSheet.getRange(1, 1, 1, schema.headers.length).setValues([schema.headers]);
        }
        upsertRowByKey_(otherSheet, row, 1);
      }
    }

    SpreadsheetApp.flush();
    logSystem('Master_Saved', type + ' ' + String(row[0]) + ' ' + result.action, 'USER');
    return { success: true, message: 'Data ' + type + ' berhasil disimpan.', action: result.action };
  } catch(e) {
    return { success: false, message: e.toString() };
  }
}

// ==========================================
// 7. DAILY HM
// ==========================================
function saveDailyHM(f) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('DailyHM');
    if (!sheet) {
      setupDatabase(false);
      sheet = ss.getSheetByName('DailyHM');
    }
    if (!sheet) return { success: false, message: 'Sheet DailyHM tidak dapat dibuat' };
    
    const eq = String(f.equip_no || "").trim().toUpperCase();
    const tgl = String(f.tanggal || "");
    const safeId = (tgl + "_" + eq).replace(/[\.\#\$\[\]\/]/g, "-");
    
    const hmAwal = parseFloat(f.hm_awal || 0);
    const hmAkhir = parseFloat(f.hm_akhir || 0);
    const tHM = Number((hmAkhir - hmAwal).toFixed(2));
    
    sheet.appendRow([safeId, tgl, eq, hmAwal, hmAkhir, tHM, new Date()]);
    SpreadsheetApp.flush();
    
    return { success: true, id: safeId, total_hm: tHM };
  } catch(e) { 
    logSystem("DailyHM_Error", e.toString());
    return { success: false, message: "Gagal simpan HM: " + e.toString() }; 
  }
}

function deleteDailyHM(id) {
  try {
    if (!id) return { success: false, message: 'ID HM Kosong' };
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('DailyHM');
    if (!sheet) return { success: true };

    const data = sheet.getDataRange().getValues();
    let isDeleted = false;
    const targetId = String(id).trim().toUpperCase();

    for (let i = data.length - 1; i >= 1; i--) {
      let rowId = data[i][0] ? String(data[i][0]).trim().toUpperCase() : "";
      if (rowId !== "" && rowId === targetId) {
        sheet.deleteRow(i + 1);
        isDeleted = true;
      }
    }

    if (isDeleted) {
      SpreadsheetApp.flush();
      logSystem("DailyHM_Deleted", "Data HM dihapus: " + targetId);
    }
    return { success: true, message: isDeleted ? 'Data HM Dihapus' : 'Data tidak ditemukan' };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function generateDailyHMIDs() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('DailyHM');
    if (!sheet) return { success: false, message: "Sheet DailyHM tidak ditemukan" };
    
    const data = sheet.getDataRange().getValues();
    let updated = 0;
    for (let i = 1; i < data.length; i++) {
      if (!data[i][0]) {
        const tgl = data[i][1] instanceof Date ? Utilities.formatDate(data[i][1], Session.getScriptTimeZone(), "yyyy-MM-dd") : String(data[i][1] || "");
        const eq = String(data[i][2] || "").trim().toUpperCase();
        const id = (tgl + "_" + eq).replace(/[\.\#\$\[\]\/]/g, "-");
        sheet.getRange(i + 1, 1).setValue(id);
        updated++;
      }
    }
    if (updated > 0) SpreadsheetApp.flush();
    return { success: true, message: "Berhasil generate " + updated + " ID DailyHM" };
  } catch (e) { return { success: false, message: e.toString() }; }
}

// ==========================================
// 8. WORK ORDERS
// ==========================================
function saveWorkOrder(f) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('WorkOrders');
    if (!sheet) {
      setupDatabase(false);
      sheet = ss.getSheetByName('WorkOrders');
    }
    if (!sheet) return { success: false, message: 'Sheet WorkOrders tidak dapat dibuat' };

    let noWo = f.no_wo ? f.no_wo.trim().toUpperCase() : "";
    if (!noWo) {
      const dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyMMdd");
      const randomChar = Math.random().toString(36).substring(2, 6).toUpperCase();
      noWo = "WO" + dateStr + randomChar;
    }

    // Check if WO already exists (update mode)
    const data = sheet.getDataRange().getValues();
    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === noWo) {
        foundRow = i + 1;
        break;
      }
    }

    const tglInput = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
    let normType = String(f.sch_unsch || "").trim().toUpperCase();
    if (normType === "SCHEDULE" || normType === "SCHEDULED" || normType.indexOf("PM") > -1) {
      normType = "SCH";
    } else if (normType === "UNSCHEDULE" || normType === "UNSCHEDULED" || normType.indexOf("BREAKDOWN") > -1) {
      normType = "UNSCH";
    } else if (!normType) {
      normType = "UNSCH";
    }

    const rowValues = [
      noWo, f.equip_no, f.brand, f.unit_type, f.hm_km,
      tglInput, f.tgl_rusak, "'" + (f.jam_rusak || ""), f.tgl_selesai || "", "'" + (f.jam_selesai || ""),
      f.pelanggan, f.pm_service, f.major_comp, f.minor_comp, normType,
      f.reported_by, f.kendala, f.failure_reason, f.status || 'OPEN', JSON.stringify(f.parts || []), f.tech || "", f.action_log || ""
    ];

    if (foundRow > -1) {
      sheet.getRange(foundRow, 1, 1, rowValues.length).setValues([rowValues]);
      logSystem("WO_Update", "Work Order " + noWo + " diupdate", "USER");
    } else {
      sheet.appendRow(rowValues);
      logSystem("WO_Create", "Work Order " + noWo + " dibuat", "USER");
    }

    SpreadsheetApp.flush();
    return { 
      success: true, 
      generated_no_wo: noWo,
      message: "Work Order Berhasil Disimpan!"
    };
  } catch (e) { return { success: false, message: e.toString() }; }
}

function updateWOStatus(noWo, newStatus, tglSelesai, jamSelesai, actionLog) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WorkOrders');
    if (!sheet) return { success: false, message: 'Sheet WorkOrders tidak ditemukan' };
    
    const data = sheet.getDataRange().getValues();
    const targetWo = String(noWo).trim().toUpperCase();

    let foundRowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === targetWo) {
        foundRowIndex = i + 1;
        break;
      }
    }

    if (foundRowIndex !== -1) {
      sheet.getRange(foundRowIndex, 19).setValue(newStatus);
      if (tglSelesai) sheet.getRange(foundRowIndex, 9).setValue(tglSelesai);
      if (jamSelesai) sheet.getRange(foundRowIndex, 10).setValue("'" + jamSelesai);
      if (actionLog) {
        if (sheet.getLastColumn() < 22) setupDatabase(false);
        sheet.getRange(foundRowIndex, 22).setValue(actionLog);
      }
      SpreadsheetApp.flush();
      logSystem("WO_Status", "Status WO " + targetWo + " menjadi " + newStatus);
      return { success: true, message: "Status WO " + targetWo + " diperbarui ke " + newStatus };
    }
    
    return { success: false, message: 'WO Tidak Ditemukan' };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function deleteWO(noWo) {
  try {
    if (!noWo) return { success: false, message: 'No WO Kosong' };
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WorkOrders');
    if (!sheet) return { success: true };

    const data = sheet.getDataRange().getValues();
    let isDeleted = false;
    const targetWo = String(noWo).trim().toUpperCase();

    for (let i = data.length - 1; i >= 1; i--) {
      let rowWo = data[i][0] ? String(data[i][0]).trim().toUpperCase() : "";
      if (rowWo !== "" && rowWo === targetWo) {
        sheet.deleteRow(i + 1);
        isDeleted = true;
        break;
      }
    }

    if (isDeleted) {
      SpreadsheetApp.flush();
      logSystem("WO_Deleted", "Work Order dihapus: " + targetWo);
    }
    return { success: true, message: isDeleted ? 'Work Order Dihapus' : 'Data tidak ditemukan' };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function migratePartUsageToWorkOrdersSheet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const puSheet = ss.getSheetByName("PartUsage");
    const woSheet = ss.getSheetByName("WorkOrders");
    
    if (!puSheet || !woSheet) {
      return { success: false, message: "Sheet PartUsage atau WorkOrders tidak ditemukan." };
    }
    
    const puData = puSheet.getDataRange().getValues();
    if (puData.length < 2) return { success: false, message: "Sheet PartUsage kosong." };
    
    const woPartsMap = {};
    for (let i = 1; i < puData.length; i++) {
      const row = puData[i];
      const rawNoWo = row[0] ? String(row[0]).trim().toUpperCase() : "";
      if (!rawNoWo) continue;
      
      const noWo = rawNoWo.replace(/[\.\#\$\[\]\/]/g, "-");
      if (!woPartsMap[noWo]) woPartsMap[noWo] = [];
      
      woPartsMap[noWo].push({
        no: row[3] || "",
        desc: row[4] || "",
        qty: parseFloat(row[5]) || 0,
        uom: row[6] || "",
        rem: row[7] || ""
      });
    }
    
    const woData = woSheet.getDataRange().getValues();
    const headers = woData[0];
    const noWoCol = headers.findIndex(h => String(h).toLowerCase() === 'no_wo');
    const partsJsonCol = headers.findIndex(h => String(h).toLowerCase() === 'parts_json');
    
    if (noWoCol === -1 || partsJsonCol === -1) {
      return { success: false, message: "Kolom No_WO atau Parts_JSON tidak ditemukan di sheet WorkOrders." };
    }
    
    const updateValues = [];
    let updatedCount = 0;
    
    for (let i = 1; i < woData.length; i++) {
      const rawWo = String(woData[i][noWoCol]).trim().toUpperCase();
      const currentWo = rawWo.replace(/[\.\#\$\[\]\/]/g, "-");
      
      if (woPartsMap[currentWo]) {
        updateValues.push([JSON.stringify(woPartsMap[currentWo])]);
        updatedCount++;
      } else if (woPartsMap[rawWo]) {
        updateValues.push([JSON.stringify(woPartsMap[rawWo])]);
        updatedCount++;
      } else {
        updateValues.push([woData[i][partsJsonCol]]);
      }
    }
    
    if (updateValues.length > 0) {
      woSheet.getRange(2, partsJsonCol + 1, updateValues.length, 1).setValues(updateValues);
      SpreadsheetApp.flush();
    }
    
    logSystem("Migrate_PartUsage", "Berhasil migrasi data parts untuk " + updatedCount + " WO ke sheet WorkOrders.", "USER");
    return { success: true, message: "Berhasil migrasi data parts untuk " + updatedCount + " Work Orders." };
  } catch (e) {
    logSystem("Migrate_PartUsage_Error", e.toString(), "SYSTEM");
    return { success: false, message: e.toString() };
  }
}

// ==========================================
// 9. BACKLOG & ACTIVITY
// ==========================================
function saveBacklog(f) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Backlog');
    if (!sheet) {
      setupDatabase(false);
      sheet = ss.getSheetByName('Backlog');
    }
    if (!sheet) return { success: false, message: 'Sheet Backlog tidak dapat dibuat' };
    
    let id = f.id ? String(f.id).trim().toUpperCase() : "";
    if (!id) {
      const d = new Date();
      const yy = d.getFullYear().toString().slice(-2);
      const mm = ('0' + (d.getMonth() + 1)).slice(-2);
      id = "BL" + yy + mm + Math.random().toString(36).substring(2, 6).toUpperCase();
    }
    
    const data = sheet.getDataRange().getValues();
    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === id) {
        foundRow = i + 1;
        break;
      }
    }
    
    const estHours = parseFloat(f.est_hours) || 4;
    if (foundRow > -1) {
      sheet.getRange(foundRow, 2).setValue(f.tanggal);
      sheet.getRange(foundRow, 3).setValue(f.equip_no.toUpperCase());
      sheet.getRange(foundRow, 4).setValue(f.deskripsi);
      sheet.getRange(foundRow, 5).setValue(f.status || 'OPEN');
      sheet.getRange(foundRow, 6).setValue(f.rencana);
      if (sheet.getLastColumn() >= 7) {
        sheet.getRange(foundRow, 7).setValue(estHours);
      }
    } else {
      sheet.appendRow([id, f.tanggal, f.equip_no.toUpperCase(), f.deskripsi, f.status || 'OPEN', f.rencana, estHours]);
    }
    
    SpreadsheetApp.flush();
    return { success: true, id: id, message: 'Backlog Berhasil Disimpan!' };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function updateBacklogStatus(id, st) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Backlog');
    if (!sheet) return { success: false, message: 'Sheet Backlog tidak ditemukan' };
    
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) { 
        sheet.getRange(i + 1, 5).setValue(st); 
        SpreadsheetApp.flush();
        logSystem("Backlog_Status", "Status Backlog " + id + " diubah ke " + st);
        return { success: true, message: 'Status Diperbarui' }; 
      }
    }
    return { success: false, message: 'Backlog tidak ditemukan' };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function deleteBacklog(id) {
  try {
    if (!id) return { success: false, message: 'ID Backlog kosong' };
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Backlog');
    if (!sheet) return { success: true };

    const data = sheet.getDataRange().getValues();
    let isDeleted = false;
    const targetId = String(id).trim().toUpperCase();

    for (let i = data.length - 1; i >= 1; i--) {
      let rowId = data[i][0] ? String(data[i][0]).trim().toUpperCase() : "";
      if (rowId !== "" && rowId === targetId) { 
        sheet.deleteRow(i + 1); 
        isDeleted = true;
        break;
      }
    }
    
    if (isDeleted) {
      SpreadsheetApp.flush();
      logSystem("Backlog_Deleted", "Backlog dihapus: " + targetId);
    }
    return { success: true, message: isDeleted ? 'Backlog Dihapus' : 'Data tidak ditemukan' };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function generateBacklogIDs() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Backlog');
    if (!sheet) return { success: false, message: "Sheet Backlog tidak ditemukan" };
    
    const data = sheet.getDataRange().getValues();
    let updated = 0;
    for (let i = 1; i < data.length; i++) {
      if (!data[i][0]) {
        const id = "BL" + Math.random().toString(36).substring(2, 8).toUpperCase();
        sheet.getRange(i + 1, 1).setValue(id);
        updated++;
      }
    }
    if (updated > 0) SpreadsheetApp.flush();
    return { success: true, message: "Berhasil generate " + updated + " ID Backlog" };
  } catch (e) { return { success: false, message: e.toString() }; }
}

function saveActivityLog(f) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('MechanicActivity');
    if (!sheet) {
      setupDatabase(false);
      sheet = ss.getSheetByName('MechanicActivity');
    }
    if (!sheet) return { success: false, message: 'Sheet MechanicActivity tidak dapat dibuat' };
    
    sheet.getRange("F:G").setNumberFormat('@');
    const timestamp = new Date().getTime().toString().slice(-5) + Math.floor(Math.random() * 1000);
    
    let mechanics = [];
    if (f.mekanik && Array.isArray(f.mekanik)) { mechanics = f.mekanik.map(m => String(m).trim()); } 
    else if (f.mekanik) { mechanics = String(f.mekanik).split(',').map(m => m.trim()); } 
    else { mechanics = ["-"]; }

    let jMulai = f.jam_mulai ? String(f.jam_mulai).trim() : "00:00";
    let jSelesai = f.jam_selesai ? String(f.jam_selesai).trim() : "00:00";

    mechanics.forEach((mekanikName, index) => {
      const id = "ACT" + timestamp + index.toString();
      sheet.appendRow([id, f.tanggal, f.no_wo || "", mekanikName, f.aktifitas, jMulai, jSelesai]);
      const lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 6, 1, 2).setNumberFormat('@').setValues([[jMulai, jSelesai]]);
    });
    
    SpreadsheetApp.flush();
    return { success: true, message: 'Aktifitas Team Disimpan!' };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function deleteActivity(id) {
  try {
    if (!id) return { success: false, message: 'ID Aktifitas kosong' };
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('MechanicActivity');
    if (!sheet) return { success: true };

    const data = sheet.getDataRange().getValues();
    let isDeleted = false;
    const targetId = String(id).trim().toUpperCase();
    
    for (let i = data.length - 1; i >= 1; i--) {
      let rowId = data[i][0] ? String(data[i][0]).trim().toUpperCase() : "";
      if (rowId !== "" && rowId === targetId) { 
        sheet.deleteRow(i + 1); 
        isDeleted = true;
        break; 
      }
    }
    if (isDeleted) SpreadsheetApp.flush(); 
    return { success: true, message: isDeleted ? 'Aktifitas Dihapus' : 'Data tidak ditemukan' }; 
  } catch(e) { return { success: false, message: e.toString() }; }
}

function generateActivityIDs() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('MechanicActivity');
    if (!sheet) return { success: false, message: "Sheet MechanicActivity tidak ditemukan" };
    
    const data = sheet.getDataRange().getValues();
    let updated = 0;
    for (let i = 1; i < data.length; i++) {
      if (!data[i][0]) {
        const id = "ACT" + Math.random().toString(36).substring(2, 8).toUpperCase();
        sheet.getRange(i + 1, 1).setValue(id);
        updated++;
      }
    }
    if (updated > 0) SpreadsheetApp.flush();
    return { success: true, message: "Berhasil generate " + updated + " ID Aktivitas" };
  } catch (e) { return { success: false, message: e.toString() }; }
}

// ==========================================
// 10. SERVICE HISTORY & PLAN
// ==========================================
function saveServiceHistory(f) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let svcSheet = ss.getSheetByName('ServiceHistory');
    if (!svcSheet) {
      setupDatabase(false);
      svcSheet = ss.getSheetByName('ServiceHistory');
    }
    if (!svcSheet) return { success: false, message: 'Sheet ServiceHistory tidak dapat dibuat' };
    
    const timestamp = new Date().getTime().toString().slice(-6);
    const id = "SVC" + timestamp;
    const equipNo = String(f.equip_no || "").trim().toUpperCase();
    const actualHM = parseFloat(f.actual_hm || 0);
    const nextServiceHM = actualHM + 250;
    
    svcSheet.appendRow([id, equipNo, f.plan_hm || 0, f.plan_date || "", actualHM, f.actual_date || "", new Date()]);
    
    // Update PlanService & PlanAlat sheet
    let planSvcSheet = ss.getSheetByName('PlanService');
    if (planSvcSheet) {
      const data = planSvcSheet.getDataRange().getValues();
      let found = false;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim().toUpperCase() === equipNo) {
          planSvcSheet.getRange(i + 1, 5).setValue(f.actual_date || "");
          planSvcSheet.getRange(i + 1, 6).setValue(actualHM);
          planSvcSheet.getRange(i + 1, 7).setValue(nextServiceHM);
          found = true;
          break;
        }
      }
      if (!found) {
        planSvcSheet.appendRow([equipNo, f.model || "", 720, 85, f.actual_date || "", actualHM, nextServiceHM, 'SERVICE']);
      }
    }

    // Service fields belong to PlanService. PlanAlat column 5 is MOHH and must not be overwritten.
    
    SpreadsheetApp.flush();
    logSystem("Service_Input", "Service diinput untuk " + equipNo + ". Actual HM: " + actualHM, "USER");
    return { 
      success: true, 
      id: id,
      next_service_hm: nextServiceHM,
      message: 'Data Service Tersimpan & Plan Alat Terupdate!' 
    };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function deleteServiceHistory(id) {
  try {
    if (!id) return { success: false, message: 'ID Service Kosong' };
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ServiceHistory');
    if (!sheet) return { success: true };

    const data = sheet.getDataRange().getValues();
    let isDeleted = false;
    const targetId = String(id).trim().toUpperCase();

    for (let i = data.length - 1; i >= 1; i--) {
      let rowId = data[i][0] ? String(data[i][0]).trim().toUpperCase() : "";
      if (rowId !== "" && rowId === targetId) {
        sheet.deleteRow(i + 1);
        isDeleted = true;
      }
    }

    if (isDeleted) {
      SpreadsheetApp.flush();
      logSystem("Service_Deleted", "History Service dihapus: " + targetId);
    }
    return { success: true, message: isDeleted ? 'History Service Dihapus' : 'Data tidak ditemukan' };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function generateServiceHistoryIDs() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('ServiceHistory');
    if (!sheet) return { success: false, message: "Sheet ServiceHistory tidak ditemukan" };
    
    const data = sheet.getDataRange().getValues();
    let updated = 0;
    for (let i = 1; i < data.length; i++) {
      if (!data[i][0]) {
        const id = "SVC" + Math.random().toString(36).substring(2, 8).toUpperCase();
        sheet.getRange(i + 1, 1).setValue(id);
        updated++;
      }
    }
    if (updated > 0) SpreadsheetApp.flush();
    return { success: true, message: "Berhasil generate " + updated + " ID Service History" };
  } catch (e) { return { success: false, message: e.toString() }; }
}

function deleteRowsByFirstColumn_(sheet, key) {
  if (!sheet || !key || sheet.getLastRow() <= 1) return 0;
  const target = String(key).trim().toUpperCase();
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  let deleted = 0;
  for (let i = values.length - 1; i >= 0; i--) {
    if (String(values[i][0] || '').trim().toUpperCase() === target) {
      sheet.deleteRow(i + 2);
      deleted++;
    }
  }
  return deleted;
}

function deleteMasterEquip(equipNo) {
  try {
    const target = String(equipNo || '').trim().toUpperCase();
    if (!target) return { success: false, message: 'Equip No kosong.' };

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('MasterEquip');
    const deleted = deleteRowsByFirstColumn_(sheet, target);
    if (deleted) {
      SpreadsheetApp.flush();
      logSystem('MasterEquip_Deleted', 'Master equipment dihapus tanpa menghapus plan: ' + target, 'USER');
    }
    return { success: true, message: deleted ? 'Master equipment berhasil dihapus.' : 'Equipment tidak ditemukan.', deleted: deleted };
  } catch(e) {
    return { success: false, message: e.toString() };
  }
}

function deletePlan(equipNo, type) {
  try {
    const target = String(equipNo || '').trim().toUpperCase();
    const sheetName = String(type || '').trim();
    if (!target) return { success: false, message: 'Equip No kosong.' };
    if (['PlanAlat', 'PlanService'].indexOf(sheetName) === -1) {
      return { success: false, message: 'Tipe plan harus PlanAlat atau PlanService.' };
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    const deleted = deleteRowsByFirstColumn_(sheet, target);
    if (deleted) {
      SpreadsheetApp.flush();
      logSystem('Plan_Deleted', sheetName + ' dihapus: ' + target, 'USER');
    }
    return { success: true, message: deleted ? sheetName + ' berhasil dihapus.' : 'Data tidak ditemukan.', deleted: deleted };
  } catch(e) {
    return { success: false, message: e.toString() };
  }
}

function parseSheetDate(dStr) {
  if (!dStr) return "";
  if (dStr instanceof Date) return Utilities.formatDate(dStr, Session.getScriptTimeZone(), "yyyy-MM-dd");
  
  const s = String(dStr).trim();
  if (!s) return "";

  let parts = s.split('/');
  if (parts.length === 3) {
    let day = parts[0].padStart(2, '0');
    let month = parts[1].padStart(2, '0');
    let year = parts[2];
    if (year.length === 2) year = "20" + year;
    return year + "-" + month + "-" + day;
  }
  
  if (s.includes('-')) return s.split('T')[0];
  return s;
}

// ==========================================
// 11. INSPECTION
// ==========================================
function saveInspection(f) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Inspection');
    if (!sheet) {
      setupDatabase(false);
      sheet = ss.getSheetByName('Inspection');
    }
    if (!sheet) return { success: false, message: 'Sheet Inspection tidak dapat dibuat' };

    let id = f.id || "";
    if (!id) {
      id = "INSP-" + new Date().getTime().toString().slice(-6) + Math.floor(Math.random() * 1000);
    }
    sheet.appendRow([
      id, f.tanggal, f.equip_no, f.tipe_alat, f.checklist_json || JSON.stringify(f.checklist || []), f.inspector, new Date()
    ]);
    SpreadsheetApp.flush();
    return { success: true, generated_id: id, message: "Inspeksi berhasil disimpan!" };
  } catch (e) { return { success: false, message: e.toString() }; }
}

function deleteInspection(id) {
  try {
    if (!id) return { success: false, message: 'ID Kosong' };
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Inspection');
    if (!sheet) return { success: true };
    
    const data = sheet.getDataRange().getValues();
    let isDeleted = false;
    const targetId = String(id).trim().toUpperCase();
    for (let i = data.length - 1; i >= 1; i--) {
      let rowId = data[i][0] ? String(data[i][0]).trim().toUpperCase() : "";
      if (rowId !== "" && rowId === targetId) {
        sheet.deleteRow(i + 1);
        isDeleted = true;
      }
    }
    if (isDeleted) {
      SpreadsheetApp.flush();
      logSystem("Inspection_Deleted", "Inspection dihapus: " + targetId);
    }
    return { success: true, message: isDeleted ? 'Inspection Dihapus' : 'Data tidak ditemukan' };
  } catch (e) { return { success: false, message: e.toString() }; }
}

// ==========================================
// 12. SYSTEM LOGS
// ==========================================
function getSystemLogs() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('SystemLogs');
    if (!sheet) return { success: true, payload: "[]" };
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, payload: "[]" };
    
    const lastLogs = data.slice(1).reverse().slice(0, 200);
    const headers = data[0];
    const cleaned = lastLogs.map(r => {
      let o = {};
      headers.forEach((h, i) => {
        let val = r[i];
        if (val instanceof Date) val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
        o[String(h).toLowerCase()] = val;
      });
      return o;
    });
    
    return { success: true, payload: JSON.stringify(cleaned) };
  } catch (e) { return { success: false, message: e.toString() }; }
}

// ==========================================
// 13. PLAN COMPONENT REPLACEMENT (PCR)
// ==========================================
function savePCR(f) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('PCR_Components');
    if (!sheet) { setupDatabase(false); sheet = ss.getSheetByName('PCR_Components'); }
    
    let id = f.pcr_id || f.id || ("PCR-" + new Date().getTime().toString().slice(-6));
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
        rowIndex = i + 1;
        break;
      }
    }
    
    const targetLifetime = parseFloat(f.target_lifetime_hm) || 0;
    const currentHM = parseFloat(f.current_hm) || 0;
    const remainingHM = targetLifetime - currentHM;
    let status = f.status || "AMAN";
    if (!f.status) {
      if (remainingHM <= 500) status = "CRITICAL";
      else if (remainingHM <= 2000) status = "WARNING";
      else status = "AMAN";
    }

    const rowData = [
      id, f.equip_no, f.component_name, targetLifetime, currentHM, remainingHM, status,
      parseFloat(f.est_cost !== undefined ? f.est_cost : f.estimated_cost) || 0,
      f.scheduled_date || ""
    ];

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    SpreadsheetApp.flush();
    logSystem("PCR_Saved", "PCR " + id + " (" + f.equip_no + " - " + f.component_name + ") disimpan", "USER");
    return { success: true, generated_id: id, message: "Data Plan Component berhasil disimpan!" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function deletePCR(id) {
  try {
    if (!id) return { success: false, message: "ID Kosong" };
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PCR_Components');
    if (!sheet) return { success: true };
    const data = sheet.getDataRange().getValues();
    let isDeleted = false;
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
        sheet.deleteRow(i + 1);
        isDeleted = true;
      }
    }
    if (isDeleted) {
      SpreadsheetApp.flush();
      logSystem("PCR_Deleted", "PCR " + id + " dihapus", "USER");
    }
    return { success: true, message: isDeleted ? "Data PCR Dihapus" : "Data tidak ditemukan" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

// ==========================================
// 14. PREVENTIVE MAINTENANCE (PM RECORDS)
// ==========================================
function savePMRecord(f) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('PM_Records');
    if (!sheet) { setupDatabase(false); sheet = ss.getSheetByName('PM_Records'); }
    
    let id = f.pm_id || f.id || ("PM-" + new Date().getTime().toString().slice(-6));
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
        rowIndex = i + 1;
        break;
      }
    }

    const rowData = [
      id, f.tanggal || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd"),
      f.equip_no, f.pm_type || "PM 250H",
      f.washing_check || "PASS", f.greasing_check || "PASS", f.inspection_check || "PASS",
      f.torque_check || "PASS", f.battery_check || "PASS",
      f.mechanic || "", f.notes || "", parseFloat(f.hm_pm) || 0, f.status || "COMPLETED"
    ];

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    SpreadsheetApp.flush();
    logSystem("PM_Saved", "PM Record " + id + " (" + f.equip_no + ") disimpan", "USER");
    return { success: true, generated_id: id, message: "Record Preventive Maintenance berhasil disimpan!" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function deletePMRecord(id) {
  try {
    if (!id) return { success: false, message: "ID Kosong" };
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PM_Records');
    if (!sheet) return { success: true };
    const data = sheet.getDataRange().getValues();
    let isDeleted = false;
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
        sheet.deleteRow(i + 1);
        isDeleted = true;
      }
    }
    if (isDeleted) SpreadsheetApp.flush();
    return { success: true, message: isDeleted ? "Record PM Dihapus" : "Data tidak ditemukan" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

// ==========================================
// 15. MONTHLY BUDGET
// ==========================================
function saveMonthlyBudget(f) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Monthly_Budget');
    if (!sheet) { setupDatabase(false); sheet = ss.getSheetByName('Monthly_Budget'); }

    let id = f.budget_id || f.id || ("BDG-" + new Date().getTime().toString().slice(-4));
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
        rowIndex = i + 1;
        break;
      }
    }

    const budgetPlan = parseFloat(f.plan_amount !== undefined ? f.plan_amount : f.budget_plan) || 0;
    const actualSpent = parseFloat(f.actual_amount !== undefined ? f.actual_amount : f.actual_spent) || 0;
    const variance = budgetPlan - actualSpent;
    let status = variance >= 0 ? "UNDER BUDGET" : "OVER BUDGET";

    const rowData = [
      id, f.period_month || f.month_year || "", f.category, budgetPlan, actualSpent, variance, status, f.notes || ""
    ];

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    SpreadsheetApp.flush();
    return { success: true, generated_id: id, message: "Budget bulanan berhasil disimpan!" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function deleteMonthlyBudget(id) {
  try {
    if (!id) return { success: false, message: "ID Kosong" };
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Monthly_Budget');
    if (!sheet) return { success: true };
    const data = sheet.getDataRange().getValues();
    let isDeleted = false;
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
        sheet.deleteRow(i + 1);
        isDeleted = true;
      }
    }
    if (isDeleted) SpreadsheetApp.flush();
    return { success: true, message: isDeleted ? "Budget Dihapus" : "Data tidak ditemukan" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

// ==========================================
// 16. EQUIPMENT ACTUAL COST & PRODUCTIVITY
// ==========================================
function ensureTransactionSheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  return sheet;
}

function validateIsoDate_(value, label) {
  const text = String(value || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error((label || 'Tanggal') + ' wajib berformat YYYY-MM-DD.');
  const parts = text.split('-').map(Number);
  const parsed = new Date(parts[0], parts[1] - 1, parts[2]);
  if (parsed.getFullYear() !== parts[0] || parsed.getMonth() !== parts[1] - 1 || parsed.getDate() !== parts[2]) {
    throw new Error((label || 'Tanggal') + ' tidak valid.');
  }
  return text;
}

function requireKnownEquipment_(equipNo) {
  const equip = normalizeUpper_(equipNo);
  if (!equip) throw new Error('Equipment wajib dipilih.');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('MasterEquip');
  if (!sheet || sheet.getLastRow() <= 1) throw new Error('Master equipment belum tersedia.');
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  const exists = values.some(function(row) { return normalizeUpper_(row[0]) === equip; });
  if (!exists) throw new Error('Equipment ' + equip + ' tidak ditemukan pada Master Equipment.');
  return equip;
}

function createTransactionId_(prefix) {
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMddHHmmss');
  return prefix + '-' + stamp + '-' + Math.floor(100 + Math.random() * 900);
}

function saveEquipmentCost(f) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    f = f || {};
    const headers = [
      'ID', 'Transaction_Date', 'Equip_No', 'Category', 'Amount', 'Reference_No',
      'WO_No', 'Vendor', 'Description', 'Evidence_URL', 'Created_By', 'Timestamp'
    ];
    const sheet = ensureTransactionSheet_('Equipment_Cost', headers);
    const id = normalizeUpper_(f.cost_id || f.id) || createTransactionId_('CST');
    const transactionDate = validateIsoDate_(f.transaction_date || f.tanggal, 'Tanggal transaksi');
    const equip = requireKnownEquipment_(f.equip_no);
    const category = normalizeUpper_(f.category);
    const allowedCategories = [
      'SPAREPART & FAST MOVING', 'PELUMAS, OLI & GREASE', 'TYRE & UNDERCARRIAGE',
      'MAJOR COMPONENT OVERHAUL', 'JASA SUBCON & BENGKEL LUAR',
      'SPECIAL TOOLS & WORKSHOP', 'BATTERY & ELECTRICAL', 'LAINNYA'
    ];
    if (allowedCategories.indexOf(category) === -1) throw new Error('Kategori biaya tidak valid.');
    const amount = Number(f.amount !== undefined ? f.amount : f.actual_amount);
    if (!isFinite(amount) || amount <= 0) throw new Error('Nilai actual cost harus lebih besar dari 0.');

    const referenceNo = normalizeUpper_(f.reference_no || f.reference);
    const existing = sheet.getDataRange().getValues();
    if (referenceNo) {
      const duplicate = existing.slice(1).some(function(row) {
        return normalizeUpper_(row[0]) !== id && normalizeUpper_(row[5]) === referenceNo && normalizeUpper_(row[2]) === equip;
      });
      if (duplicate) throw new Error('Nomor referensi tersebut sudah digunakan untuk equipment ' + equip + '.');
    }

    const row = [
      id, transactionDate, equip, category, amount, referenceNo,
      normalizeUpper_(f.wo_no), String(f.vendor || '').trim(), String(f.description || f.notes || '').trim(),
      String(f.evidence_url || '').trim(), String(f.created_by || '').trim(), new Date()
    ];
    const result = upsertRowByKey_(sheet, row, 1);
    SpreadsheetApp.flush();
    logSystem('EquipmentCost_Saved', id + ' ' + equip + ' Rp ' + amount + ' ' + result.action, f.created_by || 'USER');
    return { success: true, generated_id: id, record: cleanData([headers, row])[0], message: 'Actual cost equipment berhasil disimpan.' };
  } catch (e) {
    return { success: false, message: e.message || e.toString() };
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function deleteEquipmentCost(id) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const key = normalizeUpper_(id);
    if (!key) return { success: false, message: 'ID actual cost wajib diisi.' };
    const deleted = deleteRowsByFirstColumn_(SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Equipment_Cost'), key);
    if (deleted) SpreadsheetApp.flush();
    return { success: true, deleted: deleted, message: deleted ? 'Actual cost berhasil dihapus.' : 'Data actual cost tidak ditemukan.' };
  } catch (e) {
    return { success: false, message: e.message || e.toString() };
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

/**
 * Hapus sheet legacy 'Equipment_Productivity' dari Google Spreadsheet.
 * Mengeliminasi data ritase/BCM tambang dari spreadsheet Maintenance Management.
 */
function deleteLegacyProductivitySheet() {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Equipment_Productivity');
    if (sheet) {
      ss.deleteSheet(sheet);
      SpreadsheetApp.flush();
      logSystem('DeleteSheet', "Sheet legacy 'Equipment_Productivity' berhasil dihapus dari Google Spreadsheet.", 'ADMIN');
      return { success: true, message: "Sheet 'Equipment_Productivity' berhasil dihapus dari Google Sheets." };
    }
    return { success: true, message: "Sheet 'Equipment_Productivity' memang sudah tidak ada di Google Sheets." };
  } catch (e) {
    return { success: false, message: e.message || e.toString() };
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

// ==========================================
// 17. FAILURE ANALYSIS REPORT (FAR)
// ==========================================
function saveFAR(f) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Failure_Analysis');
    if (!sheet) { setupDatabase(false); sheet = ss.getSheetByName('Failure_Analysis'); }

    let id = f.far_no || f.id || ("FAR-" + new Date().getFullYear() + "-" + new Date().getTime().toString().slice(-4));
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
        rowIndex = i + 1;
        break;
      }
    }

    let fiveWhy = f.five_why;
    if (!fiveWhy && f.five_why_json) {
      try { fiveWhy = JSON.parse(f.five_why_json); } catch(e) { fiveWhy = {}; }
    }
    if (!fiveWhy || typeof fiveWhy !== 'object') {
      fiveWhy = { w1: f.why1 || "", w2: f.why2 || "", w3: f.why3 || "", w4: f.why4 || "", root_cause: f.why5 || "" };
    }
    let fishbone = f.fishbone;
    if (!fishbone && f.fishbone_json) {
      try { fishbone = JSON.parse(f.fishbone_json); } catch(e) { fishbone = {}; }
    }
    if (!fishbone || typeof fishbone !== 'object') {
      fishbone = { man: f.fb_man || "", machine: f.fb_machine || "", material: f.fb_material || "", method: f.fb_method || "", environment: f.fb_environment || "" };
    }
    const fiveWhyStr = JSON.stringify(fiveWhy);
    const fishboneStr = JSON.stringify(fishbone);

    const rowData = [
      id, f.tanggal || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd"),
      f.equip_no, f.component_name, f.chronology || "",
      fiveWhyStr, fishboneStr, f.corrective_action || "", f.preventive_action || "",
      f.status || "INVESTIGATION", f.lead_investigator || f.investigator || ""
    ];

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    SpreadsheetApp.flush();
    logSystem("FAR_Saved", "Failure Analysis " + id + " (" + f.equip_no + ") disimpan", "USER");
    return { success: true, generated_id: id, message: "Laporan Failure Analysis berhasil disimpan!" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function deleteFAR(id) {
  try {
    if (!id) return { success: false, message: "ID Kosong" };
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Failure_Analysis');
    if (!sheet) return { success: true };
    const data = sheet.getDataRange().getValues();
    let isDeleted = false;
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
        sheet.deleteRow(i + 1);
        isDeleted = true;
      }
    }
    if (isDeleted) SpreadsheetApp.flush();
    return { success: true, message: isDeleted ? "FAR Dihapus" : "Data tidak ditemukan" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

// ==========================================
// 17. SWAB COMPONENT (KANIBALISASI)
// ==========================================
function saveSwabComponent(f) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Swab_Components');
    if (!sheet) { setupDatabase(false); sheet = ss.getSheetByName('Swab_Components'); }

    let id = f.swab_id || f.id || ("SWAB-" + new Date().getTime().toString().slice(-4));
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
        rowIndex = i + 1;
        break;
      }
    }

    const donorUnit = f.donor_equip || f.donor_unit || "";
    const targetUnit = f.target_equip || f.target_unit || "";
    const rowData = [
      id, f.tanggal || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd"),
      donorUnit, targetUnit, f.component_name, f.notes || f.reason || "",
      f.authorized_by || "", f.mechanic || "", f.status || "ACTIVE (PINJAM)",
      f.target_restore_date || f.restoration_date || "-"
    ];

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    SpreadsheetApp.flush();
    logSystem("Swab_Saved", "Swab Component " + id + " (" + donorUnit + " ke " + targetUnit + ") disimpan", "USER");
    return { success: true, generated_id: id, message: "Data Swab Component berhasil disimpan!" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function updateSwabStatus(id, status, restorationDate) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Swab_Components');
    if (!sheet) return { success: false, message: "Sheet tidak ditemukan" };
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
        sheet.getRange(i + 1, 9).setValue(status);
        if (restorationDate) sheet.getRange(i + 1, 10).setValue(restorationDate);
        SpreadsheetApp.flush();
        return { success: true, message: "Status Swab berhasil diperbarui!" };
      }
    }
    return { success: false, message: "Data tidak ditemukan" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function deleteSwabComponent(id) {
  try {
    if (!id) return { success: false, message: "ID Kosong" };
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Swab_Components');
    if (!sheet) return { success: true };
    const data = sheet.getDataRange().getValues();
    let isDeleted = false;
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
        sheet.deleteRow(i + 1);
        isDeleted = true;
      }
    }
    if (isDeleted) SpreadsheetApp.flush();
    return { success: true, message: isDeleted ? "Swab Dihapus" : "Data tidak ditemukan" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

// ==========================================
// 18. NOTULEN RAPAT & ACTION TRACKER
// ==========================================
function saveMeetingNotes(f) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Meeting_Notes');
    if (!sheet) { setupDatabase(false); sheet = ss.getSheetByName('Meeting_Notes'); }

    let id = f.meeting_id || f.id || ("NOTULEN-" + new Date().getTime().toString().slice(-4));
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
        rowIndex = i + 1;
        break;
      }
    }

    let actionItemsStr = "[]";
    if (typeof f.action_items === 'object') actionItemsStr = JSON.stringify(f.action_items);
    else if (typeof f.action_items === 'string' && f.action_items.trim()) actionItemsStr = f.action_items;
    else if (f.action_items_json) actionItemsStr = f.action_items_json;

    const rowData = [
      id, f.tanggal || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd"),
      f.topic, f.leader || "", f.participants || f.attendees || "", f.summary || f.discussion_summary || "",
      actionItemsStr, f.status || "ACTIVE", f.plant_health || "", f.critical_issue || "",
      f.operational_impact || "", f.management_decision || ""
    ];

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    SpreadsheetApp.flush();
    return { success: true, generated_id: id, message: "Notulen rapat berhasil disimpan!" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function deleteMeetingNotes(id) {
  try {
    if (!id) return { success: false, message: "ID Kosong" };
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Meeting_Notes');
    if (!sheet) return { success: true };
    const data = sheet.getDataRange().getValues();
    let isDeleted = false;
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
        sheet.deleteRow(i + 1);
        isDeleted = true;
      }
    }
    if (isDeleted) SpreadsheetApp.flush();
    return { success: true, message: isDeleted ? "Notulen Dihapus" : "Data tidak ditemukan" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

// ==========================================
// 19. MASTER TOOLS & WORKSHOP
// ==========================================
function saveMasterTool(f) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Master_Tools');
    if (!sheet) { setupDatabase(false); sheet = ss.getSheetByName('Master_Tools'); }

    let toolId = f.tool_id || ("TL-" + new Date().getTime().toString().slice(-4));
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === String(toolId).trim().toUpperCase()) {
        rowIndex = i + 1;
        break;
      }
    }

    const rowData = [
      toolId, f.tool_name, f.category || "SPECIAL TOOL", f.brand_spec || "",
      parseInt(f.qty !== undefined ? f.qty : f.quantity, 10) || 1, f.condition || "GOOD", f.location || "WORKSHOP",
      f.borrower || "-", f.status || "AVAILABLE"
    ];

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    SpreadsheetApp.flush();
    return { success: true, tool_id: toolId, message: "Data tool berhasil disimpan!" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function updateToolBorrowStatus(toolId, status, borrower) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Master_Tools');
    if (!sheet) return { success: false, message: "Sheet tidak ditemukan" };
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === String(toolId).trim().toUpperCase()) {
        sheet.getRange(i + 1, 8).setValue(borrower || "-");
        sheet.getRange(i + 1, 9).setValue(status);
        SpreadsheetApp.flush();
        return { success: true, message: "Status peminjaman tool diperbarui!" };
      }
    }
    return { success: false, message: "Data tool tidak ditemukan" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function deleteMasterTool(toolId) {
  try {
    if (!toolId) return { success: false, message: "Tool ID Kosong" };
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Master_Tools');
    if (!sheet) return { success: true };
    const data = sheet.getDataRange().getValues();
    let isDeleted = false;
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).trim().toUpperCase() === String(toolId).trim().toUpperCase()) {
        sheet.deleteRow(i + 1);
        isDeleted = true;
      }
    }
    if (isDeleted) SpreadsheetApp.flush();
    return { success: true, message: isDeleted ? "Tool Dihapus" : "Data tidak ditemukan" };
  } catch(e) { return { success: false, message: e.toString() }; }
}

function deleteStock(partNumber) {
  try {
    const target = String(partNumber || '').trim().toUpperCase();
    if (!target) return { success: false, message: 'Part number kosong.' };
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let totalDeleted = 0;
    ['Stock', 'MasterParts'].forEach(function(sheetName) {
      const sheet = ss.getSheetByName(sheetName);
      if (sheet) {
        totalDeleted += deleteRowsByFirstColumn_(sheet, target);
      }
    });
    if (totalDeleted > 0) {
      SpreadsheetApp.flush();
      logSystem('Stock_Deleted', 'Part ' + target + ' dihapus dari Stock/MasterParts (' + totalDeleted + ' baris).', 'USER');
    }
    return { success: true, message: totalDeleted > 0 ? 'Part ' + target + ' berhasil dihapus.' : 'Part tidak ditemukan.', deleted: totalDeleted };
  } catch(e) {
    return { success: false, message: e.toString() };
  }
}

function deleteMasterComponent(componentId) {
  try {
    const target = String(componentId || '').trim().toUpperCase();
    if (!target) return { success: false, message: 'Component ID kosong.' };
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('MasterComponent');
    let totalDeleted = 0;
    if (sheet) {
      totalDeleted = deleteRowsByFirstColumn_(sheet, target);
    }
    if (totalDeleted > 0) {
      SpreadsheetApp.flush();
      logSystem('Component_Deleted', 'Komponen ' + target + ' dihapus dari MasterComponent.', 'USER');
    }
    return { success: true, message: totalDeleted > 0 ? 'Komponen ' + target + ' berhasil dihapus.' : 'Komponen tidak ditemukan.', deleted: totalDeleted };
  } catch(e) {
    return { success: false, message: e.toString() };
  }
}

// ==========================================
// 21. MASTER MEKANIK & PELAPOR
// ==========================================
function saveMekanik(f) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('MasterMekanik');
    if (!sheet) {
      sheet = ss.insertSheet('MasterMekanik');
      sheet.getRange(1, 1, 1, 2).setValues([['Nama_Mekanik', 'Status']]);
    }
    const nama = String(f.nama_mekanik || "").trim().toUpperCase();
    if (!nama) return { success: false, message: "Nama Mekanik Kosong" };
    const status = f.status || "AVAILABLE";

    const data = sheet.getDataRange().getValues();
    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === nama) {
        foundRow = i + 1;
        break;
      }
    }

    if (foundRow > 0) {
      sheet.getRange(foundRow, 2).setValue(status);
    } else {
      sheet.appendRow([nama, status]);
    }
    SpreadsheetApp.flush();
    return { success: true, message: `Mekanik ${nama} berhasil disimpan!` };
  } catch (e) { return { success: false, message: e.toString() }; }
}

function deleteMekanik(targetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('MasterMekanik');
    if (!sheet) return { success: true };
    const data = sheet.getDataRange().getValues();
    let isDeleted = false;
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).trim().toUpperCase() === String(targetId).trim().toUpperCase()) {
        sheet.deleteRow(i + 1);
        isDeleted = true;
        break;
      }
    }
    if (isDeleted) SpreadsheetApp.flush();
    return { success: true, message: isDeleted ? "Mekanik dihapus" : "Mekanik tidak ditemukan" };
  } catch (e) { return { success: false, message: e.toString() }; }
}

function savePelapor(f) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('MasterPelapor');
    if (!sheet) {
      sheet = ss.insertSheet('MasterPelapor');
      sheet.getRange(1, 1, 1, 2).setValues([['Nama_Pelapor', 'Posisi']]);
    }
    const nama = String(f.nama_pelapor || "").trim().toUpperCase();
    if (!nama) return { success: false, message: "Nama Pelapor Kosong" };
    const posisi = f.posisi || "OPERATOR UNIT";

    const data = sheet.getDataRange().getValues();
    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === nama) {
        foundRow = i + 1;
        break;
      }
    }

    if (foundRow > 0) {
      sheet.getRange(foundRow, 2).setValue(posisi);
    } else {
      sheet.appendRow([nama, posisi]);
    }
    SpreadsheetApp.flush();
    return { success: true, message: `Pelapor ${nama} berhasil disimpan!` };
  } catch (e) { return { success: false, message: e.toString() }; }
}

function deletePelapor(targetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('MasterPelapor');
    if (!sheet) return { success: true };
    const data = sheet.getDataRange().getValues();
    let isDeleted = false;
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).trim().toUpperCase() === String(targetId).trim().toUpperCase()) {
        sheet.deleteRow(i + 1);
        isDeleted = true;
        break;
      }
    }
    if (isDeleted) SpreadsheetApp.flush();
    return { success: true, message: isDeleted ? "Pelapor dihapus" : "Pelapor tidak ditemukan" };
  } catch (e) { return { success: false, message: e.toString() }; }
}

// ================================================================
// CLEAR DATA FUNCTIONS — Hapus Data per Sheet / Semua Data
// ================================================================

// ================================================================
// CLEAR DATA FUNCTIONS - Hapus Data per Sheet / Semua Data
// ================================================================

/**
 * Hapus semua baris data (baris 2+) pada satu sheet tertentu.
 * Header (baris 1) dipertahankan.
 */
function clearSheetData(sheetName) {
  try {
    if (!sheetName) return { success: false, message: 'Nama sheet tidak valid.' };

    // Frontend labels remain accepted, but resolve to actual database sheets.
    var SHEET_ALIASES = {
      // 1. Work Order & Backlog
      workorders: 'WorkOrders',
      backlog: 'Backlog',
      // 2. Preventive Maintenance
      pmrecords: 'PM_Records', pm_records: 'PM_Records',
      planservice: 'PlanService',
      // 3. Reliability & Component
      pcr: 'PCR_Components', pcr_components: 'PCR_Components',
      swabcomponent: 'Swab_Components', swab_components: 'Swab_Components',
      far: 'Failure_Analysis', failure_analysis: 'Failure_Analysis',
      // 4. Daily Operations
      inspection: 'Inspection',
      dailyhm: 'DailyHM',
      activity: 'MechanicActivity', mechanicactivity: 'MechanicActivity',
      servicehistory: 'ServiceHistory',
      // 5. Planning & Coordination
      monthlybudget: 'Monthly_Budget', monthly_budget: 'Monthly_Budget',
      equipmentcost: 'Equipment_Cost', equipment_cost: 'Equipment_Cost',
      partusage: 'PartUsage',
      meetingnotes: 'Meeting_Notes', meeting_notes: 'Meeting_Notes',
      // 6. Master Data & Warehouse
      masterequip: 'MasterEquip',
      planalat: 'PlanAlat',
      stock: 'Stock', masterstock: 'Stock', masterparts: 'MasterParts', masterpart: 'Stock', partstock: 'Stock', parts: 'Stock', master_stock: 'Stock', master_parts: 'MasterParts',
      mastertools: 'Master_Tools', master_tools: 'Master_Tools',
      mastermekanik: 'MasterMekanik',
      mastercomponent: 'MasterComponent',
      masterpelapor: 'MasterPelapor',
      // 7. System Control & Logs
      systemlogs: 'SystemLogs'
    };

    var cleanKey = String(sheetName).trim().toLowerCase().replace(/[\s_\-]+/g, '');
    var resolvedName = null;
    
    // Check direct alias map
    for (var k in SHEET_ALIASES) {
      if (k.toLowerCase().replace(/[\s_\-]+/g, '') === cleanKey) {
        resolvedName = SHEET_ALIASES[k];
        break;
      }
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!resolvedName) {
      // Fallback: check if an actual sheet with this exact name exists in the workbook
      var directSheet = ss.getSheetByName(sheetName);
      if (directSheet) {
        resolvedName = directSheet.getName();
      } else {
        return { success: false, message: "Sheet '" + sheetName + "' tidak diizinkan untuk dihapus datanya." };
      }
    }

    var sheet = ss.getSheetByName(resolvedName);
    var deletedCount = 0;

    if (sheet) {
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
        deletedCount = lastRow - 1;
      }
    } else {
      return { success: true, message: "Sheet '" + resolvedName + "' tidak ditemukan, dilewati." };
    }

    // Jika membersihkan Stock atau MasterParts, bersihkan keduanya agar sinkron
    if (resolvedName === 'Stock' || resolvedName === 'MasterParts') {
      var otherName = (resolvedName === 'Stock') ? 'MasterParts' : 'Stock';
      var otherSheet = ss.getSheetByName(otherName);
      if (otherSheet && otherSheet.getLastRow() > 1) {
        otherSheet.getRange(2, 1, otherSheet.getLastRow() - 1, otherSheet.getLastColumn()).clearContent();
      }
    }

    SpreadsheetApp.flush();
    logSystem('clearSheetData', "Data sheet '" + resolvedName + "' dihapus (" + deletedCount + " baris).", 'ADMIN');
    return { success: true, message: deletedCount + " baris data pada sheet '" + resolvedName + "' berhasil dihapus." };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

/**
 * Hapus semua data operasional dari 18 sheet database transaksi & stock sekaligus.
 * Master data armada (MasterEquip, PlanAlat, MasterMekanik, Master_Tools, MasterComponent, MasterPelapor),
 * Users, UserAccess, dan Settings tetap AMAN.
 */
function clearAllOperationalData() {
  try {
    var OPERATIONAL_SHEETS = [
      'WorkOrders', 'PM_Records', 'PlanService', 'Backlog', 'DailyHM',
      'Inspection', 'MechanicActivity', 'PartUsage', 'SystemLogs',
      'ServiceHistory', 'PCR_Components', 'Failure_Analysis', 'Swab_Components',
      'Monthly_Budget', 'Equipment_Cost', 'Meeting_Notes',
      'Stock', 'MasterParts'
    ];

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var deletedSummary = [];
    var totalRows = 0;

    OPERATIONAL_SHEETS.forEach(function(sheetName) {
      var sheet = ss.getSheetByName(sheetName);
      if (!sheet) return;
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
        var rowCount = lastRow - 1;
        totalRows += rowCount;
        deletedSummary.push(sheetName + ': ' + rowCount + ' baris');
      }
    });

    SpreadsheetApp.flush();
    logSystem('clearAllOperationalData', 'Semua data operasional & stock dihapus. Total: ' + totalRows + ' baris dari ' + deletedSummary.length + ' sheet.', 'ADMIN');

    return {
      success: true,
      message: 'Total ' + totalRows + ' baris data transaksi & stock dari ' + deletedSummary.length + ' sheet berhasil dihapus.',
      detail: deletedSummary
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

