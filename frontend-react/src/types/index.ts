export interface Equipment {
  id?: number | string;
  no_unit: string;
  tipe: string;
  model: string;
  lokasi: string;
  status: string; // READY, BREAKDOWN, STANDBY, MAINTENANCE
  last_hm: number;
  serial_number?: string;
  brand?: string;
}

export interface WorkOrder {
  id?: number | string;
  no_wo: string;
  tanggal: string;
  no_unit: string;
  deskripsi: string;
  status: string; // OPEN, IN PROGRESS, WAITING PART, COMPLETED, CLOSED
  prioritas: string; // EMERGENCY, HIGH, NORMAL, LOW
  pelapor?: string;
  mekanik?: string;
  catatan?: string;
  parts?: any[];
}

export interface Backlog {
  id?: number | string;
  tanggal?: string;
  no_unit: string;
  deskripsi: string;
  prioritas: string;
  status: string; // PENDING, ORDERED, READY, CLOSED
  part_required?: string;
  estimated_hours?: number;
}

export interface DailyHM {
  id?: number | string;
  tanggal: string;
  no_unit: string;
  hm_awal: number;
  hm_akhir: number;
  total_hm?: number;
  fuel_liter?: number;
  operator?: string;
  shift?: string;
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
  far_number: string;
  tanggal: string;
  no_unit: string;
  damage_part: string;
  root_cause: string;
  corrective_action: string;
  pic: string;
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
