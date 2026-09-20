import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Send, 
  History, 
  FileText, 
  Eye, 
  Trash2, 
  X, 
  ShieldCheck, 
  Truck, 
  Sliders, 
  CheckCheck, 
  Search,
  Layers
} from 'lucide-react';
import { Equipment } from '../types';
import { api } from '../services/api';

export type EquipmentCategory = 'DUMP_TRUCK' | 'EXCAVATOR' | 'DOZER' | 'GENERAL';

export interface CheckItem {
  id: string;
  category: string;
  label: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  note: string;
}

interface P2hInspectionViewProps {
  equipments: Equipment[];
  inspections?: any[];
  onRefresh: () => void;
}

// ==================== CHECKLIST TEMPLATES ====================

// 1. DUMP TRUCK (19 Poin Spesifik)
const dumpTruckChecklist: Omit<CheckItem, 'status' | 'note'>[] = [
  // Kabin & Kontrol
  { id: 'dt_seatbelt', category: 'Kabin & Keselamatan', label: 'Sabuk Pengaman (Seatbelt 3 Titik) & Kaca Spion Kanan-Kiri' },
  { id: 'dt_steering', category: 'Kabin & Kontrol', label: 'Respon Kemudi (Steering Wheel) & Secondary Steering' },
  { id: 'dt_brake_service', category: 'Sistem Pengereman', label: 'Pedal Rem Kaki (Service Brake) & Tekanan Angin Tangki Rem' },
  { id: 'dt_brake_park', category: 'Sistem Pengereman', label: 'Tuas Rem Parkir (Parking Brake) & Emergency Brake' },
  { id: 'dt_retarder', category: 'Sistem Pengereman', label: 'Tuas Retarder Brake / Exhaust Brake (Turunan Terjal)' },
  { id: 'dt_hoist_lever', category: 'Sistem Kontrol', label: 'Tuas Kontrol Hoist Dump Body (Raise, Hold, Lower, Float)' },
  { id: 'dt_dash_gauges', category: 'Kabin & Kontrol', label: 'Monitor Panel, Indikator Tekanan Oli, Suhu Mesin & Error Code' },
  
  // Keliling Unit & Ban
  { id: 'dt_tires', category: 'Roda & Undercarriage', label: 'Kondisi Ban 6 Roda (Tekanan Angin 105 PSI, Bebas Retak/Batu Terselip)' },
  { id: 'dt_wheel_nuts', category: 'Roda & Undercarriage', label: 'Kekencangan Mur Roda (Wheel Nuts & Studs Torsi 850 Nm)' },
  { id: 'dt_hoist_cyl', category: 'Sistem Hidrolik Hoist', label: 'Silinder Hoist Dump Body & Selang Tekanan Tinggi Bebas Rembes' },
  { id: 'dt_vessel_pin', category: 'Dump Body & Vessel', label: 'Pin Engsel Vessel / Bak Dump & Pin Pengaman (Safety Lock Pin)' },
  { id: 'dt_suspension', category: 'Suspensi & Chassis', label: 'Front Strut Suspension & Rear Leaf Spring (Bebas Retak/Bocor)' },
  { id: 'dt_fuel_water', category: 'Sistem Bahan Bakar', label: 'Tangki Solar & Drain Water Separator dari Endapan Air' },

  // Ruang Mesin
  { id: 'dt_eng_oil', category: 'Ruang Mesin (Engine)', label: 'Level & Kualitas Oli Mesin (Dipstick Engine Oil)' },
  { id: 'dt_coolant', category: 'Ruang Mesin (Engine)', label: 'Level Air Pendingin Radiator, Tutup Radiator & Fan Belt' },
  { id: 'dt_trans_oil', category: 'Transmisi & Powertrain', label: 'Level Oli Transmisi Otomatis & Retarder Fluid' },
  { id: 'dt_air_filter', category: 'Ruang Mesin (Engine)', label: 'Indikator Filter Udara (Dust Indicator Clogging Bebas Sumbatan)' },

  // Kelistrikan & Safety
  { id: 'dt_lights', category: 'Kelistrikan & Safety', label: 'Lampu Utama Depan, Lampu Belakang, Sein, Hazard & Rotary Beacon' },
  { id: 'dt_horn_alarm', category: 'Kelistrikan & Safety', label: 'Klakson Utama & Back Alarm Otomatis Bunyi Saat Mundur' },
  { id: 'dt_apar', category: 'Kabin & Keselamatan', label: 'Tabung APAR (Indikator Jarum Hijau, Segel & Pin Utuh)' },
];

// 2. EXCAVATOR (19 Poin Spesifik)
const excavatorChecklist: Omit<CheckItem, 'status' | 'note'>[] = [
  // Attachment Kerja & Hidrolik
  { id: 'ex_bucket_teeth', category: 'Attachment Kerja', label: 'Kuku Bucket (Teeth), Side Cutter & Pin Kunci Adapter' },
  { id: 'ex_bucket_pins', category: 'Attachment Kerja', label: 'Pin & Bushing Sambungan Bucket, Linkage H, dan Arm' },
  { id: 'ex_cyl_bucket', category: 'Sistem Hidrolik', label: 'Silinder Hidrolik Bucket & Selang Tekanan Tinggi Bebas Rembes' },
  { id: 'ex_cyl_arm', category: 'Sistem Hidrolik', label: 'Silinder Hidrolik Arm / Stick (Rod Bebas Goresan/Baret & Seal Utuh)' },
  { id: 'ex_cyl_boom', category: 'Sistem Hidrolik', label: 'Sepasang Silinder Hidrolik Boom & Safety Holding Valve' },
  { id: 'ex_swing_mech', category: 'Sistem Swing & Slewing', label: 'Swing Machinery, Swing Circle Bearing & Pin Kunci Swing Lock' },

  // Undercarriage & Rantai Track
  { id: 'ex_track_sag', category: 'Undercarriage (Track)', label: 'Kekenduran Rantai Track Sag (Standar 25 - 35 mm) & Recoil Spring' },
  { id: 'ex_track_shoes', category: 'Undercarriage (Track)', label: 'Kondisi Track Shoe, Grouser & Baut Track (Torsi 580 Nm)' },
  { id: 'ex_rollers', category: 'Undercarriage (Track)', label: 'Carrier Rollers, Track Rollers & Front Idler (Bebas Macet/Oli Bocor)' },
  { id: 'ex_final_drive', category: 'Undercarriage (Track)', label: 'Final Drive & Travel Motor (Level Oli & Bebas Kebocoran Seal)' },

  // Ruang Mesin & Pompa
  { id: 'ex_eng_oil', category: 'Ruang Mesin (Engine)', label: 'Level & Kualitas Oli Mesin (Dipstick Engine Oil)' },
  { id: 'ex_coolant', category: 'Ruang Mesin (Engine)', label: 'Level Air Radiator & Kisi Pendingin Bersih dari Endapan Lumpur' },
  { id: 'ex_hyd_pump', category: 'Sistem Pompa Hidrolik', label: 'Main Hydraulic Pump & Main Control Valve (Bebas Rembesan Oli)' },
  { id: 'ex_fuel_water', category: 'Sistem Bahan Bakar', label: 'Water Separator Solar & Indikator Air Cleaner Engine' },

  // Kabin & Kontrol
  { id: 'ex_safety_lever', category: 'Kabin & Kontrol', label: 'Pilot Shut-Off Safety Lever (Tuas Pengunci Hidrolik Kabin Berfungsi)' },
  { id: 'ex_joysticks', category: 'Kabin & Kontrol', label: 'Respon Joystick Attachment (Boom, Arm, Bucket & Swing Halus)' },
  { id: 'ex_travel_pedals', category: 'Kabin & Kontrol', label: 'Pedal & Tuas Travel Track (Gerakan Maju, Mundur, Counter-Rotate)' },
  { id: 'ex_monitor_panel', category: 'Kabin & Kontrol', label: 'Display Monitor Digital (Suhu Hidrolik, Error Code & Indikator RPM)' },

  // Kelistrikan & Safety
  { id: 'ex_lights', category: 'Kelistrikan & Safety', label: 'Lampu Kerja Boom, Lampu Kabin, Lampu Belakang & Rotary Lamp' },
  { id: 'ex_horn_alarm', category: 'Kelistrikan & Safety', label: 'Klakson, Travel Warning Alarm & APAR Siap Pakai di Luar Kabin' },
];

// 3. BULLDOZER (19 Poin Spesifik)
const dozerChecklist: Omit<CheckItem, 'status' | 'note'>[] = [
  // Blade & Ripper Attachment
  { id: 'dz_cutting_edge', category: 'Blade Attachment', label: 'Blade Cutting Edge & End Bits (Tingkat Keausan & Kekencangan Baut)' },
  { id: 'dz_blade_cyl', category: 'Blade Attachment', label: 'Silinder Hidrolik Blade Lift & Blade Tilt (Rod Silinder & Selang Bebas Bocor)' },
  { id: 'dz_ripper_shank', category: 'Ripper Attachment', label: 'Ripper Shank, Point/Tip & Pin Pengunci Ripper Terpasang Kuat' },
  { id: 'dz_ripper_cyl', category: 'Ripper Attachment', label: 'Silinder Hidrolik Ripper Lift & Tilt (Bebas Rembes & Retak)' },

  // Undercarriage & Heavy Track
  { id: 'dz_track_tension', category: 'Undercarriage Dozer', label: 'Ketegangan Rantai Track (Hydraulic Track Adjuster Tension)' },
  { id: 'dz_grouser_height', category: 'Undercarriage Dozer', label: 'Ketinggian Tapak Track Shoe Grouser (Daya Cengkeram Dorong Tanah)' },
  { id: 'dz_equalizer_bar', category: 'Undercarriage Dozer', label: 'Equalizer Bar, Pivot Shaft & Seal Pelindung Bebas Keretakan' },
  { id: 'dz_sprockets', category: 'Undercarriage Dozer', label: 'Sprocket Teeth & Track Rollers (Bebas Abrasi Berlebih / Patah)' },
  { id: 'dz_bottom_guard', category: 'Rangka Bawah (Chassis)', label: 'Bottom Guard / Pelindung Kolong Mesin & Transmisi Kencang Terpasang' },

  // Ruang Mesin & Powertrain
  { id: 'dz_eng_oil', category: 'Ruang Mesin & Oli', label: 'Level Oli Mesin (Dipstick) & Indikator Tekanan Oli Mesin' },
  { id: 'dz_radiator', category: 'Ruang Mesin & Pendingin', label: 'Level Air Radiator & Kisi Reversible Fan Screen Bersih' },
  { id: 'dz_torqflow_oil', category: 'Transmisi Powertrain', label: 'Level Oli Transmisi Torqflow & Torque Converter' },
  { id: 'dz_steering_case', category: 'Transmisi Powertrain', label: 'Level Oli Steering Clutch Case & Final Drive Housing' },
  { id: 'dz_air_cleaner', category: 'Sistem Pasokan Udara', label: 'Cyclone Air Cleaner Pre-Cleaner & Drain Water Separator Solar' },

  // Kabin & Kontrol Kemudi / Dozing
  { id: 'dz_brake_pedal', category: 'Kabin & Kontrol', label: 'Pedal Rem Kaki Utama & Tuas Kunci Parkir (Brake Lock Lever)' },
  { id: 'dz_pccs_steering', category: 'Kabin & Kontrol', label: 'Kemudi Joystick PCCS / Steering Clutches & Brakes Responsif' },
  { id: 'dz_blade_lever', category: 'Kabin & Kontrol', label: 'Tuas Kontrol Hidrolik Blade (Lift, Lower, Float & Blade Tilt)' },
  { id: 'dz_ripper_lever', category: 'Kabin & Kontrol', label: 'Tuas Kontrol Ripper & Decelerator Pedal Kaki Berfungsi Normal' },

  // Proteksi & Keselamatan
  { id: 'dz_rops_canopy', category: 'Struktur Proteksi', label: 'Struktur Pelindung Kabin ROPS / FOPS & Seatbelt Heavy Duty 3 Inci' },
  { id: 'dz_lights_safety', category: 'Kelistrikan & Safety', label: 'Lampu Kerja Depan/Belakang, Klakson, Back Alarm Mundur & Tabung APAR' },
];

// 4. ALAT BERAT UMUM / SUPPORT (14 Poin Fleksibel)
const generalChecklist: Omit<CheckItem, 'status' | 'note'>[] = [
  { id: 'gen_eng_oil', category: 'Mesin (Engine)', label: 'Level & Kualitas Oli Mesin (Dipstick)' },
  { id: 'gen_coolant', category: 'Mesin (Engine)', label: 'Level Air Radiator & Reservoir Pendingin' },
  { id: 'gen_hyd_oil', category: 'Sistem Hidrolik', label: 'Level Oli Hidrolik di Sight Glass' },
  { id: 'gen_hyd_hoses', category: 'Sistem Hidrolik', label: 'Selang & Fitting Hidrolik Bebas Rembes' },
  { id: 'gen_brake_service', category: 'Pengereman', label: 'Fungsi Service Brake & Pedal Travel' },
  { id: 'gen_brake_park', category: 'Pengereman', label: 'Fungsi Parking Brake & Emergency Brake' },
  { id: 'gen_steering', category: 'Kemudi & Artikulasi', label: 'Respon Kemudi & Sambungan Center Articulation' },
  { id: 'gen_track_tire', category: 'Roda / Undercarriage', label: 'Kondisi Ban / Ketegangan Rantai Track' },
  { id: 'gen_work_tool', category: 'Work Attachment', label: 'Attachment Kerja (Blade / Bucket / Drum Roller)' },
  { id: 'gen_lights', category: 'Kelistrikan & Safety', label: 'Lampu Kerja Depan/Belakang & Rotary Beacon' },
  { id: 'gen_horn_alarm', category: 'Kelistrikan & Safety', label: 'Klakson & Back Alarm Saat Mundur' },
  { id: 'gen_seatbelt', category: 'Kabin & Keselamatan', label: 'Seatbelt, Kaca Spion & Tabung APAR Siap Pakai' },
];

// Helper: Deteksi Kategori Alat secara Otomatis dari No Lambung & Model
export const detectEquipmentCategory = (equipNo: string, modelOrType: string = ''): EquipmentCategory => {
  const str = `${equipNo} ${modelOrType}`.toUpperCase();
  if (
    str.includes('DT') ||
    str.includes('HAULER') ||
    str.includes('DUMP') ||
    str.includes('TRUCK') ||
    str.includes('FM') ||
    str.includes('FUSO') ||
    str.includes('HINO') ||
    str.includes('HD')
  ) {
    return 'DUMP_TRUCK';
  }
  if (
    str.includes('EX') ||
    str.includes('PC') ||
    str.includes('SK') ||
    str.includes('ZX') ||
    str.includes('EXCAVATOR') ||
    str.includes('DIGGER')
  ) {
    return 'EXCAVATOR';
  }
  if (
    str.includes('DZ') ||
    str.includes('DOZER') ||
    str.includes('BULLDOZER') ||
    str.includes('D85') ||
    str.includes('D155') ||
    str.includes('D375')
  ) {
    return 'DOZER';
  }
  return 'GENERAL';
};

export const CATEGORY_INFO: Record<EquipmentCategory, {
  label: string;
  shortLabel: string;
  badge: string;
  color: string;
  bg: string;
  border: string;
  activeBg: string;
  desc: string;
}> = {
  DUMP_TRUCK: {
    label: 'Dump Truck / Hauler',
    shortLabel: 'Dump Truck',
    badge: 'DUMP TRUCK',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    activeBg: 'bg-amber-600 text-white shadow-amber-600/20',
    desc: 'Fokus Inspeksi: Ban (105 PSI), Baut Roda (850 Nm), Retarder Brake, Silinder Hoist & Safety Pin Vessel'
  },
  EXCAVATOR: {
    label: 'Excavator / Backhoe',
    shortLabel: 'Excavator',
    badge: 'EXCAVATOR',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    activeBg: 'bg-blue-600 text-white shadow-blue-600/20',
    desc: 'Fokus Inspeksi: Track Sag (25-35mm), Baut Track (580 Nm), Kuku Bucket, Silinder Boom/Arm, Swing Lock & Pilot Safety Lever'
  },
  DOZER: {
    label: 'Bulldozer / Crawler',
    shortLabel: 'Bulldozer',
    badge: 'BULLDOZER',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    activeBg: 'bg-emerald-600 text-white shadow-emerald-600/20',
    desc: 'Fokus Inspeksi: Blade Cutting Edge & Tilt, Ripper Shank/Point, Track Recoil Tension, Equalizer Bar & ROPS Canopy'
  },
  GENERAL: {
    label: 'Alat Berat Umum / Support',
    shortLabel: 'Umum / Support',
    badge: 'UMUM / SUPPORT',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    activeBg: 'bg-purple-600 text-white shadow-purple-600/20',
    desc: 'Fokus Inspeksi: Motor Grader, Wheel Loader, Vibro Roller, dan Unit Pendukung Tambang'
  }
};

export const getTemplateChecklist = (category: EquipmentCategory): Omit<CheckItem, 'status' | 'note'>[] => {
  switch (category) {
    case 'DUMP_TRUCK':
      return dumpTruckChecklist;
    case 'EXCAVATOR':
      return excavatorChecklist;
    case 'DOZER':
      return dozerChecklist;
    case 'GENERAL':
    default:
      return generalChecklist;
  }
};

export const P2hInspectionView: React.FC<P2hInspectionViewProps> = ({ 
  equipments = [], 
  inspections = [], 
  onRefresh 
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const initialEq = equipments[0];
  const [selectedUnit, setSelectedUnit] = useState<string>(initialEq?.equip_no || initialEq?.no_unit || '');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [inspector, setInspector] = useState('Operator Pit Lapangan');
  const [shift, setShift] = useState('Shift 1');
  const [catatan, setCatatan] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Kategori alat terpilih saat ini
  const initialCategory = initialEq 
    ? detectEquipmentCategory(initialEq.equip_no || initialEq.no_unit || '', initialEq.model || initialEq.type || '')
    : 'EXCAVATOR';
  const [currentCategory, setCurrentCategory] = useState<EquipmentCategory>(initialCategory);

  // Items checklist state
  const [items, setItems] = useState<CheckItem[]>(() => 
    getTemplateChecklist(initialCategory).map(c => ({ ...c, status: 'PASS', note: '' }))
  );

  // Sync kategori saat dropdown unit berubah
  const handleUnitChange = (unitNo: string) => {
    setSelectedUnit(unitNo);
    const eq = equipments.find(e => (e.equip_no || e.no_unit) === unitNo);
    const detected = eq 
      ? detectEquipmentCategory(eq.equip_no || eq.no_unit || '', eq.model || eq.type || '')
      : detectEquipmentCategory(unitNo);
    
    setCurrentCategory(detected);
    const template = getTemplateChecklist(detected);
    setItems(template.map(c => ({ ...c, status: 'PASS', note: '' })));
  };

  // Switcher Kategori Manual oleh Pengguna
  const handleCategoryChange = (cat: EquipmentCategory) => {
    setCurrentCategory(cat);
    const template = getTemplateChecklist(cat);
    setItems(template.map(c => ({ ...c, status: 'PASS', note: '' })));
  };

  // Local sample history jika inspections dari props belum ada
  const [localHistory, setLocalHistory] = useState<Array<any>>([
    {
      id: 'INSP-101',
      equip_no: 'EX1210',
      tipe_alat: 'EXCAVATOR',
      tanggal: '2026-09-18',
      shift: 'Shift 1',
      inspector: 'Suhartono (Operator)',
      result: 'RFU',
      status: 'RFU',
      fail_count: 0,
      warning_count: 0,
      items: excavatorChecklist.map(c => ({ ...c, status: 'PASS', note: 'Kondisi Baik' })),
      catatan: 'Unit Excavator layak operasi pit tanpa kendala.'
    },
    {
      id: 'INSP-102',
      equip_no: 'DZ-007',
      tipe_alat: 'DOZER',
      tanggal: '2026-09-17',
      shift: 'Shift 2',
      inspector: 'Budi Santoso',
      result: 'RWN',
      status: 'RWN',
      fail_count: 0,
      warning_count: 1,
      items: dozerChecklist.map((c, i) => ({ 
        ...c, 
        status: i === 1 ? 'WARNING' : 'PASS', 
        note: i === 1 ? 'Rembes minor hose silinder blade tilt' : 'Normal' 
      })),
      catatan: 'Perlu pengencangan fitting hose hidrolik blade tilt saat pergantian shift.'
    },
    {
      id: 'INSP-103',
      equip_no: 'DT230',
      tipe_alat: 'DUMP_TRUCK',
      tanggal: '2026-09-16',
      shift: 'Shift 1',
      inspector: 'Ahmad Dani',
      result: 'RFU',
      status: 'RFU',
      fail_count: 0,
      warning_count: 0,
      items: dumpTruckChecklist.map(c => ({ ...c, status: 'PASS', note: 'Normal' })),
      catatan: 'Tekanan ban dan retarder brake prima untuk hauling batubara.'
    }
  ]);

  // Gabungkan history dari props (backend) dan local
  const combinedHistory = useMemo(() => {
    if (inspections && inspections.length > 0) {
      return inspections.map(insp => {
        const eqNo = insp.equip_no || '';
        const detectedCat = insp.tipe_alat || detectEquipmentCategory(eqNo);
        let parsedItems: CheckItem[] = [];
        if (Array.isArray(insp.items) && insp.items.length > 0) {
          parsedItems = insp.items;
        } else if (typeof insp.checklist_json === 'string') {
          try {
            const dec = JSON.parse(insp.checklist_json);
            parsedItems = Array.isArray(dec) ? dec : (dec.items || []);
          } catch {
            parsedItems = [];
          }
        }
        
        const failC = parsedItems.filter(i => i.status === 'FAIL').length;
        const warnC = parsedItems.filter(i => i.status === 'WARNING').length;
        const res = insp.result || insp.status || (failC > 0 ? 'B/D' : warnC > 0 ? 'RWN' : 'RFU');

        return {
          id: insp.id || insp.item_id || 'INSP',
          equip_no: eqNo,
          tipe_alat: detectedCat,
          tanggal: insp.tanggal || new Date().toISOString().split('T')[0],
          shift: insp.shift || 'Shift 1',
          inspector: insp.inspector || 'Operator',
          result: res,
          status: res,
          fail_count: failC,
          warning_count: warnC,
          items: parsedItems.length > 0 ? parsedItems : getTemplateChecklist(detectedCat as EquipmentCategory).map(c => ({ ...c, status: 'PASS', note: '' })),
          catatan: insp.catatan || '-'
        };
      });
    }
    return localHistory;
  }, [inspections, localHistory]);

  const handleStatusChange = (id: string, status: 'PASS' | 'WARNING' | 'FAIL') => {
    setItems(items.map(it => (it.id === id ? { ...it, status } : it)));
  };

  const handleSetAllPass = () => {
    setItems(items.map(it => ({ ...it, status: 'PASS' })));
  };

  const failCount = items.filter(it => it.status === 'FAIL').length;
  const warningCount = items.filter(it => it.status === 'WARNING').length;
  const overallResult = failCount > 0 ? 'B/D' : warningCount > 0 ? 'RWN' : 'RFU';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) {
      alert('Pilih nomor lambung unit alat terlebih dahulu!');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        equip_no: selectedUnit,
        tipe_alat: currentCategory,
        tanggal,
        shift,
        inspector,
        status: overallResult,
        result: overallResult,
        fail_count: failCount,
        warning_count: warningCount,
        items: items,
        catatan: catatan || (overallResult === 'RFU' ? 'Unit fit to operate pit' : `${failCount} Fail, ${warningCount} Warning`)
      };

      const res = await api.saveInspection(payload);
      if (res && res.success) {
        setSubmittedSuccess(true);
        const newHistItem = {
          id: res.id || `INSP-${Date.now().toString().slice(-4)}`,
          equip_no: selectedUnit,
          tipe_alat: currentCategory,
          tanggal,
          shift,
          inspector,
          result: overallResult,
          status: overallResult,
          fail_count: failCount,
          warning_count: warningCount,
          items: [...items],
          catatan: payload.catatan
        };
        setLocalHistory(prev => [newHistItem, ...prev]);
        setCatatan('');
        setActiveTab('history');
        if (onRefresh) onRefresh();
        setTimeout(() => setSubmittedSuccess(false), 4000);
      } else {
        alert(res?.message || 'Gagal menyimpan data P2H');
      }
    } catch (err: any) {
      alert('Error menyimpan inspeksi: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Yakin ingin menghapus catatan inspeksi P2H ini?')) return;
    try {
      const res = await api.deleteInspection(id);
      if (res && res.success) {
        setLocalHistory(prev => prev.filter(h => h.id !== id));
        if (onRefresh) onRefresh();
      } else {
        alert(res?.message || 'Gagal menghapus inspeksi');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // Filter history
  const filteredHistory = useMemo(() => {
    return combinedHistory.filter(h => {
      const matchSearch = 
        (h.equip_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (h.inspector || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (h.id || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCat = filterCategory === 'ALL' || h.tipe_alat === filterCategory;
      return matchSearch && matchCat;
    });
  }, [combinedHistory, searchTerm, filterCategory]);

  const activeCategoryMeta = CATEGORY_INFO[currentCategory] || CATEGORY_INFO.GENERAL;

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 p-5 md:p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight">
                  P2H &amp; Checklist Inspeksi Harian Alat Berat
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-extrabold text-[10px] border border-blue-200 uppercase tracking-wider">
                  MODEL-ADAPTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pemeriksaan Pre-Start Spesifik: Dump Truck, Excavator &amp; Bulldozer Sesuai Standar K3 Tambang
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'form' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Formulir P2H</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'history' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Riwayat Inspeksi ({combinedHistory.length})</span>
          </button>
        </div>
      </div>

      {submittedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Data P2H berhasil disimpan ke database SQLite dan tersinkronisasi!</span>
          </div>
          <button onClick={() => setSubmittedSuccess(false)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {activeTab === 'form' ? (
        /* TAB 1: FORM P2H ADAPTIF MODEL ALAT */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Identitas Unit & Pemilih Model Alat */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 inline-flex items-center justify-center text-[11px] font-black">1</span>
                  Identitas Unit &amp; Kategori Model Alat
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Sistem otomatis mendeteksi model alat dari nomor lambung atau pilih manual template checklist di bawah:
                </p>
              </div>
            </div>

            {/* Model Selector Pills */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Pilih Kategori Model Alat (Checklist Otomatis Menyesuaikan):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['DUMP_TRUCK', 'EXCAVATOR', 'DOZER', 'GENERAL'] as EquipmentCategory[]).map(cat => {
                  const meta = CATEGORY_INFO[cat];
                  const isSelected = currentCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                        isSelected 
                          ? `${meta.bg} ${meta.border} ring-2 ring-blue-500 shadow-sm` 
                          : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isSelected ? meta.bg + ' ' + meta.color : 'bg-slate-200/60 text-slate-600'
                        }`}>
                          {meta.badge}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        )}
                      </div>
                      <div className="font-bold text-xs text-slate-800 truncate">{meta.shortLabel}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                        {getTemplateChecklist(cat).length} Poin Spesifik
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Fields: No Lambung, Tanggal, Shift, Inspector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-1">
              <div>
                <label className="block text-slate-600 font-bold mb-1.5">Pilih No. Lambung Alat *</label>
                <select
                  value={selectedUnit}
                  onChange={e => handleUnitChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  required
                >
                  <option value="">-- Pilih Unit --</option>
                  {equipments.map(eq => {
                    const no = eq.equip_no || eq.no_unit;
                    const cat = detectEquipmentCategory(no, eq.model || eq.type || '');
                    return (
                      <option key={eq.id || no} value={no}>
                        {no} — {eq.model || eq.type} ({CATEGORY_INFO[cat].badge}) [{eq.status}]
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">Tanggal Inspeksi</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={e => setTanggal(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">Shift Operasional</label>
                <select
                  value={shift}
                  onChange={e => setShift(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold outline-none focus:border-blue-500 focus:bg-white transition-colors"
                >
                  <option value="Shift 1">Shift 1 (Siang 07:00 - 19:00)</option>
                  <option value="Shift 2">Shift 2 (Malam 19:00 - 07:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">Nama Operator / Inspector</label>
                <input
                  type="text"
                  value={inspector}
                  onChange={e => setInspector(e.target.value)}
                  placeholder="Nama Lengkap Operator"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            {/* Model Focus Banner */}
            <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${activeCategoryMeta.bg} ${activeCategoryMeta.border}`}>
              <div className="p-2 rounded-xl bg-white shadow-sm mt-0.5">
                <Truck className={`w-5 h-5 ${activeCategoryMeta.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className={`font-black text-xs ${activeCategoryMeta.color}`}>
                    Template Aktif: {activeCategoryMeta.label}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white font-black text-slate-700 shadow-2xs border border-slate-200/50">
                    {items.length} Poin Checklist
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-relaxed">
                  {activeCategoryMeta.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Checklist Items Form */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 inline-flex items-center justify-center text-[11px] font-black">2</span>
                  Poin Pemeriksaan Kelayakan Harian ({items.length} Poin Checklist Spesifik)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Periksa fisik alat sebelum dinyalakan (Walk-Around, Cabin Controls, Fluid &amp; Attachment)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSetAllPass}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center space-x-1.5 transition-colors border border-slate-200/70"
                  title="Tandai semua poin PASS sekaligus"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Set Semua PASS</span>
                </button>

                <div className="flex items-center space-x-1.5 text-[11px] font-black pl-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    PASS: {items.filter(i => i.status === 'PASS').length}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60">
                    WARN: {warningCount}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200/60">
                    FAIL: {failCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid Checklist Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {items.map((item, idx) => {
                const isFail = item.status === 'FAIL';
                const isWarn = item.status === 'WARNING';
                const isPass = item.status === 'PASS';

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                      isFail
                        ? 'bg-rose-50/50 border-rose-200 shadow-sm'
                        : isWarn
                        ? 'bg-amber-50/40 border-amber-200 shadow-sm'
                        : 'bg-slate-50/70 border-slate-200/70 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[9.5px] font-black text-blue-600 uppercase tracking-wider block">
                          {item.category}
                        </span>
                        <span className="text-xs font-bold text-slate-800 block mt-0.5 leading-snug">
                          {idx + 1}. {item.label}
                        </span>
                      </div>
                    </div>

                    {/* Radio-Style Action Buttons */}
                    <div className="flex items-center space-x-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'PASS')}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center space-x-1 ${
                          isPass
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                            : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>PASS</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'WARNING')}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center space-x-1 ${
                          isWarn
                            ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                            : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>WARN</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'FAIL')}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center space-x-1 ${
                          isFail
                            ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                            : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>FAIL</span>
                      </button>
                    </div>

                    {/* Note input if Warning or Fail */}
                    {(isWarn || isFail) && (
                      <div className="pt-1">
                        <input
                          type="text"
                          value={item.note}
                          onChange={e => {
                            const val = e.target.value;
                            setItems(items.map(it => it.id === item.id ? { ...it, note: val } : it));
                          }}
                          placeholder={`Catatan spesifik ${isFail ? 'kerusakan FAIL' : 'kondisi WARNING'}...`}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[11px] text-slate-800 outline-none focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Catatan Keseluruhan */}
            <div className="pt-2">
              <label className="block text-slate-700 font-bold mb-1.5 text-xs">
                Catatan Temuan Tambahan / Rekomendasi Tindak Lanjut:
              </label>
              <textarea
                rows={2}
                value={catatan}
                onChange={e => setCatatan(e.target.value)}
                placeholder="Tuliskan temuan defect, kebocoran fluida, atau instruksi khusus untuk supervisor pit/mekanik..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs outline-none focus:border-blue-500 focus:bg-white resize-none font-medium"
              />
            </div>
          </div>

          {/* Card 3: Kesimpulan & Tombol Submit */}
          <div className="bg-white border border-slate-200/80 p-5 md:p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="text-xs text-slate-500 font-medium">
                Status Kelayakan Hasil Inspeksi:
              </div>
              <span
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 ${
                  overallResult === 'RFU'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : overallResult === 'RWN'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {overallResult === 'RFU' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {overallResult === 'RWN' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                {overallResult === 'B/D' && <XCircle className="w-4 h-4 text-rose-600" />}
                <span>
                  {overallResult === 'RFU' 
                    ? 'RFU (READY TO OPERATE)' 
                    : overallResult === 'RWN' 
                    ? 'RWN (READY WITH NOTE)' 
                    : 'B/D (NOT READY / BREAKDOWN)'}
                </span>
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-60 cursor-pointer flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Menyimpan ke SQLite...' : 'Kirim & Simpan Laporan P2H'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* TAB 2: RIWAYAT INSPEKSI P2H */
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm space-y-4 p-5 md:p-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari No Unit, Inspector, No P2H..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500"
              />
            </div>

            {/* Filter Category */}
            <div className="flex items-center space-x-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-slate-500 mr-1">Model:</span>
              {[
                { key: 'ALL', label: 'Semua Model' },
                { key: 'DUMP_TRUCK', label: 'Dump Truck' },
                { key: 'EXCAVATOR', label: 'Excavator' },
                { key: 'DOZER', label: 'Bulldozer' },
                { key: 'GENERAL', label: 'Umum' }
              ].map(f => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilterCategory(f.key)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors ${
                    filterCategory === f.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table History */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-600 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                  <th className="py-3 px-4">No. P2H</th>
                  <th className="py-3 px-4">Tanggal &amp; Shift</th>
                  <th className="py-3 px-4">Unit Alat</th>
                  <th className="py-3 px-4">Model Alat</th>
                  <th className="py-3 px-4">Inspector</th>
                  <th className="py-3 px-4">Kelayakan</th>
                  <th className="py-3 px-4">Poin Check</th>
                  <th className="py-3 px-4">Catatan</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400 font-medium">
                      Belum ada catatan inspeksi P2H yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((hist, idx) => {
                    const catMeta = CATEGORY_INFO[hist.tipe_alat as EquipmentCategory] || CATEGORY_INFO.GENERAL;
                    return (
                      <tr key={hist.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{hist.id}</td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div>{hist.tanggal}</div>
                          <span className="text-[10px] text-slate-400">{hist.shift}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-900 font-black text-[11px] border border-slate-200/70">
                            {hist.equip_no}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${catMeta.bg} ${catMeta.color} border ${catMeta.border}`}>
                            {catMeta.badge}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">{hist.inspector}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              hist.result === 'RFU' || hist.status === 'RFU'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : hist.result === 'RWN' || hist.status === 'RWN'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {hist.result || hist.status || 'RFU'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-1 text-[10px] font-bold">
                            {hist.fail_count > 0 ? (
                              <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                                {hist.fail_count} FAIL
                              </span>
                            ) : hist.warning_count > 0 ? (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                                {hist.warning_count} WARN
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                                SEMUA PASS
                              </span>
                            )}
                            <span className="text-slate-400">({hist.items?.length || 0} poin)</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-slate-600" title={hist.catatan}>
                          {hist.catatan}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedDetail(hist)}
                              title="Lihat Rincian Seluruh Poin Checklist"
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(hist.id)}
                              title="Hapus Catatan P2H"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Detail Rincian Checklist */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-black text-slate-900">
                      Rincian Hasil P2H: {selectedDetail.id}
                    </h3>
                    {selectedDetail.tipe_alat && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-extrabold text-[10px] border border-blue-200">
                        {selectedDetail.tipe_alat}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Unit: <strong className="text-slate-700">{selectedDetail.equip_no}</strong> • Tanggal: {selectedDetail.tanggal} ({selectedDetail.shift}) • Petugas: {selectedDetail.inspector}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDetail(null)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Checklist Items Scrollable */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1.5 text-xs">
              {selectedDetail.items?.map((it: CheckItem, idx: number) => {
                const isFail = it.status === 'FAIL';
                const isWarn = it.status === 'WARNING';
                return (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      isFail 
                        ? 'bg-rose-50/60 border-rose-200' 
                        : isWarn 
                        ? 'bg-amber-50/60 border-amber-200' 
                        : 'bg-slate-50 border-slate-200/70'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="text-[9.5px] text-slate-400 uppercase font-black block">
                        {it.category}
                      </span>
                      <span className="font-bold text-slate-800 block leading-snug">
                        {idx + 1}. {it.label}
                      </span>
                      {it.note && (
                        <span className="text-[11px] text-rose-600 font-semibold block mt-0.5">
                          Keterangan: {it.note}
                        </span>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex-shrink-0 ${
                        it.status === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : it.status === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {it.status}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl text-xs space-y-1">
              <span className="font-black text-slate-700 block uppercase tracking-wider text-[10px]">
                Catatan / Instruksi Operator:
              </span>
              <p className="text-slate-600 font-medium">{selectedDetail.catatan || 'Tidak ada catatan khusus.'}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="text-xs">
                <span className="text-slate-400 font-medium">Kesimpulan: </span>
                <span className={`font-black ${
                  selectedDetail.result === 'RFU' ? 'text-emerald-600' : selectedDetail.result === 'RWN' ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {selectedDetail.result || selectedDetail.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
