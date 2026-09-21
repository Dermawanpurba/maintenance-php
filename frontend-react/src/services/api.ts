export const api = {
  /**
   * Post to unified maintenance router endpoint
   */
  async postAction<T = any>(action: string, data: any = {}): Promise<{ success: boolean; message?: string; [key: string]: any }> {
    const res = await fetch('/api/maintenance/router', {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({ action, ...data, _ts: Date.now() })
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Fetch complete dataset
   */
  async getOptimizedData() {
    return this.postAction('getOptimizedData');
  },

  /**
   * Ping backend API
   */
  async ping() {
    return this.postAction('ping');
  },

  /**
   * 1-Click download .ZIP backup archive
   */
  triggerBackupDownload() {
    window.open('/api/backup/download', '_blank');
  },

  // ==================== WORK ORDERS ====================
  async saveWorkOrder(data: any) {
    return this.postAction('saveWorkOrder', data);
  },

  async updateWOStatus(no_wo: string, status: string, closureData: Record<string, any> = {}) {
    return this.postAction('updateWOStatus', { no_wo, status, ...closureData });
  },

  async deleteWO(no_wo: string) {
    return this.postAction('deleteWO', { no_wo });
  },

  async saveBDAwal(data: { equip_no: string; kendala: string; tgl_rusak?: string; jam_rusak?: string; pelapor?: string; shift?: string }) {
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().slice(0, 5);
    const woPayload = {
      no_wo: `BD-${Date.now().toString().slice(-6)}`,
      equip_no: data.equip_no,
      status: 'BREAKDOWN',
      sch_unsch: 'UNSCHEDULED',
      kendala: data.kendala,
      tgl_rusak: data.tgl_rusak || today,
      jam_rusak: data.jam_rusak || time,
      pelapor: data.pelapor || 'Operator Pit',
      shift: data.shift || '1'
    };
    return this.postAction('saveWorkOrder', woPayload);
  },

  // ==================== BACKLOG ====================
  async saveBacklog(data: any) {
    return this.postAction('saveBacklog', data);
  },

  async updateBacklogStatus(id: string | number, status: string) {
    return this.postAction('updateBacklogStatus', { id, status });
  },

  async deleteBacklog(id: string | number) {
    return this.postAction('deleteBacklog', { id });
  },

  // ==================== DAILY HM ====================
  async saveDailyHM(data: any) {
    return this.postAction('saveDailyHM', data);
  },

  async deleteDailyHM(id: string | number) {
    return this.postAction('deleteDailyHM', { id });
  },

  // ==================== P2H INSPECTION ====================
  async saveInspection(data: any) {
    return this.postAction('saveInspection', data);
  },

  async deleteInspection(id: string | number) {
    return this.postAction('deleteInspection', { id });
  },

  // ==================== PREVENTIVE MAINTENANCE ====================
  async savePMRecord(data: any) {
    return this.postAction('savePMRecord', data);
  },

  async deletePMRecord(id: string | number) {
    return this.postAction('deletePMRecord', { id });
  },

  // ==================== PCR (PLAN COMPONENT REPLACEMENT) ====================
  async savePCR(data: any) {
    return this.postAction('savePCR', data);
  },

  async deletePCR(id: string | number) {
    return this.postAction('deletePCR', { id });
  },

  // ==================== SWAB / KANIBALISASI ====================
  async saveSwabComponent(data: any) {
    return this.postAction('saveSwabComponent', data);
  },

  async updateSwabStatus(id: string | number, status: string) {
    return this.postAction('updateSwabStatus', { id, status });
  },

  async deleteSwabComponent(id: string | number) {
    return this.postAction('deleteSwabComponent', { id });
  },

  // ==================== FAILURE ANALYSIS REPORT (FAR) ====================
  async saveFAR(data: any) {
    return this.postAction('saveFAR', data);
  },

  async deleteFAR(id: string | number) {
    return this.postAction('deleteFAR', { id });
  },

  // ==================== NOTULEN RAPAT ====================
  async saveMeetingNotes(data: any) {
    return this.postAction('saveMeetingNotes', data);
  },

  async deleteMeetingNotes(id: string | number) {
    return this.postAction('deleteMeetingNotes', { id });
  },

  // ==================== MONTHLY BUDGET ====================
  async saveMonthlyBudget(data: any) {
    return this.postAction('saveMonthlyBudget', data);
  },

  async deleteMonthlyBudget(id: string | number) {
    return this.postAction('deleteMonthlyBudget', { id });
  },

  // ==================== MASTER EQUIP ====================
  async saveMaster(data: any) {
    return this.postAction('saveMaster', data);
  },

  async deleteMasterEquip(id: string | number) {
    return this.postAction('deleteMasterEquip', { equip_no: id });
  },

  async deletePlan(data: { equip_no: string; type: string }) {
    return this.postAction('deletePlan', data);
  },

  // ==================== MASTER STOCK & PARTS ====================
  async saveStock(data: any) {
    return this.postAction('saveStock', data);
  },

  async deleteStock(id: string | number) {
    return this.postAction('deleteStock', { id });
  },

  async deletePart(part_number: string) {
    return this.postAction('deletePart', { part_number });
  },

  // ==================== MASTER TOOLS ====================
  async saveMasterTool(data: any) {
    return this.postAction('saveMasterTool', data);
  },

  async updateToolBorrowStatus(data: { id: string | number; status: string; borrowed_by?: string; borrow_date?: string; return_date?: string }) {
    return this.postAction('updateToolBorrowStatus', data);
  },

  async deleteMasterTool(id: string | number) {
    return this.postAction('deleteMasterTool', { id });
  },

  // ==================== MECHANIC ACTIVITIES ====================
  async saveActivityLog(data: any) {
    return this.postAction('saveActivityLog', data);
  },

  async deleteActivity(id: string | number) {
    return this.postAction('deleteActivity', { id });
  },

  // ==================== SYSTEM AUDIT LOGS ====================
  async getSystemLogs() {
    return this.postAction('getSystemLogs');
  },

  // ==================== USERS & ACCESS CONTROL ====================
  async getUsersList() {
    return this.postAction('getUsersList');
  },

  async saveUser(data: any) {
    return this.postAction('saveUser', data);
  },

  async approveUser(data: { username: string; status?: string; role?: string }) {
    return this.postAction('approveUser', data);
  },

  async deleteUser(username: string) {
    return this.postAction('deleteUser', { username });
  },

  async getUserAccess(username: string) {
    return this.postAction('getUserAccess', { username });
  },

  async saveUserAccess(data: { username: string; feature: string }) {
    return this.postAction('saveUserAccess', data);
  },

  async deleteUserAccess(id: string | number) {
    return this.postAction('deleteUserAccess', { id });
  },

  // ==================== MASTER CREW & COMPONENTS ====================
  async saveMekanik(data: any) {
    return this.postAction('saveMekanik', data);
  },

  async deleteMekanik(id: string | number) {
    return this.postAction('deleteMekanik', { id, nama_mekanik: id });
  },

  async savePelapor(data: any) {
    return this.postAction('savePelapor', data);
  },

  async deletePelapor(id: string | number) {
    return this.postAction('deletePelapor', { id });
  },

  async saveMasterComponent(data: any) {
    return this.postAction('saveMaster', { type: 'component', data });
  },

  async deleteMasterComponent(id: string | number) {
    return this.postAction('deleteMasterComponent', { id });
  },

  // ==================== SETTINGS ====================
  async getSettings() {
    return this.postAction('getSettings');
  },

  async saveSettings(data: any) {
    return this.postAction('saveSettings', data);
  },

  // ==================== SCHEDULED OIL SAMPLING (SOS) ====================
  async saveOilSample(data: any) {
    return this.postAction('saveOilSample', data);
  },

  async deleteOilSample(id: string | number) {
    return this.postAction('deleteOilSample', { id });
  },

  // ==================== TARGET JAM OPERASI (PLAN ALAT) ====================
  async getTargetJamOperasi(year: number, month: number) {
    return this.postAction('getTargetJamOperasi', { plan_year: year, plan_month: month });
  },

  async savePlanAlatRow(data: any) {
    return this.postAction('savePlanAlatRow', data);
  },

  async deletePlanAlatRow(id: number | string) {
    return this.postAction('deletePlanAlatRow', { id });
  },

  async saveJamHarian(data: { equip_no: string; plan_year: number; plan_month: number; plan_day: number; jam_rencana: number }) {
    return this.postAction('saveJamHarian', data);
  },

  async bulkSaveJamHarian(data: { equip_no: string; plan_year: number; plan_month: number; days: { day: number; jam: number }[] }) {
    return this.postAction('bulkSaveJamHarian', data);
  },

  async seedDemoTargetJam(year: number = 2024, month: number = 6) {
    return this.postAction('seedDemoTargetJam', { plan_year: year, plan_month: month });
  },

  // ==================== MASTER DATABASE PART SERVICE ====================
  async getPartServices(params?: { equipment?: string; unit_type?: string; model?: string }) {
    return this.postAction('getPartServices', params || {});
  },

  async savePartService(data: any) {
    return this.postAction('savePartService', data);
  },

  async deletePartService(id: number | string) {
    return this.postAction('deletePartService', { id });
  },

  async seedPartServices() {
    return this.postAction('seedPartServices');
  },
};

