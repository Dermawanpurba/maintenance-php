export interface Equipment {
  id?: number | string;
  no_unit: string;
  equip_no?: string;
  tipe?: string;
  type?: string;
  unit_type?: string;
  model: string;
  lokasi: string;
  status: string; // READY, BREAKDOWN, STANDBY, MAINTENANCE
  last_hm: number;
  serial_number?: string;
  brand?: string;
  warranty_status?: string;
  keterangan?: string;
}

export interface WorkOrder {
  id?: number | string;
  no_wo: string;
  tanggal?: string;
  no_unit?: string;
  equip_no?: string;
  brand?: string;
  unit_type?: string;
  hm_km?: number | string;
  tgl_rusak?: string;
  jam_rusak?: string;
  tgl_selesai?: string;
  jam_selesai?: string;
  sch_unsch?: string;
  pm_service?: string;
  major_comp?: string;
  minor_comp?: string;
  kendala?: string;
  failure_reason?: string;
  reported_by?: string;
  tech?: string;
  action_log?: string;
  parts_json?: string;
  deskripsi?: string;
  status: string; // OPEN, IN PROGRESS, WAITING PART, COMPLETED, CLOSED
  prioritas?: string; // EMERGENCY, HIGH, NORMAL, LOW
  pelapor?: string;
  mekanik?: string;
  catatan?: string;
  parts?: any[];
  total_downtime?: number | string;
  downtime_hours?: number | string;
}

export interface Backlog {
  id?: number | string;
  item_id?: string;
  tanggal?: string;
  equip_no?: string;
  no_unit?: string;
  deskripsi_backlog?: string;
  deskripsi?: string;
  prioritas?: string;
  status: string; // OPEN, CLOSED, WAITING PART, IN PROGRESS
  rencana_eksekusi?: string;
  rencana?: string;
  part_required?: string;
  estimated_hours?: number | string;
  est_hours?: number | string;
}

export interface DailyHM {
  id?: number | string;
  item_id?: string;
  tanggal: string;
  equip_no?: string;
  no_unit?: string;
  hm_awal: number;
  hm_akhir: number;
  total_hm?: number;
  fuel_liter?: number;
  operator?: string;
  shift?: string;
  deviasi?: number | null;
}

export interface MechanicActivity {
  id?: number | string;
  item_id?: string;
  tanggal?: string;
  no_wo?: string;
  mekanik?: string;
  aktifitas?: string;
  jam_mulai?: string;
  jam_selesai?: string;
  created_at?: string;
}

export interface MasterMekanik {
  id?: number | string;
  item_id?: string;
  nama?: string;
  nama_mekanik?: string;
  status?: string;
}


export interface PartItem {
  id?: number | string;
  part_number: string;
  part_name: string;
  category?: string;
  stock_qty: number;
  min_stock: number;
  unit: string;
  price?: number;
  bin_location?: string;
}

export interface ToolItem {
  id?: number | string;
  tool_id: string;
  tool_name: string;
  category?: string;
  status: string; // AVAILABLE, BORROWED, CALIBRATION
  borrower?: string;
  borrow_date?: string;
}

export interface SwabRecord {
  id?: number | string;
  tanggal: string;
  component_name: string;
  donor_unit: string;
  recipient_unit: string;
  reason: string;
  status: string;
  pic: string;
}

export interface FARRecord {
  id?: number | string;
  item_id?: string;
  far_number?: string;
  tanggal?: string;
  incident_date?: string;
  no_unit?: string;
  equip_no?: string;
  damage_part?: string;
  component?: string;
  root_cause?: string;
  why1?: string;
  why2?: string;
  why3?: string;
  why4?: string;
  why5?: string;
  corrective_action?: string;
  preventive_action?: string;
  pic?: string;
  leader?: string;
}

export interface MeetingNote {
  id?: number | string;
  item_id?: string;
  tanggal?: string;
  topic?: string;
  title?: string;
  agenda?: string;
  discussion_summary?: string;
  decision?: string;
  management_decision?: string;
  attendees?: string;
  leader?: string;
  pic?: string;
  status?: string;
  plant_health?: string;
  critical_issue?: string;
}

export interface MonthlyBudgetItem {
  id?: number | string;
  item_id?: string;
  bulan?: string;
  month_year?: number;
  kategori?: string;
  category?: string;
  anggaran?: number;
  budget_plan?: number;
  realisasi?: number;
  actual_spent?: number;
  selisih?: number;
  variance?: number;
  keterangan?: string;
  notes?: string;
  status?: string;
}

export interface PcrItem {
  id?: number | string;
  item_id?: string;
  equip_no?: string;
  component_name?: string;
  target_lifetime_hm?: number;
  current_hm?: number;
  remaining_hm?: number;
  status?: string;
  estimated_cost?: number;
  scheduled_date?: string;
}

export interface SystemLogItem {
  id?: number | string;
  timestamp: string;
  action: string;
  message: string;
  user: string;
}

export interface PlanAlat {
  id?: number | string;
  equip_no: string;
  model?: string;
  plan_hours_per_month?: number;
  plan_pa?: number;
  mohh?: number;
  category?: string;
  status?: string;
}

export interface PlanService {
  id?: number | string;
  equip_no: string;
  model?: string;
  plan_hours_per_month?: number;
  plan_pa?: number;
  last_service_date?: string;
  last_service_hm?: string | number;
  next_service_hm?: string | number;
  kategori?: string;
}

export interface AppUser {
  id?: number | string;
  username: string;
  nama?: string;
  name?: string;
  role: string;
  status: string; // ACTIVE, PENDING, REJECTED
  password?: string;
  email?: string;
  created_at?: string;
}

export interface UserAccessItem {
  id?: number | string;
  username: string;
  feature: string;
}

export interface MasterPelapor {
  id?: number | string;
  item_id?: string;
  nama?: string;
  nama_pelapor?: string;
  jabatan?: string;
  departemen?: string;
}

export interface MasterComponentItem {
  id?: number | string;
  item_id?: string;
  major_component: string;
  minor_component: string;
  standard_lifetime_hm?: number;
}

export interface SettingsData {
  site_name?: string;
  company_name?: string;
  default_shift?: string;
  auto_refresh_seconds?: number;
  theme?: string;
  wa_gateway?: string;
  [key: string]: any;
}

export interface OilSample {
  id?: number | string;
  item_id?: string;
  sample_code: string;
  equip_no: string;
  compartment: string;
  sample_date: string;
  hm: number;
  oil_grade?: string;
  rating: 'A' | 'B' | 'C' | 'X' | 'D' | string;
  top_up?: number;
  repair_notes?: string;
  si?: number;
  al?: number;
  na?: number;
  fe?: number;
  cu?: number;
  cr?: number;
  pb?: number;
  pq?: number;
  visc_100?: number;
  oxi?: number;
  soot?: number;
  tbn?: number;
  iso_6?: number;
  iso_14?: number;
  water_pct?: number;
  interpretation?: string;
  lab_vendor?: string;
  status?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MaintenanceWeek {
  id: number;
  week_no: string;
  label?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  target_compliance?: number;
  notes?: string;
}

export interface PpuRecord {
  id?: number | string;
  unit_no: string;
  model?: string;
  track_group_used?: string;
  cts_date?: string;
  last_fitted_track_group?: string;
  pct_hours_track?: number;
  hours_track_gp?: number;
  smu?: number;
  // Sprocket (3 Teeth mm)
  sprocket_lh?: number;
  sprocket_rh?: number;
  // Track Link — Link Height
  link_height_lh?: number;
  link_height_rh?: number;
  // Track Link — Chain Bushing
  chain_bushing_lh?: number;
  chain_bushing_rh?: number;
  // Track Link — Frame Extension
  frame_ext_lh?: number;
  frame_ext_rh?: number;
  // Track Shoe — Grouser Height
  grouser_height_lh?: number;
  grouser_height_rh?: number;
  // Idler Front
  idler_front_lh?: number;
  idler_front_rh?: number;
  // Idler Rear
  idler_rear_lh?: number;
  idler_rear_rh?: number;
  // Metadata
  inspection_date?: string;
  inspector?: string;
  notes?: string;
  status?: 'NORMAL' | 'CAUTION' | 'CRITICAL' | string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TargetJamOperasi {
  id?: number | string;
  equip_no: string;
  section?: string;
  model?: string;
  est_hm?: number;
  est_hm_date?: string;
  status?: string;
  next_service_hours_due?: number;
  next_service_hours_due_2?: number;
  next_service_type_hm?: number;
  next_service_type?: string;
  next_service_type_2?: string;
  next_service_date?: string;
  next_service_date_2?: string;
  pm_250?: number;
  pm_500?: number;
  pm_1000?: number;
  pm_2000?: number;
  pm_4000?: number;
  pm_other?: number;
  downtime_pm?: number;
  downtime_backlog?: number;
  downtime_midlife?: number;
  downtime_pcr?: number;
  ba_gg?: number;
  oil_fe?: number;
  pos?: number;
  plan_year?: number;
  plan_month?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TargetJamHarian {
  id?: number | string;
  equip_no: string;
  plan_year: number;
  plan_month: number;
  plan_day: number;
  jam_rencana: number;
  downtime_type?: 'PM' | 'BD' | 'BACKLOG' | 'MIDLIFE' | 'PCR' | string;
  created_at?: string;
  updated_at?: string;
}
