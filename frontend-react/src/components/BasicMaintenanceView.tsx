import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  Droplets,
  Wrench,
  Hammer,
  Zap,
  CheckCircle2,
  FileText,
  History,
  Calendar,
  User,
  Clock,
  LayoutDashboard,
  Truck,
  Layers,
  Sparkles,
  Printer,
  ChevronRight,
  TrendingUp,
  CircleDot,
  AlertCircle,
  BarChart3,
  Disc,
  Trash2,
  Check,
  ArrowRight,
  Database,
  X
} from 'lucide-react';
import { Equipment, MaintenanceWeek } from '../types';
import { api } from '../services/api';

export type BMCategory =
  | 'bm_dashboard'
  | 'bm_inspection'
  | 'bm_greasing'
  | 'bm_washing'
  | 'bm_ac_electrical'
  | 'bm_bucket_blade'
  | 'bm_undercarriage'
  | 'bm_retorque'
  | 'bm_tyre'
  // Backward compatibility aliases
  | 'pm_washing'
  | 'pm_greasing'
  | 'pm_inspection'
  | 'pm_torque'
  | 'pm_battery';

interface BasicMaintenanceViewProps {
  category?: BMCategory;
  equipments: Equipment[];
  pmRecords?: any[];
  maintenanceWeeks?: MaintenanceWeek[];
  onRefresh: () => void;
  onNavigate?: (tab: string) => void;
}

export type EquipmentCategory = 'EXCAVATOR' | 'DUMP_TRUCK' | 'BULLDOZER' | 'WHEEL_LOADER' | 'GENSET' | 'OTHER';

export const getEquipmentCategory = (eq?: Equipment | null, unitNoFallback?: string): EquipmentCategory => {
  const no = (eq?.equip_no || eq?.no_unit || unitNoFallback || '').toUpperCase();
  const model = (eq?.model || '').toUpperCase();
  const type = (eq?.tipe || eq?.type || eq?.unit_type || '').toUpperCase();

  // 1. Direct category / type keywords
  if (type.includes('EXCAVATOR') || model.includes('EXCAVATOR')) return 'EXCAVATOR';
  if (type.includes('DUMP') || type.includes('TRUCK') || type.includes('HAULER') || model.includes('DUMP') || model.includes('TRUCK')) return 'DUMP_TRUCK';
  if (type.includes('DOZER') || type.includes('BULLDOZER') || model.includes('DOZER')) return 'BULLDOZER';
  if (type.includes('LOADER') || model.includes('LOADER')) return 'WHEEL_LOADER';
  if (type.includes('GENSET') || model.includes('GENSET')) return 'GENSET';

  // 2. Unit Number Prefix
  if (no.startsWith('EX-') || no.startsWith('EX')) return 'EXCAVATOR';
  if (no.startsWith('DT-') || no.startsWith('DT') || no.startsWith('WT-') || no.startsWith('WT') || no.startsWith('ST-') || no.startsWith('ST')) return 'DUMP_TRUCK';
  if (no.startsWith('DZ-') || no.startsWith('DZ') || no.startsWith('BD-')) return 'BULLDOZER';
  if (no.startsWith('WL-') || no.startsWith('SL-') || no.startsWith('WL') || no.startsWith('SL')) return 'WHEEL_LOADER';
  if (no.startsWith('GST-') || no.startsWith('GEN-')) return 'GENSET';

  // 3. Model number heuristics
  if (/^(PC|CAT\s*3|HX|SY|DX|ZX|SK|R)/i.test(model) || model.includes('PC') || model.includes('320') || model.includes('330') || model.includes('390') || model.includes('1250') || model.includes('220')) return 'EXCAVATOR';
  if (/^(HD|SHACMAN|QUESTER|FAW|HINO|F3000|CWE|FM|ACTROS)/i.test(model)) return 'DUMP_TRUCK';
  if (/^(D\d|D8|D6|D7|D9|D375|D155|ZD|SEM\s*822)/i.test(model)) return 'BULLDOZER';
  if (/^(WA|SEM\s*6|CLG|T-930|FL955|BOBCAT|S570)/i.test(model)) return 'WHEEL_LOADER';
  if (/^(VG|CUMMINS|PERKINS|GEN)/i.test(model)) return 'GENSET';

  return 'OTHER';
};

export const getCategoryLabel = (cat: EquipmentCategory): string => {
  switch (cat) {
    case 'EXCAVATOR': return 'Excavator (Track Unit)';
    case 'DUMP_TRUCK': return 'Dump Truck (Wheeled Unit)';
    case 'BULLDOZER': return 'Bulldozer (Track Unit)';
    case 'WHEEL_LOADER': return 'Wheel Loader (Wheeled Unit)';
    case 'GENSET': return 'Genset / Stationary Plant';
    default: return 'Armada Tambang Umum';
  }
};

export const getCategoryHighlight = (cat: EquipmentCategory, subModuleId: string): string => {
  switch (subModuleId) {
    case 'bm_bucket_blade':
      if (cat === 'EXCAVATOR') return 'Inspeksi Tooth Bucket, Adapter, Lip Plate, Side Cutter & Pin Retainer';
      if (cat === 'DUMP_TRUCK') return 'Inspeksi Baut Roda (Wheel Nut), Velg Rim, Liner Vessel Dump Body & Silinder Hoist';
      if (cat === 'BULLDOZER') return 'Inspeksi Cutting Edge Blade, Corner Bit, Push Arm & Ripper Shank';
      if (cat === 'WHEEL_LOADER') return 'Inspeksi Cutting Edge Bucket Loader, Spill Guard & Center Articulation Hitch';
      return 'Inspeksi Struktur Rangka, Base Mounting & Kanopi Proteksi';

    case 'bm_undercarriage':
      if (cat === 'EXCAVATOR' || cat === 'BULLDOZER') return 'Pembersihan endapan mud packing di frame track roller, recoil spring, idler & sprocket';
      if (cat === 'DUMP_TRUCK') return 'Pembersihan lumpur padat pada sasis ganda (twin rail), spakbor roda, tromol rem & ruang ban ganda';
      if (cat === 'WHEEL_LOADER') return 'Pembersihan lumpur di center hitch artikulasi, axle depan/belakang & caliper disc brake';
      return 'Pembersihan tumpahan oli/solar, kisi radiator fin, dan pelat skid base frame';

    case 'bm_retorque':
      if (cat === 'EXCAVATOR' || cat === 'BULLDOZER') return 'Audit torsi baut track shoe (580 Nm), baut sprocket segments & final drive';
      if (cat === 'DUMP_TRUCK') return 'Audit torsi baut roda wheel nuts (850 Nm), flange propeller shaft & baut U-bolt suspensi';
      if (cat === 'WHEEL_LOADER') return 'Audit torsi baut roda loader (900 Nm), axle mounting bolts & center pin retainer';
      return 'Audit torsi baut kopling flywheel engine, mounting alternator & terminal busbar daya';

    case 'bm_tyre':
      if (cat === 'DUMP_TRUCK' || cat === 'WHEEL_LOADER') return 'Pemeriksaan tekanan angin ban (105 PSI), tread depth mm, luka sidewall & rim lock ring';
      if (cat === 'EXCAVATOR' || cat === 'BULLDOZER') return 'Pemeriksaan kekenduran rantai track (track sag 25-35 mm), silinder adjuster & grouser shoe';
      return 'Pemeriksaan peredam getaran anti-vibration mount & resistansi grounding pembumian';

    case 'bm_inspection':
      if (cat === 'EXCAVATOR') return 'Fokus: Silinder Boom/Arm/Bucket, swing machinery, keretakan boom/arm & level oli hidrolik';
      if (cat === 'DUMP_TRUCK') return 'Fokus: Steering linkage, suspensi depan/belakang, silinder hoist dump & tangki angin rem';
      if (cat === 'BULLDOZER') return 'Fokus: Silinder lift/tilt blade, ripper, equalizer bar & transmisi powershift';
      if (cat === 'WHEEL_LOADER') return 'Fokus: Articulation hitch, lift & tilt cylinders, transmisi torque converter & akumulator rem';
      return 'Fokus: Tekanan oli mesin, sensor pengaman, alternator charging & switch pemutus darurat';

    case 'bm_greasing':
      if (cat === 'EXCAVATOR') return 'Pelumasan grease: Pin boom foot, arm, bucket linkage, H-link & swing circle bearing';
      if (cat === 'DUMP_TRUCK') return 'Pelumasan grease: King pin, tie rod ball joint, propeller shaft U-joint & hoist trunnion';
      if (cat === 'BULLDOZER') return 'Pelumasan grease: Push arm trunnion, tilt cylinder ball joint, equalizer bar & ripper';
      if (cat === 'WHEEL_LOADER') return 'Pelumasan grease: Bucket hinge, bellcrank, articulation hitch bearings & prop shaft';
      return 'Pelumasan grease: Fan hub bearing, water pump idler & engsel pintu kanopi silent';

    case 'bm_washing':
      if (cat === 'EXCAVATOR' || cat === 'BULLDOZER') return 'Pencucian undercarriage bertekanan tinggi, track frame, radiator fin & belly pan';
      if (cat === 'DUMP_TRUCK' || cat === 'WHEEL_LOADER') return 'Pencucian roda, kolong sasis, tromol rem, ruang muatan vessel / bucket & radiator fin';
      return 'Pembersihan kisi radiator fin tekanan rendah & degreasing tumpahan solar pada base skid';

    default:
      return 'Pemeriksaan fungsional sesuai standar operasional pabrikan (OEM)';
  }
};

// Base registry of the 8 Basic Maintenance Pillars
export const bmModuleConfig: Record<string, {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  icon: React.FC<any>;
  badgeColor: string;
  items: string[];
}> = {
  bm_inspection: {
    id: 'bm_inspection',
    name: 'Weekly Inspection',
    shortName: '1. WEEKLY INSPECTION',
    subtitle: 'Pemeriksaan rutin mingguan kebocoran fluida, level oli, integritas rangka, dan instrumen kabin',
    icon: ShieldCheck,
    badgeColor: 'text-sky-600 bg-sky-50 border-sky-200',
    items: [
      'Pemeriksaan Level Oli Mesin, Hidrolik & Transmisi',
      'Pemeriksaan Radiator Coolant, Hoses & Water Pump',
      'Inspeksi Kebocoran Silinder & Selang Hidrolik',
      'Pemeriksaan Keretakan Struktur Rangka & Sasis',
      'Pengujian Instrumen Monitor Kabin & Warning Light',
      'Pemeriksaan Safety Device: Klakson, Rotary Lamp & APAR'
    ]
  },
  bm_greasing: {
    id: 'bm_greasing',
    name: 'Daily Greasing',
    shortName: '2. DAILY GREASING',
    subtitle: 'Pelumasan harian grease NLGI 2 EP pada seluruh titik pin, bushing pergerakan, dan bearing artikulasi',
    icon: Wrench,
    badgeColor: 'text-amber-600 bg-amber-50 border-amber-200',
    items: [
      'Greasing Pin Engsel Utama & Dudukan Silinder',
      'Greasing Sambungan Linkage & Silinder Pergerakan',
      'Greasing Bearing Artikulasi / Swing Circle',
      'Greasing Sambungan Drive Shaft / Idler Guide Bracket',
      'Pengecekan Level Pelumas Kompartemen Tertutup'
    ]
  },
  bm_washing: {
    id: 'bm_washing',
    name: 'Washing & Cleaning',
    shortName: '3. WASHING',
    subtitle: 'Pencucian bodi alat, undercarriage/sasis bertekanan tinggi, pembersihan kisi radiator dari lumpur & batubara',
    icon: Droplets,
    badgeColor: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    items: [
      'High-Pressure Water Jet Undercarriage / Roda & Kolong Sasis',
      'Pembersihan Kisi Radiator Fin, Oil Cooler & Aftercooler',
      'Pembersihan Lumpur di Sekitar Engine Bay & Pompa Hidrolik',
      'Pembersihan Kabin Operator, Kaca Depan & Spion',
      'Pemeriksaan Rembesan Fluida Pasca Pencucian Bersih'
    ]
  },
  bm_ac_electrical: {
    id: 'bm_ac_electrical',
    name: 'AC & Electrical',
    shortName: '4. AC & ELECTRICAL',
    subtitle: 'Pengujian performa AC kabin, pengisian alternator 28V, motor starter, dan kebersihan terminal aki',
    icon: Zap,
    badgeColor: 'text-purple-600 bg-purple-50 border-purple-200',
    items: [
      'Pemeriksaan Suhu Dingin AC & Pembersihan Filter Kabin',
      'Pengukuran Tegangan Alternator Charging (27.5V - 28.5V)',
      'Inspeksi Tegangan Aki / Battery Pack (Min. 25.2V)',
      'Pembersihan Kerak Asam & Greasing Terminal Aki',
      'Pengujian Starting Motor & Kekencangan V-Belt Alternator',
      'Pemeriksaan Wiring Harness dari Gesekan Bodi Tajam'
    ]
  },
  bm_bucket_blade: {
    id: 'bm_bucket_blade',
    name: 'Bucket / Blade / Wheel & Vessel',
    shortName: '5. BUCKET / BLADE / WHEEL',
    subtitle: 'Daftar pemeriksaan adaptif: Excavator (Bucket), Dump Truck (Wheel & Vessel), Dozer (Blade), Loader (Loader Bucket)',
    icon: Hammer,
    badgeColor: 'text-orange-600 bg-orange-50 border-orange-200',
    items: [
      'Pengukuran Keausan Tooth Bucket / Cutting Edge / Baut Roda',
      'Pemeriksaan Kekencangan Baut / Pin Pengunci Attachment',
      'Inspeksi Keretakan Struktur Lip Plate / Vessel / Moldboard',
      'Pemeriksaan Pin Hinge & Silinder Attachment'
    ]
  },
  bm_undercarriage: {
    id: 'bm_undercarriage',
    name: 'Clean Up Undercarriage / Chassis',
    shortName: '6. CLEAN UP UC / CHASSIS',
    subtitle: 'Pembersihan endapan material padat (mud packing) pada frame track undercarriage atau sasis roda & spakbor',
    icon: Layers,
    badgeColor: 'text-teal-600 bg-teal-50 border-teal-200',
    items: [
      'Pembersihan Lumpur Padat di Frame Track Roller / Kolong Sasis',
      'Pengeluaran Batu Terselip di Antara Track Shoe / Ban Ganda',
      'Pembersihan Endapan Tanah di Ruang Recoil Spring / Tromol Rem',
      'Pembersihan Lumpur Mengeras di Sekitar Sprocket / Axle Housing',
      'Pemeriksaan Keausan Komponen Fisik Pasca Pembersihan'
    ]
  },
  bm_retorque: {
    id: 'bm_retorque',
    name: 'Retorque Component (UC / Wheel)',
    shortName: '7. RETORQUE (UC / WHEEL)',
    subtitle: 'Audit kekencangan torsi baut track shoe (580 Nm) pada unit track, atau baut roda (850 Nm) pada unit roda',
    icon: Wrench,
    badgeColor: 'text-rose-600 bg-rose-50 border-rose-200',
    items: [
      'Audit Torsi Baut Track Shoe (580 Nm) / Baut Roda (850 Nm)',
      'Pengecekan Torsi Baut Sprocket Segments / Flange Drive Shaft',
      'Pemeriksaan Kekencangan Baut Final Drive / Suspensi U-Bolt',
      'Pemberian Tanda Marking Cat Torsi (Torque Seal Inspection)'
    ]
  },
  bm_tyre: {
    id: 'bm_tyre',
    name: 'Tyre & Track Sag Inspection',
    shortName: '8. TYRE / TRACK SAG',
    subtitle: 'Inspeksi tekanan angin & kembangan ban (unit roda) atau kekenduran rantai track sag & grouser (unit track)',
    icon: Disc,
    badgeColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    items: [
      'Pengukuran Tekanan Angin Ban (105 PSI) / Track Sag (25-35 mm)',
      'Pengukuran Sisa Kedalaman Kembangan Ban / Ketinggian Grouser Shoe',
      'Inspeksi Visual Luka Sayatan Sidewall / Deformasi Track Shoe',
      'Pemeriksaan Kondisi Velg Rim & Lock Ring / Idler Guide Bracket',
      'Audit Torsi Baut Roda / Grease Valve Silinder Tensioner'
    ]
  }
};

/**
 * Returns specialized module information & checklist items strictly differentiated by machine model/family
 */
export const getAdaptedModuleConfig = (
  moduleId: string,
  category: EquipmentCategory = 'EXCAVATOR'
): {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  icon: React.FC<any>;
  badgeColor: string;
  items: string[];
} => {
  const base = bmModuleConfig[moduleId] || bmModuleConfig.bm_inspection;

  switch (moduleId) {
    // ================= 1. WEEKLY INSPECTION =================
    case 'bm_inspection':
      if (category === 'EXCAVATOR') {
        return {
          ...base,
          name: 'Weekly Inspection (Excavator)',
          shortName: '1. INSPEKSI EXCAVATOR',
          subtitle: 'Pemeriksaan rutin mingguan kebocoran silinder boom/arm/bucket, swing machinery, radiator coolant & level oli hidrolik',
          items: [
            'Pemeriksaan Level Oli Mesin, Oli Hidrolik & Swing Machinery Bath',
            'Pemeriksaan Radiator Coolant, Selang Hoses, Fan Belt & Water Pump',
            'Inspeksi Kebocoran Silinder Boom, Arm, dan Bucket serta Hoses Hidrolik',
            'Pemeriksaan Keretakan Struktur Boom, Arm, H-Link & Track Frame',
            'Pengujian Instrumen Monitor Kabin, Warning Light & Swing Parking Brake',
            'Pemeriksaan Safety Device: Klakson, Rotary Lamp, Travel Alarm & APAR'
          ]
        };
      }
      if (category === 'DUMP_TRUCK') {
        return {
          ...base,
          name: 'Weekly Inspection (Dump Truck)',
          shortName: '1. INSPEKSI DUMP TRUCK',
          subtitle: 'Pemeriksaan steering linkage, suspensi depan/belakang, silinder hoist dump body, tangki angin rem & roda',
          icon: Truck,
          items: [
            'Pemeriksaan Level Oli Mesin, Transmisi, Transfer Case & Differensial Axle',
            'Inspeksi Tekanan Udara Tangki Angin Rem (Air Brake Tank: Min 8 Bar)',
            'Pemeriksaan Suspensi Depan (Front Strut) & Pegas Daun Belakang (Leaf Spring)',
            'Inspeksi Kebocoran Silinder Hoist Dump Body & Katup Kontrol Hidrolik',
            'Pengujian Sistem Kemudi (Steering Linkage, Drag Link & Power Steering)',
            'Pemeriksaan Safety Device: Back Alarm Mundur, Lampu Kerja, Rotary & APAR'
          ]
        };
      }
      if (category === 'BULLDOZER') {
        return {
          ...base,
          name: 'Weekly Inspection (Bulldozer)',
          shortName: '1. INSPEKSI DOZER',
          subtitle: 'Pemeriksaan silinder lift/tilt blade, ripper, equalizer bar, transmisi powershift & steering brake',
          items: [
            'Pemeriksaan Level Oli Mesin, Transmisi Powershift & Bevel Gear Case',
            'Inspeksi Radiator Coolant, Fan Blades & Level Tangki Oli Hidrolik',
            'Pemeriksaan Kebocoran Silinder Lift Blade, Tilt Blade & Ripper',
            'Inspeksi Struktur Equalizer Bar, Pivot Shaft Pins & Blade Push Arm',
            'Pengujian Brake Steering Pedal, Inching Pedal & Transmission Shifter',
            'Pemeriksaan Safety ROPS/FOPS Canopy, Rotary Lamp & APAR'
          ]
        };
      }
      if (category === 'WHEEL_LOADER') {
        return {
          ...base,
          name: 'Weekly Inspection (Wheel Loader)',
          shortName: '1. INSPEKSI LOADER',
          subtitle: 'Pemeriksaan articulated center joint, silinder lift/tilt, sistem rem hidrolik & transmisi torque converter',
          items: [
            'Pemeriksaan Level Oli Mesin, Transmission Torque Converter & Oli Hidrolik',
            'Inspeksi Kebocoran Silinder Lift Arm, Tilt Bucket & Steering Cylinders',
            'Pemeriksaan Tekanan Angin & Akumulator Sistem Pengereman (Brake Accumulator)',
            'Inspeksi Keretakan Struktur Lift Arm, Bellcrank & Pin Articulation Joint',
            'Pengujian Transmisi Forward/Reverse Shifter & Brake Neutralizer Switch',
            'Pemeriksaan Lampu Kerja Depan/Belakang, Rotary Lamp & Klakson Mundur'
          ]
        };
      }
      return {
        ...base,
        name: 'Weekly Inspection (Genset / Support)',
        shortName: '1. INSPEKSI HARIAN',
        subtitle: 'Pemeriksaan oli mesin, alternator voltage, coolant level, fuel filter & safety circuit breaker',
        items: [
          'Pemeriksaan Level Oli Mesin & Sensor Tekanan Oli (Oil Pressure Gauge)',
          'Pemeriksaan Radiator Coolant, Fan Belt & Selang Karet Radiator',
          'Inspeksi Kebocoran Jalur Bahan Bakar Solar & Sedimenter Water Separator',
          'Pemeriksaan Baterai Starter, Indikator Pengisian & Earth Grounding Rod',
          'Pengujian Tombol Emergency Stop & Modul Kontrol Generator (DeepSea / ComAp)',
          'Pemeriksaan Sistem Proteksi Circuit Breaker (MCCB) & Kerapian Jalur Kabel'
        ]
      };

    // ================= 2. DAILY GREASING =================
    case 'bm_greasing':
      if (category === 'EXCAVATOR') {
        return {
          ...base,
          name: 'Daily Greasing (Excavator)',
          shortName: '2. GREASING EXCAVATOR',
          subtitle: 'Pelumasan grease NLGI 2 EP pada pin boom, arm, bucket linkage, dan swing circle bearing',
          items: [
            'Greasing Boom Foot Pin & Boom Cylinder Base Pin',
            'Greasing Arm Cylinder Pin & Boom-to-Arm Connection Pin',
            'Greasing Bucket Linkage, H-Link, Bucket Cylinder & Bucket Pin',
            'Greasing Swing Circle Bearing (Upper & Lower) & Swing Pinion Teeth',
            'Greasing Track Tensioner & Idler Guide Bracket',
            'Pengecekan Bak Oli Swing Machinery Bath & Center Joint'
          ]
        };
      }
      if (category === 'DUMP_TRUCK') {
        return {
          ...base,
          name: 'Daily Greasing (Dump Truck)',
          shortName: '2. GREASING DUMP TRUCK',
          subtitle: 'Pelumasan grease chassis pada king pin, tie rod, propeller shaft U-joint, dan hoist trunnion',
          icon: Truck,
          items: [
            'Greasing King Pin Depan Kiri & Kanan (Front Steering Knuckle)',
            'Greasing Tie Rod End, Drag Link Ball Joint & Steering Idler Arm',
            'Greasing Universal Joint & Slip Joint Propeller Shaft Depan & Belakang',
            'Greasing Trunnion Shaft & Dudukan Silinder Hoist Dump Body',
            'Greasing Pen Pegas Daun (Spring Shackle Pin) Depan & Belakang',
            'Greasing Mekanisme Engsel Pintu Belakang Vessel (Tailgate Hinge)'
          ]
        };
      }
      if (category === 'BULLDOZER') {
        return {
          ...base,
          name: 'Daily Greasing (Bulldozer)',
          shortName: '2. GREASING DOZER',
          subtitle: 'Pelumasan harian pin push arm trunnion, silinder tilt/lift blade, equalizer bar, dan ripper',
          items: [
            'Greasing Blade Lift Cylinder Pins & Tilt Cylinder Ball Joint',
            'Greasing Push Arm Trunnion Left & Right Pivot',
            'Greasing Equalizer Bar Center Pin & Side Bushing Pads',
            'Greasing Ripper Lift & Tilt Cylinder Mounting Pins',
            'Greasing Ripper Linkage Beam Pivot Pins',
            'Greasing Track Adjuster Recoil Spring Pilot'
          ]
        };
      }
      if (category === 'WHEEL_LOADER') {
        return {
          ...base,
          name: 'Daily Greasing (Wheel Loader)',
          shortName: '2. GREASING LOADER',
          subtitle: 'Pelumasan harian pin bucket hinge, bellcrank, lift arm pivot, dan center articulation hitch',
          items: [
            'Greasing Bucket Hinge Lower Pins & Tilt Linkage Bellcrank Pin',
            'Greasing Lift Arm Frame Pivot Pins & Lift Cylinder Pins',
            'Greasing Upper & Lower Center Articulation Hitch Bearings',
            'Greasing Steering Cylinder Rod & Barrel Eye Pins',
            'Greasing Propeller Shaft Universal Joints & Center Support Bearing',
            'Greasing Rear Axle Oscillation Trunnion Pivot Bushing'
          ]
        };
      }
      return {
        ...base,
        items: [
          'Greasing Fan Hub Bearing & Water Pump Idler Pulley',
          'Pelumasan Engsel Pintu Kanopi Silent Enclosure & Lock Latches',
          'Pemeriksaan Pelumasan Governor Linkage & Fuel Shut-off Lever'
        ]
      };

    // ================= 3. WASHING =================
    case 'bm_washing':
      if (category === 'EXCAVATOR' || category === 'BULLDOZER') {
        return {
          ...base,
          name: 'Washing & Cleaning (Track Equipment)',
          shortName: '3. WASHING TRACK',
          subtitle: 'Pencucian undercarriage bertekanan tinggi, pembersihan kisi radiator dari lumpur & batubara padat',
          items: [
            'High-Pressure Water Jet Undercarriage, Track Shoe & Track Frame',
            'Pembersihan Kisi Radiator Fin, Hydraulic Oil Cooler & Intercooler',
            'Pembersihan Lumpur Padat di Bawah Belly Pan & Ruang Pompa Hidrolik',
            'Pencucian Kabin Operator, Kaca Depan, Wiper & Spion Blind Spot',
            'Pemeriksaan Visual Rembesan Oli/Coolant Pasca Pencucian Bersih'
          ]
        };
      }
      return {
        ...base,
        name: 'Washing & Cleaning (Wheeled Equipment)',
        shortName: '3. WASHING WHEEL',
        subtitle: 'Pencucian roda, kolong sasis, tromol rem, kisi radiator fin, dan ruang muatan dump vessel / bucket',
        icon: Droplets,
        items: [
          'High-Pressure Water Jet Roda, Velg, Tromol Rem & Kolong Sasis',
          'Pembersihan Lumpur di Ruang Mesin, Kisi Radiator & Air Tank',
          'Pencucian Ruang Dalam Bak / Vessel Dump Body dari Sisa Muatan Tambang',
          'Pembersihan Kabin Operator, Dashboard, Kaca Spion & Tangga Akses',
          'Pemeriksaan Rembesan Fluida, Baut Roda & Kebocoran Udara Pasca Cuci'
        ]
      };

    // ================= 4. AC & ELECTRICAL =================
    case 'bm_ac_electrical':
      return {
        ...base,
        name: 'AC & Electrical System',
        shortName: '4. AC & ELECTRICAL',
        subtitle: 'Pengujian performa AC kabin, pengisian alternator 28V, motor starter, dan kebersihan terminal aki',
        items: [
          'Pemeriksaan Suhu Hembusan Dingin AC & Pembersihan Filter Udara Kabin',
          'Pengukuran Tegangan Pengisian Alternator (Spesifikasi: 27.5V - 28.5V)',
          'Inspeksi Tegangan Aki / Battery Bank (Tegangan Min: 25.2V)',
          'Pembersihan Kerak Asam Sulfat & Pengolesan Petroleum Jelly Terminal Aki',
          'Pengujian Motor Starter & Kekencangan V-Belt Kipas / Alternator',
          'Inspeksi Kerapian Jalur Wiring Harness dari Gesekan Bodi Logam Tajam'
        ]
      };

    // ================= 5. BUCKET / BLADE / WHEEL & VESSEL =================
    case 'bm_bucket_blade':
      if (category === 'EXCAVATOR') {
        return {
          ...base,
          name: 'Bucket Inspection',
          shortName: '5. BUCKET EXCAVATOR',
          subtitle: 'Pemeriksaan keausan tooth bucket, adapter, lip plate, side cutter, dan pin retainer bucket excavator',
          icon: Hammer,
          badgeColor: 'text-orange-600 bg-orange-50 border-orange-200',
          items: [
            'Pengukuran Sisa Ketebalan Tooth Bucket & Adapter',
            'Pemeriksaan Kekencangan Pin Retainer Tooth Bucket',
            'Inspeksi Keretakan Side Cutter & Lip Shroud Bucket',
            'Pemeriksaan Pin & Bushing H-Linkage Bucket',
            'Inspeksi Keretakan Pengelasan Gusset & Bottom Plate Bucket'
          ]
        };
      }
      if (category === 'DUMP_TRUCK') {
        return {
          ...base,
          name: 'Wheel & Vessel Body Inspection',
          shortName: '5. WHEEL & VESSEL TRUCK',
          subtitle: 'Pemeriksaan baut roda (wheel nut), velg rim, liner vessel dump body, hoist cylinder pin, dan safety lock pin',
          icon: Truck,
          badgeColor: 'text-blue-600 bg-blue-50 border-blue-200',
          items: [
            'Pemeriksaan Kekencangan Baut Roda (Wheel Nut) Depan & Belakang',
            'Inspeksi Keretakan Rim Flange, Lock Ring & Velg Roda',
            'Pemeriksaan Keausan Pelat Lantai & Dinding Vessel (Liner)',
            'Inspeksi Pin & Trunnion Silinder Hoist Dump Body',
            'Pemeriksaan Canopy Protector & Karet Penahan (Rubber Pad) Sasis',
            'Pengujian Safety Pin / Lock Bar Dump Body Terpasang Kuat'
          ]
        };
      }
      if (category === 'BULLDOZER') {
        return {
          ...base,
          name: 'Blade & Ripper Inspection',
          shortName: '5. BLADE & RIPPER DOZER',
          subtitle: 'Pengukuran sisa cutting edge blade, corner bit, push arm trunnion, serta shank & tooth tip ripper',
          icon: Hammer,
          badgeColor: 'text-amber-600 bg-amber-50 border-amber-200',
          items: [
            'Pengukuran Sisa Ketebalan Reversible Cutting Edge Blade',
            'Pemeriksaan Keausan & Baut Corner Bit Dozer Blade',
            'Inspeksi Pin Push Arm, Brace & Hydraulic Tilt Cylinder',
            'Pemeriksaan Shank Ripper, Tooth Tip & Pin Pengunci',
            'Pemeriksaan Keretakan Struktur Moldboard Blade & Beam Ripper'
          ]
        };
      }
      if (category === 'WHEEL_LOADER') {
        return {
          ...base,
          name: 'Loader Bucket & Articulation Joint',
          shortName: '5. BUCKET LOADER',
          subtitle: 'Pemeriksaan cutting edge bucket loader, spill guard, bellcrank pin, dan pin articulation joint',
          icon: Hammer,
          badgeColor: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          items: [
            'Pengukuran Sisa Bolt-on Cutting Edge / Teeth Bucket Loader',
            'Pemeriksaan Baut Pengikat Cutting Edge Segmen Bucket',
            'Pemeriksaan Pin Hinge Bucket & Bellcrank Tilt Linkage',
            'Pemeriksaan Spill Guard & Wear Plate Bawah Bucket',
            'Inspeksi Center Articulation Pin & Oscillation Hitch Bearing'
          ]
        };
      }
      return {
        ...base,
        name: 'Base Frame & Enclosure Inspection',
        shortName: '5. FRAME & ENCLOSURE',
        subtitle: 'Pemeriksaan mounting mesin, peredam getaran (anti-vibration mount), engsel kanopi, dan exhaust manifold',
        items: [
          'Pemeriksaan Baut Mounting Engine & Alternator ke Base Frame',
          'Inspeksi Kondisi Karet Rubber Anti-Vibration Damper',
          'Pemeriksaan Baut Exhaust Manifold & Klem Sambungan Silencer',
          'Inspeksi Keretakan Struktur Kanopi Silent Enclosure',
          'Pemeriksaan Grounding Rod & Baut Terminal Pengaman Rangka'
        ]
      };

    // ================= 6. CLEAN UP UNDERCARRIAGE / CHASSIS =================
    case 'bm_undercarriage':
      if (category === 'EXCAVATOR' || category === 'BULLDOZER') {
        return {
          ...base,
          name: 'Clean Up Undercarriage',
          shortName: '6. CLEAN UP UC',
          subtitle: 'Pembersihan endapan material padat (mud packing), batu tajam terselip, dan kotoran batubara pada frame undercarriage',
          icon: Layers,
          badgeColor: 'text-teal-600 bg-teal-50 border-teal-200',
          items: [
            'Pembersihan Lumpur Padat di Frame Track Roller & Track Frame',
            'Pengeluaran Batu Terselip di Antara Track Shoe, Idler & Link',
            'Pembersihan Endapan Tanah di Ruang Recoil Spring & Silinder Tension',
            'Pembersihan Lumpur Mengeras di Sekitar Sprocket Teeth Segments',
            'Pemeriksaan Keausan Flange Track Roller & Carrier Roller Pasca Cuci'
          ]
        };
      }
      if (category === 'DUMP_TRUCK') {
        return {
          ...base,
          name: 'Clean Up Chassis & Wheel Arches',
          shortName: '6. CLEAN UP CHASSIS',
          subtitle: 'Pembersihan lumpur padat pada sasis ganda (twin rail chassis), ruang spakbor roda, tromol rem, dan mekanisme hoist',
          icon: Truck,
          badgeColor: 'text-blue-600 bg-blue-50 border-blue-200',
          items: [
            'Pembersihan Lumpur Padat di Ruang Antara Ban Ganda (Dual Wheel Stone Ejector)',
            'Pembersihan Endapan Tanah di Spakbor (Fender) & Wheel Arches',
            'Pembersihan Lumpur di Sekitar Brake Chamber & Tromol Rem (Brake Drum)',
            'Pembersihan Akumulasi Lumpur pada Crossmember Sasis & Gearbox',
            'Pembersihan Lumpur di Sekitar Dudukan Silinder Hoist & Tangki Bahan Bakar'
          ]
        };
      }
      if (category === 'WHEEL_LOADER') {
        return {
          ...base,
          name: 'Clean Up Loader Frame & Articulation',
          shortName: '6. CLEAN UP LOADER',
          subtitle: 'Pembersihan lumpur padat di area center hitch artikulasi, axle depan/belakang, dan ruang transmisi',
          icon: Layers,
          badgeColor: 'text-teal-600 bg-teal-50 border-teal-200',
          items: [
            'Pembersihan Lumpur Padat di Area Center Articulation Joint & Prop Shaft',
            'Pembersihan Tanah Kering di Sekitar Axle Housing Depan & Belakang',
            'Pembersihan Lumpur pada Ruang Disc Brake & Caliper Roda Loader',
            'Pembersihan Area Belly Guard Bawah Mesin & Torque Converter',
            'Pembersihan Endapan Material pada Silinder Steering & Lift Arm Base'
          ]
        };
      }
      return {
        ...base,
        name: 'Clean Up Engine Bay & Skid Base',
        shortName: '6. CLEAN UP SKID',
        subtitle: 'Pembersihan debu, tumpahan oli, kisi radiator fin, dan pembuangan drainase skid pan',
        items: [
          'Pembersihan Debu & Minyak pada Blok Mesin & Generator Alternator',
          'Pembersihan Tumpahan Solar/Oli pada Pelat Penampung (Bundy Skid)',
          'Pembersihan Kisi Radiator Fin dari Serangga & Kotoran Terbang',
          'Pengecekan Kebersihan Selang Pembuangan Crankcase Breather'
        ]
      };

    // ================= 7. RETORQUE COMPONENT (UC / WHEEL) =================
    case 'bm_retorque':
      if (category === 'EXCAVATOR' || category === 'BULLDOZER') {
        return {
          ...base,
          name: 'Retorque Component UC',
          shortName: '7. RETORQUE UC',
          subtitle: 'Audit kekencangan torsi baut track shoe (580 Nm), sprocket mounting bolts, dan final drive bolts',
          icon: Wrench,
          badgeColor: 'text-rose-600 bg-rose-50 border-rose-200',
          items: [
            'Audit Torsi Baut Track Shoe (Torque Spec: 580 Nm)',
            'Pengecekan Torsi Baut Sprocket Segments (Komatsu OEM / CAT)',
            'Pemeriksaan Kekencangan Baut Final Drive Housing & Cover',
            'Audit Torsi Baut Carrier Roller & Track Roller Mountings',
            'Pemberian Tanda Marking Cat Torsi (Torque Seal Inspection)'
          ]
        };
      }
      if (category === 'DUMP_TRUCK') {
        return {
          ...base,
          name: 'Retorque Wheel Nuts & Suspension',
          shortName: '7. RETORQUE WHEEL',
          subtitle: 'Audit kekencangan baut roda (850 Nm), baut flange propeller shaft, baut U-bolt suspensi pegas daun, dan steering arm',
          icon: Disc,
          badgeColor: 'text-blue-600 bg-blue-50 border-blue-200',
          items: [
            'Audit Torsi Baut Roda (Wheel Nut Torque: 850 Nm) Pola Menyilang',
            'Pemeriksaan Torsi Baut Flange Propeller Shaft / Drive Shaft (180 Nm)',
            'Audit Kekencangan Baut U-Bolt Suspensi Pegas Daun (Leaf Spring)',
            'Pengecekan Torsi Baut Mounting Trunnion Shaft & Torque Rod',
            'Audit Torsi Baut Pitman Arm & Steering Gearbox Mounting',
            'Pemberian Tanda Cat Torsi (Torque Seal / Marking) pada Baut Roda'
          ]
        };
      }
      if (category === 'WHEEL_LOADER') {
        return {
          ...base,
          name: 'Retorque Wheel Rim & Drive Axle',
          shortName: '7. RETORQUE WHEEL',
          subtitle: 'Audit kekencangan baut roda loader (Wheel Rim Nuts 900 Nm), axle mounting bolts, dan drive shaft flange',
          icon: Disc,
          badgeColor: 'text-rose-600 bg-rose-50 border-rose-200',
          items: [
            'Audit Torsi Baut Roda Loader (Wheel Rim Nut Torque: 900 Nm)',
            'Pemeriksaan Torsi Baut Dudukan Axle Depan (Rigid) & Belakang (Oscillating)',
            'Pengecekan Torsi Baut Flange Propeller Shaft Depan & Belakang',
            'Audit Torsi Baut Center Pin Articulation Hitch Retainer',
            'Pemberian Tanda Marking Cat Torsi pada Semua Baut Roda'
          ]
        };
      }
      return {
        ...base,
        name: 'Retorque Engine & Electrical Mounts',
        shortName: '7. RETORQUE MOUNTS',
        subtitle: 'Audit kekencangan baut kopling fleksibel, mounting generator, terminal kabel daya, dan baut manifold',
        items: [
          'Audit Torsi Baut Kopling Fleksibel (Flywheel Coupling Bolts)',
          'Pemeriksaan Torsi Baut Kaki Engine & Alternator ke Sasis',
          'Audit Kekencangan Baut Terminal Busbar & Kabel Daya Utama MCCB',
          'Pemeriksaan Baut Turbocharger & Flange Exhaust Manifold'
        ]
      };

    // ================= 8. TYRE / TRACK SAG =================
    case 'bm_tyre':
      if (category === 'DUMP_TRUCK' || category === 'WHEEL_LOADER') {
        return {
          ...base,
          name: 'Tyre & Rim Inspection',
          shortName: '8. TYRE INSPECTION',
          subtitle: 'Pemeriksaan tekanan angin ban (105 PSI), sisa kembangan (tread depth mm), sidewall cut, dan rim lock ring',
          icon: Disc,
          badgeColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
          items: [
            'Pengukuran Tekanan Angin Dingin Semua Ban (Tire Pressure: 105 PSI)',
            'Pengukuran Sisa Kedalaman Kembangan Ban (Tread Depth mm - Min 15mm)',
            'Inspeksi Visual Luka Sayatan Sidewall, Gelembung & Kerusakan Karet Tapak',
            'Pemeriksaan Kondisi Rim Flange, Bead Seat Band & Lock Ring Ban',
            'Pemeriksaan Batu Terselip di Antara Ban Ganda (Dual Tyre Clearance)',
            'Pengecekan Tutup Pentil Ban (Valve Cap) Terpasang Rapat & Anti-Bocor'
          ]
        };
      }
      if (category === 'EXCAVATOR' || category === 'BULLDOZER') {
        return {
          ...base,
          name: 'Track Sag & Shoe Inspection',
          shortName: '8. TRACK SAG & SHOE',
          subtitle: 'Pemeriksaan kekencangan rantai track (track sag), keausan grouser shoe, dan kelurusan track alignment',
          icon: Layers,
          badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
          items: [
            'Pengukuran Kekenduran Rantai Track (Track Sag: 25 - 35 mm)',
            'Pemeriksaan Grease Valve Silinder Tensioner Track (Cylinder Adjuster)',
            'Pengukuran Sisa Ketinggian Grouser Track Shoe (Grouser Height mm)',
            'Inspeksi Keretakan / Deformasi Bodi Track Shoe & Master Pin',
            'Pemeriksaan Kelurusan (Alignment) Track Frame & Idler Guide Clearance'
          ]
        };
      }
      return {
        ...base,
        name: 'Vibration Damper & Safety Grounding',
        shortName: '8. DAMPER & GROUND',
        subtitle: 'Pemeriksaan kondisi peredam getaran karet, grounding rod earth resistance, dan exhaust bellow',
        items: [
          'Pemeriksaan Keretakan Fisik Karet Damper Getaran (Vibration Mount)',
          'Pengujian Resistansi Grounding Arde Pembumian (Earth Resistance < 5 Ohm)',
          'Inspeksi Fleksibilitas Stainless Steel Exhaust Bellow Pipe',
          'Pengecekan Sensor Proteksi Getaran Berlebih (Over-Vibration Switch)'
        ]
      };

    default:
      return base;
  }
};

const getSubModuleSynonyms = (id: string): string[] => {
  switch (id) {
    case 'bm_inspection':
      return ['bm_inspection', 'weekly_inspection', 'inspection', 'weekly'];
    case 'bm_greasing':
      return ['bm_greasing', 'daily_greasing', 'greasing'];
    case 'bm_washing':
      return ['bm_washing', 'washing', 'cuci'];
    case 'bm_ac_electrical':
      return ['bm_ac_electrical', 'ac_electrical', 'electrical', 'battery'];
    case 'bm_bucket_blade':
      return ['bm_bucket_blade', 'bucket_blade', 'blade', 'bucket', 'vessel', 'wheel_vessel'];
    case 'bm_undercarriage':
      return ['bm_undercarriage', 'clean_undercarriage', 'undercarriage', 'chassis', 'clean_chassis'];
    case 'bm_retorque':
      return ['bm_retorque', 'retorque_uc', 'retorque', 'torque', 'wheel_torque', 'wheel_nuts'];
    case 'bm_tyre':
      return ['bm_tyre', 'tyre_inspection', 'tyre', 'tire', 'track_sag', 'track_shoe'];
    default:
      return [id];
  }
};

export const BasicMaintenanceView: React.FC<BasicMaintenanceViewProps> = ({
  category = 'bm_dashboard',
  equipments,
  pmRecords = [],
  maintenanceWeeks = [],
  onRefresh,
  onNavigate
}) => {
  // Normalize category mapping
  const normalizedCategory = useMemo(() => {
    if (category === 'pm_washing') return 'bm_washing';
    if (category === 'pm_greasing') return 'bm_greasing';
    if (category === 'pm_inspection') return 'bm_inspection';
    if (category === 'pm_torque') return 'bm_retorque';
    if (category === 'pm_battery') return 'bm_ac_electrical';
    return category;
  }, [category]);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'form' | 'history'>(
    normalizedCategory === 'bm_dashboard' ? 'dashboard' : 'form'
  );

  const [selectedSubModule, setSelectedSubModule] = useState<string>(
    normalizedCategory === 'bm_dashboard' ? 'bm_inspection' : normalizedCategory
  );

  // Reactively switch view whenever a sidebar sub-module is clicked
  useEffect(() => {
    if (normalizedCategory === 'bm_dashboard') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('form');
      setSelectedSubModule(normalizedCategory);
    }
  }, [normalizedCategory]);

  // Active weeks from database (pure database driven, no hardcoded mock fallbacks)
  const activeWeeksList: MaintenanceWeek[] = useMemo(() => {
    if (maintenanceWeeks && maintenanceWeeks.length > 0) {
      return [...maintenanceWeeks].sort((a, b) => a.id - b.id);
    }
    return [];
  }, [maintenanceWeeks]);

  // Determine current active week from database
  const defaultActiveWeek = useMemo(() => {
    const active = activeWeeksList.find(w => w.is_active);
    return active ? active.week_no : (activeWeeksList[activeWeeksList.length - 1]?.week_no || 'ALL');
  }, [activeWeeksList]);

  // Selected unit & form state
  const initialEq = equipments[0];
  const [equipNo, setEquipNo] = useState(initialEq?.equip_no || initialEq?.no_unit || 'EX1210');
  const [overviewCategoryFilter, setOverviewCategoryFilter] = useState<'ALL' | EquipmentCategory>('ALL');
  const [overviewWeekFilter, setOverviewWeekFilter] = useState<string>(defaultActiveWeek);

  // Keep the dashboard filter valid after weeks are loaded, added, or removed.
  useEffect(() => {
    const filterStillExists = overviewWeekFilter === 'ALL'
      || activeWeeksList.some(w => w.week_no === overviewWeekFilter);

    if (!filterStillExists) {
      setOverviewWeekFilter(defaultActiveWeek);
    }
  }, [activeWeeksList, defaultActiveWeek, overviewWeekFilter]);

  const overviewWeeks = useMemo(() => {
    if (overviewWeekFilter === 'ALL') return activeWeeksList;
    return activeWeeksList.filter(w => w.week_no === overviewWeekFilter);
  }, [activeWeeksList, overviewWeekFilter]);

  const selectedOverviewWeek = useMemo(
    () => activeWeeksList.find(w => w.week_no === overviewWeekFilter),
    [activeWeeksList, overviewWeekFilter]
  );

  // Dynamically resolve selected equipment details and machine family category
  const selectedEquipment = useMemo(() => {
    return equipments.find(x => (x.equip_no || x.no_unit) === equipNo) || initialEq || null;
  }, [equipments, equipNo, initialEq]);

  const equipmentCategory = useMemo(() => {
    return getEquipmentCategory(selectedEquipment, equipNo);
  }, [selectedEquipment, equipNo]);

  // Dynamically adapt module configuration and checklist items to this specific equipment model
  const currentModule = useMemo(() => {
    return getAdaptedModuleConfig(selectedSubModule, equipmentCategory);
  }, [selectedSubModule, equipmentCategory]);

  const ModuleIcon = currentModule.icon;

  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [weekNo, setWeekNo] = useState<string>(
    defaultActiveWeek !== 'ALL' ? defaultActiveWeek : (activeWeeksList[0]?.week_no || '')
  );
  const [hm, setHm] = useState(Number(initialEq?.last_hm || 0));
  const [tech, setTech] = useState('Rahmat Hidayat (Lead Tech)');
  const [notes, setNotes] = useState('');
  const [achievementPct, setAchievementPct] = useState<number>(100);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State for Adding New Week Period to Database
  const [isWeekModalOpen, setIsWeekModalOpen] = useState(false);
  const [newWeekNo, setNewWeekNo] = useState('');
  const [newWeekLabel, setNewWeekLabel] = useState('');
  const [newWeekStart, setNewWeekStart] = useState('');
  const [newWeekEnd, setNewWeekEnd] = useState('');
  const [newWeekIsActive, setNewWeekIsActive] = useState(true);
  const [savingWeek, setSavingWeek] = useState(false);

  // Sync default week when activeWeeksList loads
  useEffect(() => {
    if (defaultActiveWeek && defaultActiveWeek !== 'ALL' && (!weekNo || weekNo === 'ALL')) {
      setWeekNo(defaultActiveWeek);
    } else if (!weekNo && activeWeeksList.length > 0) {
      setWeekNo(activeWeeksList[0].week_no);
    }
  }, [defaultActiveWeek, activeWeeksList, weekNo]);

  // ==================== 100% PURE DATABASE-DRIVEN PERFORMANCE MATRIX ====================
  // Strictly calculated from actual pm_records rows in SQLite database without ANY hardcoded baseline fallbacks!
  const performanceMatrix = useMemo(() => {
    const rawRecords = pmRecords || [];
    // Filter records by machine category family if a filter is active
    const records = rawRecords.filter(r => {
      if (overviewCategoryFilter === 'ALL') return true;
      const eq = equipments.find(e => (e.equip_no || e.no_unit) === r.equip_no);
      return getEquipmentCategory(eq, r.equip_no) === overviewCategoryFilter;
    });
    const weeks = activeWeeksList;

    return Object.values(bmModuleConfig).map(mod => {
      // Find all records belonging to this submodule
      const syns = getSubModuleSynonyms(mod.id);
      const modRecords = records.filter(r => {
        const type = (r.pm_type || '').toLowerCase();
        return syns.some(s => type === s || type.includes(s));
      });

      // Calculate each week's actual performance from SQLite pm_records
      const weekValues: Record<string, { val: number; count: number }> = {};
      let totalValidPercentages = 0;
      let weeksWithDataCount = 0;

      weeks.forEach(w => {
        const cleanWeekKey = w.week_no.toUpperCase().replace(/\s+/g, '');
        const matchingWeekRecords = modRecords.filter(r => {
          const rWeek = (r.week_no || '').toUpperCase().replace(/\s+/g, '');
          return rWeek === cleanWeekKey || rWeek.includes(cleanWeekKey.replace('WEEK', 'W')) || cleanWeekKey.includes(rWeek);
        });

        if (matchingWeekRecords.length > 0) {
          const validPcts = matchingWeekRecords
            .map(r => Number(r.achievement_pct))
            .filter(n => !isNaN(n));
          const avgPct = validPcts.length > 0
            ? Math.round(validPcts.reduce((a, b) => a + b, 0) / validPcts.length)
            : 0;
          weekValues[w.week_no] = { val: avgPct, count: matchingWeekRecords.length };
          totalValidPercentages += avgPct;
          weeksWithDataCount++;
        } else {
          weekValues[w.week_no] = { val: 0, count: 0 };
        }
      });

      const overallAvg = weeksWithDataCount > 0
        ? Math.round(totalValidPercentages / weeksWithDataCount)
        : 0;
      const displayedAvg = overviewWeekFilter === 'ALL'
        ? overallAvg
        : (weekValues[overviewWeekFilter]?.val || 0);

      // Legacy aliases retained for consumers of the matrix shape.
      const w40 = weekValues['WEEK 36']?.val || 0;
      const w41 = weekValues['WEEK 37']?.val || 0;
      const w42 = weekValues['WEEK 38']?.val || 0;
      const w43 = weekValues['WEEK 38']?.val || 0;

      return {
        id: mod.id,
        desc: mod.shortName,
        weekValues,
        w40,
        w41,
        w42,
        w43,
        avg: displayedAvg,
        totalRecords: modRecords.length
      };
    });
  }, [pmRecords, activeWeeksList, overviewCategoryFilter, overviewWeekFilter, equipments]);

  // Overall compliance across all 8 sub-modules from actual database
  const overallPlantCompliance = useMemo(() => {
    if (!performanceMatrix.length) return 0;
    const itemsWithData = performanceMatrix.filter(item => item.avg > 0);
    if (!itemsWithData.length) return 0;
    const totalAvg = itemsWithData.reduce((acc, curr) => acc + curr.avg, 0);
    return Math.round(totalAvg / itemsWithData.length);
  }, [performanceMatrix]);

  // Actual history records strictly mapped from SQLite pmRecords
  const historyList = useMemo(() => {
    return (pmRecords || []).map(r => {
      const type = (r.pm_type || '').toLowerCase();
      const matchedConfig = Object.values(bmModuleConfig).find(cfg => {
        const syns = getSubModuleSynonyms(cfg.id);
        return syns.some(s => type === s || type.includes(s));
      });
      const eq = equipments.find(e => (e.equip_no || e.no_unit) === r.equip_no);
      const cat = getEquipmentCategory(eq, r.equip_no);
      const adapted = matchedConfig ? getAdaptedModuleConfig(matchedConfig.id, cat) : null;

      return {
        id: r.item_id || `BM-${r.id}`,
        db_id: r.id,
        equip_no: r.equip_no || 'EX1210',
        eq_model: eq?.model || 'Equipment',
        category_family: cat,
        tanggal: r.tanggal || '-',
        week_no: r.week_no || '-',
        hm: Number(r.hm_pm || 0),
        category: adapted ? adapted.name : (matchedConfig ? matchedConfig.name : (r.pm_type || 'Basic Maintenance')),
        subModuleId: matchedConfig ? matchedConfig.id : 'bm_inspection',
        tech: r.mechanic || 'Teknisi Plant',
        achievement: Number(r.achievement_pct || 100),
        notes: r.notes || 'Pekerjaan selesai dan diverifikasi sesuai SOP.'
      };
    }).reverse();
  }, [pmRecords, equipments]);

  // Filtered history
  const filteredHistory = useMemo(() => {
    if (!searchTerm) return historyList;
    const q = searchTerm.toLowerCase();
    return historyList.filter(h =>
      h.equip_no.toLowerCase().includes(q) ||
      h.category.toLowerCase().includes(q) ||
      h.tech.toLowerCase().includes(q) ||
      h.notes.toLowerCase().includes(q) ||
      h.week_no.toLowerCase().includes(q)
    );
  }, [historyList, searchTerm]);

  const toggleItem = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleSelectAll = () => {
    const allChecked: Record<string, boolean> = {};
    currentModule.items.forEach(item => {
      allChecked[item] = true;
    });
    setCheckedItems(allChecked);
  };

  // Submit actual operational record to database
  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weekNo || weekNo === 'ALL') {
      alert('⚠️ Periode minggu belum tersedia atau belum dipilih!\n\nSilakan klik tombol "+ Buat Periode" untuk menambahkan periode minggu operasional terlebih dahulu ke database SQLite.');
      setIsWeekModalOpen(true);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        item_id: `BM-${Date.now().toString().slice(-6)}`,
        tanggal,
        equip_no: equipNo,
        pm_type: selectedSubModule,
        week_no: weekNo,
        achievement_pct: Number(achievementPct) || 100,
        washing_check: selectedSubModule === 'bm_washing' ? 'Checked' : 'OK',
        greasing_check: selectedSubModule === 'bm_greasing' ? 'Checked' : 'OK',
        inspection_check: selectedSubModule === 'bm_inspection' ? 'Checked' : 'OK',
        torque_check: selectedSubModule === 'bm_retorque' ? 'Checked' : 'OK',
        battery_check: selectedSubModule === 'bm_ac_electrical' ? 'Checked' : 'OK',
        mechanic: tech,
        notes: notes || `Pemeriksaan ${currentModule.name} tuntas sesuai SOP.`,
        hm_pm: hm,
        status: 'Completed',
        checklist_json: Object.entries(checkedItems).map(([item, checked]) => ({ item, checked }))
      };

      await api.postAction('saveBasicMaintenance', payload);

      setNotes('');
      setCheckedItems({});
      if (onRefresh) onRefresh();

      alert(`✅ Laporan ${currentModule.name} untuk unit ${equipNo} (${weekNo} - ${achievementPct}%) berhasil disimpan ke database SQLite!\n\nOverview & Weekly Trends langsung diperbarui dari data aktual.`);

      setActiveTab('dashboard');
      if (onNavigate) {
        onNavigate('bm_dashboard');
      }
    } catch (err: any) {
      alert('Gagal menyimpan laporan: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete actual record from SQLite
  const handleDeleteRecord = async (item_id: string) => {
    if (!window.confirm(`Hapus catatan Basic Maintenance ${item_id} dari database? Data Overview akan otomatis menghitung ulang sisa data aktual.`)) return;
    try {
      await api.postAction('deleteBasicMaintenance', { item_id });
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert('Gagal menghapus catatan: ' + err.message);
    }
  };

  // Save new Maintenance Week to Database
  const handleSaveNewWeek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeekNo.trim()) {
      alert('Nama / nomor minggu wajib diisi (misal: WEEK 44)');
      return;
    }
    setSavingWeek(true);
    try {
      await api.postAction('saveMaintenanceWeek', {
        week_no: newWeekNo.trim().toUpperCase(),
        label: newWeekLabel.trim() || `${newWeekNo.trim().toUpperCase()} (${newWeekStart} - ${newWeekEnd})`,
        start_date: newWeekStart || null,
        end_date: newWeekEnd || null,
        is_active: newWeekIsActive,
        target_compliance: 100
      });

      alert(`✅ Periode minggu ${newWeekNo} berhasil disimpan ke database!`);
      setIsWeekModalOpen(false);
      setNewWeekNo('');
      setNewWeekLabel('');
      setNewWeekStart('');
      setNewWeekEnd('');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert('Gagal menyimpan periode minggu: ' + err.message);
    } finally {
      setSavingWeek(false);
    }
  };

  // Direction Trend Arrow Renderer
  const renderTrendArrow = (val: number) => {
    if (val > 100) {
      return (
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black shadow-xs">
          ⬆
        </span>
      );
    }
    if (val >= 90) {
      return (
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black shadow-xs">
          ➔
        </span>
      );
    }
    if (val > 0) {
      return (
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-100 text-red-700 text-[10px] font-black shadow-xs">
          ⬇
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold">
        -
      </span>
    );
  };

  // Render individual SVG Bar Chart dynamically from database values
  const renderWeeklyBarChart = (item: typeof performanceMatrix[0], maxScale = 150) => {
    // Show only the selected week in focused mode; retain the full trend in ALL mode.
    const bars = overviewWeeks.map(w => ({
      label: w.week_no,
      val: item.weekValues[w.week_no]?.val || 0
    }));
    if (overviewWeekFilter === 'ALL') {
      bars.push({ label: 'Average', val: item.avg });
    }

    return (
      <div
        key={item.id}
        onClick={() => {
          setSelectedSubModule(item.id);
          setActiveTab('form');
        }}
        className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        title="Klik untuk membuka form input & checklist modul ini"
      >
        {/* Title */}
        <div className="flex items-center justify-between mb-1.5 border-b border-slate-100 pb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-cyan-500 rounded-sm inline-block shadow-xs"></span>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight truncate group-hover:text-blue-600 transition-colors">
              {item.desc}
            </h4>
          </div>
          <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            Input <ArrowRight className="w-2.5 h-2.5" />
          </span>
        </div>

        {/* SVG Bar Chart with Cylinder Gradient Effect */}
        <div className="relative h-36 w-full pt-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 280 110">
            {/* Defs for gradients */}
            <defs>
              <linearGradient id={`grad-bar-${item.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="40%" stopColor="#38bdf8" />
                <stop offset="70%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="25" y1="15" x2="275" y2="15" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="25" y1="55" x2="275" y2="55" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="25" y1="95" x2="275" y2="95" stroke="#cbd5e1" strokeWidth="1" />

            {/* Target 100% yellow benchmark line */}
            <line
              x1="25"
              y1={95 - (100 / maxScale) * 80}
              x2="275"
              y2={95 - (100 / maxScale) * 80}
              stroke="#f59e0b"
              strokeWidth="1.6"
              strokeDasharray="4 2"
            />

            {/* Y labels */}
            <text x="5" y="18" fill="#94a3b8" fontSize="8" fontWeight="bold">{maxScale}</text>
            <text x="5" y="58" fill="#94a3b8" fontSize="8" fontWeight="bold">{Math.round(maxScale / 2)}</text>
            <text x="12" y="98" fill="#94a3b8" fontSize="8" fontWeight="bold">0</text>

            {/* Bars */}
            {bars.map((b, idx) => {
              const totalBars = bars.length;
              const spacing = Math.min(48, Math.floor(230 / totalBars));
              const xPos = 35 + idx * spacing;
              const barHeight = b.val > 0 ? Math.min(85, Math.max(4, (b.val / maxScale) * 80)) : 0;
              const yPos = 95 - barHeight;

              return (
                <g key={b.label}>
                  {/* Bar rectangle with gradient */}
                  {b.val > 0 ? (
                    <rect
                      x={xPos}
                      y={yPos}
                      width="22"
                      height={barHeight}
                      fill={`url(#grad-bar-${item.id})`}
                      rx="2"
                      className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                    />
                  ) : (
                    <rect
                      x={xPos}
                      y={93}
                      width="22"
                      height={2}
                      fill="#e2e8f0"
                      rx="1"
                    />
                  )}

                  {/* Value label */}
                  <text
                    x={xPos + 11}
                    y={yPos > 28 ? yPos + 13 : (yPos > 0 ? yPos - 3 : 90)}
                    textAnchor="middle"
                    fill={yPos > 28 && b.val > 0 ? '#ffffff' : (b.val > 0 ? '#0f172a' : '#94a3b8')}
                    fontSize="8"
                    fontWeight="900"
                  >
                    {b.val > 0 ? b.val : '-'}
                  </text>

                  {/* X axis week label */}
                  <text
                    x={xPos + 11}
                    y="105"
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="7"
                    fontWeight="600"
                  >
                    {b.label === 'Average' ? 'Avg' : b.label.replace('WEEK ', 'W')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card with Database Realtime Indicator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                Basic Maintenance
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300 uppercase flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-600" />
                DATABASE ACTUAL (SQLite WAL)
              </span>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                {activeWeeksList.length} Periode Minggu di DB
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Seluruh data ringkasan, grafik, dan tabel performa dihitung 100% dari data aktual database tanpa cache statis.
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                if (onNavigate) onNavigate('bm_dashboard');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Overview & Weekly Trends</span>
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === 'form'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Checklist & Form Input</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Riwayat Log ({historyList.length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsWeekModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl border border-slate-300 transition-colors"
            title="Kelola Database Periode Minggu"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Kelola Minggu</span>
          </button>

          <button
            onClick={() => setActiveTab('form')}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Input Laporan</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl border border-slate-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* ================= VIEW 1: EXECUTIVE DASHBOARD & WEEKLY TRENDS ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Dashboard filters: fleet category and database-backed week context */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" aria-hidden="true" />
                <div>
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                    Filter Model Armada
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {overviewCategoryFilter === 'ALL' ? 'Menampilkan seluruh armada site' : `Menampilkan kepatuhan armada ${getCategoryLabel(overviewCategoryFilter)}`}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'ALL', label: 'Semua Kategori' },
                  { id: 'EXCAVATOR', label: 'Excavator (Bucket)' },
                  { id: 'DUMP_TRUCK', label: 'Dump Truck (Wheel)' },
                  { id: 'BULLDOZER', label: 'Bulldozer (Blade)' },
                  { id: 'WHEEL_LOADER', label: 'Wheel Loader' },
                  { id: 'GENSET', label: 'Genset / Plant' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setOverviewCategoryFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                      overviewCategoryFilter === f.id
                        ? 'bg-blue-600 text-white shadow-xs scale-[1.02]'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-[auto_minmax(260px,420px)_1fr] sm:items-center gap-2">
                <label htmlFor="overview-week-filter" className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider whitespace-nowrap">
                  <Calendar className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  Pilih Periode Overview
                </label>
                <select
                  id="overview-week-filter"
                  value={overviewWeekFilter}
                  onChange={e => setOverviewWeekFilter(e.target.value)}
                  className="w-full text-xs font-black bg-blue-50 border border-blue-300 rounded-lg px-3 py-2 text-blue-900 focus:ring-2 focus:ring-blue-500"
                >
                  {activeWeeksList.length === 0 ? (
                    <option value="ALL">Belum ada periode minggu di database</option>
                  ) : (
                    <>
                      <option value="ALL">Semua periode — tampilkan tren lengkap</option>
                      {activeWeeksList.map(w => (
                        <option key={w.week_no} value={w.week_no}>
                          {w.week_no}{w.is_active ? ' • AKTIF' : ' • PERIODE SEBELUMNYA'}{w.label ? ` — ${w.label}` : ''}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <span className="text-[11px] text-slate-500 font-medium">
                  {activeWeeksList.length === 0
                    ? 'Belum ada data periode operasional. Klik "Kelola Minggu" untuk menambahkan periode baru.'
                    : overviewWeekFilter === 'ALL'
                      ? 'Menampilkan seluruh periode minggu yang tersimpan di database.'
                      : `Membuka data ${selectedOverviewWeek?.label || overviewWeekFilter}.`}
                </span>
              </div>
            </div>
          </div>

          {/* Empty State Banner when 0 weeks in database */}
          {activeWeeksList.length === 0 && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-amber-900 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold">Database Periode Minggu Masih Kosong</p>
                  <p className="text-[11px] text-amber-700">Data periode minggu operasional belum diinput ke database SQLite. Silakan gunakan tombol &quot;Kelola Minggu&quot; untuk menambahkan periode baru.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsWeekModalOpen(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-black shrink-0 transition-colors shadow-xs"
              >
                + Buat Periode Minggu
              </button>
            </div>
          )}

          {/* Main Grid: Left 8 Charts + Right Executive Performance Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: 8 Weekly Charts (7 Cols on desktop) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {performanceMatrix.map(item => {
                const maxScale = item.desc === 'CLEAN UP UNDERCARRIAGE' || item.desc === 'RETORQUE COMPONENT UC' ? 500 : 150;
                return renderWeeklyBarChart(item, maxScale);
              })}
            </div>

            {/* RIGHT: Performance Table & Optima Plant Accent (5 Cols on desktop) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Optima Plant Crest Card */}
              <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm border border-slate-800 relative overflow-hidden flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    OPTIMA PLANT MAINTENANCE
                  </span>
                  <h3 className="text-lg font-black mt-0.5">Basic Maintenance Compliance</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {activeWeeksList.length === 0
                      ? 'Belum ada periode operasional terdaftar di database.'
                      : overviewWeekFilter === 'ALL'
                        ? `Kepatuhan actual seluruh armada site plant (${activeWeeksList[0]?.week_no || ''} - ${activeWeeksList[activeWeeksList.length - 1]?.week_no || ''})`
                        : `Kepatuhan actual seluruh armada site plant pada ${selectedOverviewWeek?.label || overviewWeekFilter}`}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                      Rata-Rata Actual: {overallPlantCompliance}%
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      Target: 100%
                    </span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-500 to-blue-600 p-0.5 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Performance Table matching screenshot */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Ringkasan Performa Mingguan (%)
                    </h4>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      Sumber: Query Actual SQLite (`pm_records`)
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                    Target: 100%
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#b4c6e7] text-slate-900 font-extrabold text-[11px] border-b border-slate-300">
                        <th className="py-2 px-3 text-left border-r border-slate-300">DESC</th>
                        {overviewWeeks.map(w => (
                          <th key={w.week_no} className="py-2 px-2 text-center border-r border-slate-300 min-w-[65px]">
                            {w.week_no}
                          </th>
                        ))}
                        <th className="py-2 px-2 text-center bg-[#8ea9db] text-slate-950 min-w-[70px]">Average</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] font-semibold text-slate-700">
                      {performanceMatrix.map(row => (
                        <tr
                          key={row.id}
                          onClick={() => {
                            setSelectedSubModule(row.id);
                            setActiveTab('form');
                          }}
                          className="hover:bg-blue-50/60 cursor-pointer transition-colors group"
                          title="Klik untuk membuka form checklist modul ini"
                        >
                          <td className="py-2 px-3 text-slate-900 font-extrabold border-r border-slate-200 group-hover:text-blue-600 flex items-center justify-between">
                            <span>{row.desc}</span>
                            <ChevronRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </td>

                          {overviewWeeks.map(w => {
                            const val = row.weekValues[w.week_no]?.val || 0;
                            return (
                              <td key={w.week_no} className="py-2 px-2 text-center border-r border-slate-200 font-mono">
                                <div className="flex items-center justify-center gap-1">
                                  {renderTrendArrow(val)}
                                  <span>{val > 0 ? `${val}%` : '-'}</span>
                                </div>
                              </td>
                            );
                          })}

                          <td className="py-2 px-2 text-center bg-slate-50 font-black text-slate-900 font-mono">
                            <div className="flex items-center justify-center gap-1">
                              {renderTrendArrow(row.avg)}
                              <span>{row.avg > 0 ? `${row.avg}%` : '-'}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Legend */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-6 text-[10px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">⬆</span> &gt;100% (Target Terlampaui)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-amber-500 font-bold">➔</span> 90% - 100% (Sesuai Standar)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-red-600 font-bold">⬇</span> &lt;80% (Perlu Perhatian)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC OVERVIEW SUMMARY: Tabel Rekap Log Actual Terkini */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Summary Log Input Basic Maintenance Actual
                </h3>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {historyList.length} Total Data di SQLite
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsWeekModalOpen(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Kelola Minggu</span>
                </button>

                <button
                  onClick={() => setActiveTab('form')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Input Baru</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-[11px] font-extrabold text-slate-700 border-b border-slate-200">
                    <th className="py-2.5 px-4">No. Log</th>
                    <th className="py-2.5 px-3">Tanggal & Minggu</th>
                    <th className="py-2.5 px-3">No. Unit</th>
                    <th className="py-2.5 px-3">Sub-Modul</th>
                    <th className="py-2.5 px-3">HM Saat Pelaksanaan</th>
                    <th className="py-2.5 px-3">Teknisi</th>
                    <th className="py-2.5 px-3 text-center">Pencapaian</th>
                    <th className="py-2.5 px-4">Catatan & Temuan</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {historyList.slice(0, 10).map((h, i) => (
                    <tr key={h.id || i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-bold text-blue-600">{h.id}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800">{h.tanggal}</div>
                        <div className="text-[10px] font-bold text-slate-400">{h.week_no}</div>
                      </td>
                      <td className="py-2.5 px-3 font-black text-slate-900">{h.equip_no}</td>
                      <td className="py-2.5 px-3">
                        <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px] border border-blue-100">
                          {h.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                        {h.hm ? h.hm.toLocaleString() : '-'} HM
                      </td>
                      <td className="py-2.5 px-3 font-semibold">{h.tech}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {renderTrendArrow(h.achievement)} {h.achievement}%
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate" title={h.notes}>
                        {h.notes}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleDeleteRecord(h.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          title="Hapus Data Log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 2: CHECKLIST & FORM OPERASIONAL ================= */}
      {activeTab === 'form' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Sub-module Selector Pills - Dynamically Adapted to Machine Model */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {Object.entries(bmModuleConfig).map(([key, config]) => {
              const adapted = getAdaptedModuleConfig(key, equipmentCategory);
              const isSelected = selectedSubModule === key;
              const Icon = adapted.icon || config.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedSubModule(key)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                  <div>
                    <h4 className="text-[11px] font-black leading-tight truncate">{adapted.shortName || config.shortName || config.name}</h4>
                    <span className={`text-[9px] font-bold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {adapted.items.length} Points
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Form & Checklist Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            {/* Header info of selected sub-module */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                  <ModuleIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{currentModule.name}</h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                      {getCategoryLabel(equipmentCategory)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{currentModule.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-200"
                >
                  Centang Semua Point (OK)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Batal / Ke Overview
                </button>
              </div>
            </div>

            {/* Visual Machine Category & Inspection Focus Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-4 rounded-xl border border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                  {equipmentCategory === 'DUMP_TRUCK' ? (
                    <Truck className="w-5 h-5 text-blue-400" />
                  ) : equipmentCategory === 'BULLDOZER' ? (
                    <Hammer className="w-5 h-5 text-amber-400" />
                  ) : equipmentCategory === 'WHEEL_LOADER' ? (
                    <Disc className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 border border-blue-400/40">
                      {getCategoryLabel(equipmentCategory)}
                    </span>
                    <span className="text-xs font-mono font-black text-white">
                      Unit: {equipNo}
                    </span>
                    <span className="text-xs text-slate-300">
                      ({selectedEquipment?.model || 'Model Armada'} - {selectedEquipment?.tipe || 'Unit Tambang'})
                    </span>
                  </div>
                  <p className="text-xs text-amber-300 font-semibold mt-1">
                    ⚡ Fokus Khusus Model: {getCategoryHighlight(equipmentCategory, selectedSubModule)}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Spesifikasi Sistem</span>
                <span className="text-xs font-black text-emerald-400">
                  {equipmentCategory === 'EXCAVATOR' || equipmentCategory === 'BULLDOZER'
                    ? 'Track Undercarriage System'
                    : equipmentCategory === 'DUMP_TRUCK' || equipmentCategory === 'WHEEL_LOADER'
                    ? 'Wheeled Hauler / Axle System'
                    : 'Stationary Heavy Plant'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveReport} className="space-y-6">
              {/* Unit, Date, Week, HM, & Mechanic Input Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">No. Unit</label>
                  <select
                    value={equipNo}
                    onChange={e => {
                      const newUnit = e.target.value;
                      setEquipNo(newUnit);
                      setCheckedItems({});
                      const eq = equipments.find(x => (x.equip_no || x.no_unit) === newUnit);
                      if (eq?.last_hm) setHm(Number(eq.last_hm));
                    }}
                    className="w-full text-xs font-black bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                  >
                    {equipments.map(eq => {
                      const no = eq.equip_no || eq.no_unit;
                      return <option key={no} value={no}>{no} ({eq.model || 'Equipment'})</option>;
                    })}
                  </select>
                </div>

                {/* DATABASE-BACKED WEEK SELECTOR */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">Periode Minggu (DB)</label>
                    <button
                      type="button"
                      onClick={() => setIsWeekModalOpen(true)}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      + Buat Periode
                    </button>
                  </div>
                  <select
                    value={weekNo}
                    onChange={e => setWeekNo(e.target.value)}
                    className="w-full text-xs font-black bg-blue-50/60 border border-blue-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 text-blue-800"
                  >
                    {activeWeeksList.length === 0 ? (
                      <option value="" disabled>Belum ada periode minggu di DB (Klik + Buat Periode)</option>
                    ) : (
                      activeWeeksList.map(w => (
                        <option key={w.week_no} value={w.week_no}>
                          {w.week_no} {w.is_active ? '(Aktif Saat Ini)' : ''} {w.label ? `— ${w.label}` : ''}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={e => setTanggal(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Hour Meter (HM)</label>
                  <input
                    type="number"
                    required
                    value={hm}
                    onChange={e => setHm(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Mekanik / Teknisi</label>
                  <input
                    type="text"
                    required
                    value={tech}
                    onChange={e => setTech(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-semibold"
                  />
                </div>
              </div>

              {/* Interactive Checklist Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Daftar Titik Pemeriksaan & Verifikasi Fisik
                  </h4>
                  <span className="text-[11px] text-slate-500 font-bold">
                    {Object.values(checkedItems).filter(Boolean).length} dari {currentModule.items.length} Selesai
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentModule.items.map((item, idx) => {
                    const isChecked = !!checkedItems[item];
                    return (
                      <div
                        key={item}
                        onClick={() => toggleItem(item)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isChecked
                            ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 shadow-xs'
                            : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-black ${
                            isChecked ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold">{item}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Achievement Percentage & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Pencapaian (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={achievementPct}
                    onChange={e => setAchievementPct(Number(e.target.value))}
                    className="w-full text-xs font-black bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
                    Standar: 100% | Target Minimum: 90%
                  </span>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Catatan Temuan / Rekomendasi</label>
                  <input
                    type="text"
                    placeholder="cth: Kondisi normal prima, grease terisi penuh pada seluruh pin bushing."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Kembali ke Overview
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Menyimpan ke SQLite...' : `Simpan & Rangkum ke Overview`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW 3: RIWAYAT PENGERJAAN LENGKAP ================= */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-200">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                Log Riwayat Pelaksanaan Basic Maintenance (SQLite Actual)
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Total <strong>{filteredHistory.length}</strong> data tersimpan di database
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari unit, modul, mekanik..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <button
                onClick={() => setActiveTab('form')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Input Baru</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-[11px] font-extrabold text-slate-700 border-b border-slate-200">
                  <th className="py-2.5 px-4">No. Log</th>
                  <th className="py-2.5 px-3">Tanggal & Minggu</th>
                  <th className="py-2.5 px-3">No. Unit</th>
                  <th className="py-2.5 px-3">Sub-Modul</th>
                  <th className="py-2.5 px-3">HM Alat</th>
                  <th className="py-2.5 px-3">Teknisi</th>
                  <th className="py-2.5 px-3 text-center">Pencapaian</th>
                  <th className="py-2.5 px-4">Catatan & Temuan</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400 font-medium">
                      Tidak ada data log yang sesuai dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((h, i) => (
                    <tr key={h.id || i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">{h.id}</td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-semibold">{h.tanggal}</div>
                        <div className="text-[10px] font-bold text-slate-400">{h.week_no}</div>
                      </td>
                      <td className="py-3 px-3 font-black text-slate-900">{h.equip_no}</td>
                      <td className="py-3 px-3">
                        <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px] border border-blue-100">
                          {h.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {h.hm ? h.hm.toLocaleString() : '-'} HM
                      </td>
                      <td className="py-3 px-3 font-semibold">{h.tech}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {renderTrendArrow(h.achievement)} {h.achievement}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={h.notes}>
                        {h.notes}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDeleteRecord(h.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          title="Hapus Data Log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL: KELOLA DATABASE PERIODE MINGGU ================= */}
      {isWeekModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase">
                  Kelola Database Periode Minggu
                </h3>
              </div>
              <button
                onClick={() => setIsWeekModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Existing Weeks List in Database */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-1">
                  Semua Periode Minggu di Database ({activeWeeksList.length})
                </h4>
                <p className="text-[10px] text-slate-500 mb-2">Pilih periode lama untuk langsung membukanya pada halaman Overview.</p>
                <div className="max-h-44 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2 bg-slate-50">
                  {activeWeeksList.length === 0 ? (
                    <div className="text-center py-6 px-4">
                      <Calendar className="w-7 h-7 text-slate-300 mx-auto mb-1.5" />
                      <p className="text-xs font-bold text-slate-600">Belum ada periode minggu di database</p>
                      <p className="text-[10px] text-slate-400">Tambahkan periode minggu operasional baru pada formulir di bawah ini.</p>
                    </div>
                  ) : (
                    activeWeeksList.map(w => (
                      <button
                        type="button"
                        key={w.week_no}
                        onClick={() => {
                          setOverviewWeekFilter(w.week_no);
                          setActiveTab('dashboard');
                          setIsWeekModalOpen(false);
                          if (onNavigate) onNavigate('bm_dashboard');
                        }}
                        className={`w-full p-2 rounded-lg border flex items-center justify-between gap-3 text-xs text-left transition-colors ${
                          overviewWeekFilter === w.week_no
                            ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-200'
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="font-black text-slate-900">{w.week_no}</span>
                          {w.is_active && (
                            <span className="ml-2 bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded">
                              AKTIF
                            </span>
                          )}
                          <p className="text-[10px] text-slate-500 truncate">{w.label || w.notes || 'Tanpa label'}</p>
                        </div>
                        <span className="shrink-0 text-[9px] font-black uppercase text-blue-700">Buka Overview →</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Form to Add a New Week Period */}
              <form onSubmit={handleSaveNewWeek} className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="text-xs font-black text-blue-900 uppercase flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  Tambah Periode Minggu Baru ke Database
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">
                      Nomor Minggu *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="cth: WEEK 44"
                      value={newWeekNo}
                      onChange={e => setNewWeekNo(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">
                      Label / Keterangan
                    </label>
                    <input
                      type="text"
                      placeholder="cth: Week 44 (29 Okt - 04 Nov)"
                      value={newWeekLabel}
                      onChange={e => setNewWeekLabel(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={newWeekStart}
                      onChange={e => setNewWeekStart(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">
                      Tanggal Berakhir
                    </label>
                    <input
                      type="date"
                      value={newWeekEnd}
                      onChange={e => setNewWeekEnd(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="newWeekIsActive"
                    checked={newWeekIsActive}
                    onChange={e => setNewWeekIsActive(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="newWeekIsActive" className="text-xs font-semibold text-slate-700">
                    Jadikan sebagai periode minggu aktif berjalan saat ini
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsWeekModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Tutup
                  </button>
                  <button
                    type="submit"
                    disabled={savingWeek}
                    className="px-4 py-1.5 rounded-lg text-xs font-black text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{savingWeek ? 'Menyimpan...' : 'Simpan ke Database'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicMaintenanceView;
