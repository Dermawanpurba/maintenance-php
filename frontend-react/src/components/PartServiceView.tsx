import React, { useState, useMemo } from 'react';
import {
  Folder,
  FolderOpen,
  Search,
  Plus,
  RotateCcw,
  Printer,
  Download,
  Edit3,
  Trash2,
  Check,
  Truck,
  Disc,
  Gauge,
  Wrench,
  AlertCircle,
  Filter,
  X,
  ChevronDown,
  Layers,
  FileSpreadsheet,
  Activity,
  Cpu,
  Droplets
} from 'lucide-react';
import { PartServiceItem, Equipment, PlanAlat } from '../types';
import { api } from '../services/api';

interface PartServiceViewProps {
  initialUnitType?: string;
  partServices: PartServiceItem[];
  equipments?: Equipment[];
  planAlats?: PlanAlat[];
  onRefresh: () => void;
}

interface FolderCategory {
  id: string;
  name: string;
  equipmentKeyword: string;
  unitType: string;
  icon: React.FC<any>;
  color: string;
  bgLight: string;
  badge: string;
  borderColor: string;
  modelsDesc: string;
}

const folderCategories: FolderCategory[] = [
  {
    id: 'ALL',
    name: 'Semua Equipment',
    equipmentKeyword: 'ALL',
    unitType: 'ALL',
    icon: Layers,
    color: 'text-slate-600 dark:text-slate-300',
    bgLight: 'bg-slate-100 dark:bg-slate-800',
    badge: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    borderColor: 'border-slate-300 dark:border-slate-700',
    modelsDesc: 'Seluruh armada aktif site & dokumen acuan',
  },
  {
    id: 'DT',
    name: 'Dump Truck',
    equipmentKeyword: 'DUMP TRUCK',
    unitType: 'DT',
    icon: Truck,
    color: 'text-blue-600 dark:text-blue-400',
    bgLight: 'bg-blue-50 dark:bg-blue-950/40',
    badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-400 dark:border-blue-700',
    modelsDesc: 'SHACMAN F3000 (DT-3011..3019) & FUSO FIGHTER FN62',
  },
  {
    id: 'EXCA',
    name: 'Excavator',
    equipmentKeyword: 'EXCAVATOR',
    unitType: 'EXCA',
    icon: Wrench,
    color: 'text-amber-600 dark:text-amber-400',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-400 dark:border-amber-700',
    modelsDesc: 'CAT 320/330 GX, SANY SY330H, DOOSAN, HYUNDAI (9 Unit)',
  },
  {
    id: 'DOZER',
    name: 'Bulldozer',
    equipmentKeyword: 'BULLDOZER',
    unitType: 'DOZER',
    icon: Disc,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-400 dark:border-emerald-700',
    modelsDesc: 'CAT D8 GC, SEM 822D, ZOOMLION ZD-320 (7 Unit)',
  },
  {
    id: 'LOADER',
    name: 'Wheel Loader',
    equipmentKeyword: 'WHEEL LOADER',
    unitType: 'LOADER',
    icon: Gauge,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
    badge: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300',
    borderColor: 'border-indigo-400 dark:border-indigo-700',
    modelsDesc: 'SEM 660D, LIUGONG, LOVOL, LUGONG (4 Unit)',
  },
  {
    id: 'SUPPORT',
    name: 'Support & Water Truck',
    equipmentKeyword: 'TRUCK',
    unitType: 'SUPPORT',
    icon: Droplets,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/40',
    badge: 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300',
    borderColor: 'border-cyan-400 dark:border-cyan-700',
    modelsDesc: 'QUESTER CWE 280, FAW 140LT, GENSET (9 Unit)',
  },
];

export const PartServiceView: React.FC<PartServiceViewProps> = ({
  initialUnitType = 'ALL',
  partServices = [],
  equipments = [],
  planAlats = [],
  onRefresh
}) => {
  // Folder Navigation State
  const [selectedFolder, setSelectedFolder] = useState<string>(initialUnitType);

  // Search & Global Filter
  const [globalSearch, setGlobalSearch] = useState('');

  // Selected Model Quick Filter
  const [quickSelectedModel, setQuickSelectedModel] = useState<string>('ALL');

  // Excel-style Column Filters
  const [filterEquipment, setFilterEquipment] = useState('ALL');
  const [filterModel, setFilterModel] = useState('ALL');
  const [filterPartName, setFilterPartName] = useState('');
  const [filterPartNumber, setFilterPartNumber] = useState('');
  const [filterPS250, setFilterPS250] = useState('ALL');
  const [filterPS500, setFilterPS500] = useState('ALL');
  const [filterPS1000, setFilterPS1000] = useState('ALL');
  const [filterPS2000, setFilterPS2000] = useState('ALL');
  const [filterPS4000, setFilterPS4000] = useState('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PartServiceItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formEquipment, setFormEquipment] = useState('DUMP TRUCK');
  const [formModel, setFormModel] = useState('SHACMAN F3000');
  const [formUnitType, setFormUnitType] = useState('DT');
  const [formPartName, setFormPartName] = useState('');
  const [formPartNumber, setFormPartNumber] = useState('');
  const [formCategory, setFormCategory] = useState('Lubricant & Oil');
  const [formPS250, setFormPS250] = useState<string>('');
  const [formPS500, setFormPS500] = useState<string>('');
  const [formPS1000, setFormPS1000] = useState<string>('');
  const [formPS2000, setFormPS2000] = useState<string>('');
  const [formPS4000, setFormPS4000] = useState<string>('');
  const [formNotes, setFormNotes] = useState('');

  // Mapping of count of actual units in Master Unit & Plan for each model
  const modelFleetCount = useMemo(() => {
    const counts: Record<string, number> = {};
    equipments.forEach(eq => {
      const m = (eq.model || '').trim().toUpperCase();
      if (m) {
        counts[m] = (counts[m] || 0) + 1;
      }
    });
    return counts;
  }, [equipments]);

  // Distinct equipments and models in the Part Service database + Master Unit
  const uniqueEquipments = useMemo(() => {
    const fromParts = partServices.map(p => p.equipment).filter(Boolean);
    const fromFleet = equipments.map(e => (e.tipe || e.unit_type || '').toUpperCase()).filter(Boolean);
    const merged = Array.from(new Set([...fromParts, ...fromFleet]));
    return merged.sort();
  }, [partServices, equipments]);

  const uniqueModels = useMemo(() => {
    const list = Array.from(new Set(partServices.map(p => p.model).filter(Boolean)));
    return list.sort();
  }, [partServices]);

  // Distinct fleet models registered in Master Unit & Plan
  const fleetModelsList = useMemo(() => {
    const modelsMap: Record<string, { model: string; tipe: string; count: number }> = {};
    equipments.forEach(eq => {
      const m = (eq.model || '').trim();
      if (m) {
        if (!modelsMap[m]) {
          modelsMap[m] = {
            model: m,
            tipe: (eq.tipe || eq.unit_type || 'Alat').toUpperCase(),
            count: 0
          };
        }
        modelsMap[m].count += 1;
      }
    });
    return Object.values(modelsMap).sort((a, b) => b.count - a.count);
  }, [equipments]);

  // Calculate unit count per folder from Master Unit & Plan
  const folderFleetStats = useMemo(() => {
    const stats: Record<string, { fleetUnits: number; partRows: number }> = {
      ALL: { fleetUnits: equipments.length, partRows: partServices.length }
    };

    folderCategories.forEach(cat => {
      if (cat.id !== 'ALL') {
        const matchingEquips = equipments.filter(eq => {
          const t = (eq.tipe || eq.unit_type || '').toUpperCase();
          return t.includes(cat.equipmentKeyword);
        });

        const matchingParts = partServices.filter(p => {
          const eq = (p.equipment || '').toUpperCase();
          const ut = (p.unit_type || '').toUpperCase();
          return eq.includes(cat.equipmentKeyword) || ut === cat.unitType;
        });

        stats[cat.id] = {
          fleetUnits: matchingEquips.length,
          partRows: matchingParts.length
        };
      }
    });

    return stats;
  }, [equipments, partServices]);

  // Handle folder tab switch
  const handleSelectFolder = (folderId: string) => {
    setSelectedFolder(folderId);
    setQuickSelectedModel('ALL');
    if (folderId === 'ALL') {
      setFilterEquipment('ALL');
    } else {
      const match = folderCategories.find(c => c.id === folderId);
      if (match && match.equipmentKeyword !== 'ALL') {
        // If there's an exact equipment match in uniqueEquipments, set it
        const exact = uniqueEquipments.find(e => e.toUpperCase().includes(match.equipmentKeyword));
        setFilterEquipment(exact || 'ALL');
      }
    }
  };

  // Quick Model Selector Click
  const handleSelectQuickModel = (modelName: string) => {
    setQuickSelectedModel(modelName);
    if (modelName === 'ALL') {
      setFilterModel('ALL');
    } else {
      // Find matching model in uniqueModels
      const match = uniqueModels.find(m => m.toUpperCase().includes(modelName.toUpperCase()));
      setFilterModel(match || modelName);
    }
  };

  // Filter items matching all criteria
  const filteredParts = useMemo(() => {
    return partServices.filter(item => {
      // 1. Folder category filter
      if (selectedFolder !== 'ALL') {
        const folder = folderCategories.find(c => c.id === selectedFolder);
        if (folder && folder.equipmentKeyword !== 'ALL') {
          const eq = (item.equipment || '').toUpperCase();
          const ut = (item.unit_type || '').toUpperCase();
          if (!eq.includes(folder.equipmentKeyword) && ut !== folder.unitType) {
            return false;
          }
        }
      }

      // 2. Quick Model filter
      if (quickSelectedModel !== 'ALL') {
        const itemModel = (item.model || '').toUpperCase();
        if (!itemModel.includes(quickSelectedModel.toUpperCase())) {
          return false;
        }
      }

      // 3. Column: Equipment filter
      if (filterEquipment !== 'ALL' && item.equipment !== filterEquipment) {
        return false;
      }

      // 4. Column: Model filter
      if (filterModel !== 'ALL' && item.model !== filterModel) {
        return false;
      }

      // 5. Column: Part Name search
      if (filterPartName.trim()) {
        const query = filterPartName.toLowerCase();
        if (!item.part_name?.toLowerCase().includes(query)) return false;
      }

      // 6. Column: Part Number search
      if (filterPartNumber.trim()) {
        const query = filterPartNumber.toLowerCase();
        if (!item.part_number?.toLowerCase().includes(query)) return false;
      }

      // 7. PS Interval filters
      if (filterPS250 === 'HAS_VALUE' && (item.ps_250 === null || item.ps_250 === undefined)) return false;
      if (filterPS250 === 'BLANK' && item.ps_250 !== null && item.ps_250 !== undefined) return false;

      if (filterPS500 === 'HAS_VALUE' && (item.ps_500 === null || item.ps_500 === undefined)) return false;
      if (filterPS500 === 'BLANK' && item.ps_500 !== null && item.ps_500 !== undefined) return false;

      if (filterPS1000 === 'HAS_VALUE' && (item.ps_1000 === null || item.ps_1000 === undefined)) return false;
      if (filterPS1000 === 'BLANK' && item.ps_1000 !== null && item.ps_1000 !== undefined) return false;

      if (filterPS2000 === 'HAS_VALUE' && (item.ps_2000 === null || item.ps_2000 === undefined)) return false;
      if (filterPS2000 === 'BLANK' && item.ps_2000 !== null && item.ps_2000 !== undefined) return false;

      if (filterPS4000 === 'HAS_VALUE' && (item.ps_4000 === null || item.ps_4000 === undefined)) return false;
      if (filterPS4000 === 'BLANK' && item.ps_4000 !== null && item.ps_4000 !== undefined) return false;

      // 8. Global Search
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase();
        const matchesGlobal =
          item.equipment?.toLowerCase().includes(q) ||
          item.model?.toLowerCase().includes(q) ||
          item.part_name?.toLowerCase().includes(q) ||
          item.part_number?.toLowerCase().includes(q) ||
          item.notes?.toLowerCase().includes(q);
        if (!matchesGlobal) return false;
      }

      return true;
    });
  }, [
    partServices,
    selectedFolder,
    quickSelectedModel,
    filterEquipment,
    filterModel,
    filterPartName,
    filterPartNumber,
    filterPS250,
    filterPS500,
    filterPS1000,
    filterPS2000,
    filterPS4000,
    globalSearch
  ]);

  // Reset all table column filters
  const handleResetFilters = () => {
    setFilterEquipment('ALL');
    setFilterModel('ALL');
    setFilterPartName('');
    setFilterPartNumber('');
    setFilterPS250('ALL');
    setFilterPS500('ALL');
    setFilterPS1000('ALL');
    setFilterPS2000('ALL');
    setFilterPS4000('ALL');
    setQuickSelectedModel('ALL');
    setGlobalSearch('');
  };

  // Open Modal for Create
  const handleOpenCreate = () => {
    setEditingItem(null);
    const activeFolder = folderCategories.find(c => c.id === selectedFolder);
    if (activeFolder && activeFolder.id !== 'ALL') {
      setFormEquipment(activeFolder.name.toUpperCase());
      setFormUnitType(activeFolder.unitType);
      if (activeFolder.id === 'DT') setFormModel('SHACMAN F3000');
      else if (activeFolder.id === 'EXCA') setFormModel('CAT 330 GX');
      else if (activeFolder.id === 'DOZER') setFormModel('CAT D8 GC');
      else if (activeFolder.id === 'LOADER') setFormModel('SEM 660D');
      else if (activeFolder.id === 'SUPPORT') setFormModel('QUESTER CWE 280');
      else setFormModel('CAT 330 GX');
    } else {
      setFormEquipment('DUMP TRUCK');
      setFormModel('SHACMAN F3000');
      setFormUnitType('DT');
    }
    setFormPartName('');
    setFormPartNumber('');
    setFormCategory('Lubricant & Oil');
    setFormPS250('');
    setFormPS500('');
    setFormPS1000('');
    setFormPS2000('');
    setFormPS4000('');
    setFormNotes('');
    setModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (item: PartServiceItem) => {
    setEditingItem(item);
    setFormEquipment(item.equipment || 'DUMP TRUCK');
    setFormModel(item.model || 'SHACMAN F3000');
    setFormUnitType(item.unit_type || 'DT');
    setFormPartName(item.part_name || '');
    setFormPartNumber(item.part_number || '');
    setFormCategory(item.category || 'Lubricant & Oil');
    setFormPS250(item.ps_250 !== null && item.ps_250 !== undefined ? String(item.ps_250) : '');
    setFormPS500(item.ps_500 !== null && item.ps_500 !== undefined ? String(item.ps_500) : '');
    setFormPS1000(item.ps_1000 !== null && item.ps_1000 !== undefined ? String(item.ps_1000) : '');
    setFormPS2000(item.ps_2000 !== null && item.ps_2000 !== undefined ? String(item.ps_2000) : '');
    setFormPS4000(item.ps_4000 !== null && item.ps_4000 !== undefined ? String(item.ps_4000) : '');
    setFormNotes(item.notes || '');
    setModalOpen(true);
  };

  // Handle unit pick from Master Unit & Plan in modal
  const handleSelectMasterUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const equipNo = e.target.value;
    if (!equipNo) return;
    const found = equipments.find(eq => eq.no_unit === equipNo || eq.equip_no === equipNo);
    if (found) {
      const tipe = (found.tipe || found.unit_type || '').toUpperCase();
      const model = (found.model || '').toUpperCase();
      setFormModel(model);
      if (tipe.includes('DUMP TRUCK')) {
        setFormEquipment('DUMP TRUCK');
        setFormUnitType('DT');
      } else if (tipe.includes('EXCAVATOR')) {
        setFormEquipment('EXCAVATOR');
        setFormUnitType('EXCA');
      } else if (tipe.includes('BULLDOZER') || tipe.includes('DOZER')) {
        setFormEquipment('BULLDOZER');
        setFormUnitType('DOZER');
      } else if (tipe.includes('LOADER') && !tipe.includes('SKID')) {
        setFormEquipment('WHEEL LOADER');
        setFormUnitType('LOADER');
      } else if (tipe.includes('WATER') || tipe.includes('LUBE') || tipe.includes('TRUCK')) {
        setFormEquipment(tipe || 'SUPPORT TRUCK');
        setFormUnitType('SUPPORT');
      } else {
        setFormEquipment(tipe || 'EQUIPMENT');
        setFormUnitType('DT');
      }
    }
  };

  // Save Item
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPartName.trim() || !formPartNumber.trim()) {
      setFeedback({ type: 'error', message: 'Nama Part dan Nomor Part wajib diisi!' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: editingItem?.id,
        equipment: formEquipment,
        model: formModel,
        unit_type: formUnitType,
        part_name: formPartName.trim().toUpperCase(),
        part_number: formPartNumber.trim().toUpperCase(),
        category: formCategory,
        ps_250: formPS250 !== '' ? parseFloat(formPS250) : null,
        ps_500: formPS500 !== '' ? parseFloat(formPS500) : null,
        ps_1000: formPS1000 !== '' ? parseFloat(formPS1000) : null,
        ps_2000: formPS2000 !== '' ? parseFloat(formPS2000) : null,
        ps_4000: formPS4000 !== '' ? parseFloat(formPS4000) : null,
        notes: formNotes.trim(),
      };

      const res = await api.savePartService(payload);
      if (res?.success) {
        setFeedback({ type: 'success', message: res.message || 'Part service berhasil disimpan!' });
        setModalOpen(false);
        onRefresh();
      } else {
        setFeedback({ type: 'error', message: res?.message || 'Gagal menyimpan part service' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Terjadi kesalahan sistem' });
    } finally {
      setLoading(false);
    }
  };

  // Delete Item
  const handleDelete = async (item: PartServiceItem) => {
    if (!window.confirm(`Hapus baris part "${item.part_name}" (${item.part_number})?`)) return;

    setLoading(true);
    try {
      const res = await api.deletePartService(item.id!);
      if (res?.success) {
        setFeedback({ type: 'success', message: 'Part service berhasil dihapus!' });
        onRefresh();
      } else {
        setFeedback({ type: 'error', message: res?.message || 'Gagal menghapus part service' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Gagal menghapus part service' });
    } finally {
      setLoading(false);
    }
  };

  // Seed / Reset Database to OEM Data
  const handleSeedOEM = async () => {
    if (!window.confirm('Reset seluruh master part service ke database bawaan pabrikan OEM yang tersinkronisasi dengan Master Unit & Plan (83 item)? Perubahan manual sebelumnya akan ditimpa.')) {
      return;
    }

    setLoading(true);
    try {
      const res = await api.seedPartServices();
      if (res?.success) {
        setFeedback({ type: 'success', message: res.message || 'Database berhasil di-reset sesuai Master Unit & Plan!' });
        onRefresh();
      } else {
        setFeedback({ type: 'error', message: res?.message || 'Gagal mereset database' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Gagal memanggil API reset' });
    } finally {
      setLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['EQUIPMENT', 'MODEL', 'PART NAME', 'PART NUMBER', '250', '500', '1000', '2000', '4000', 'CATEGORY', 'NOTES'];
    const rows = filteredParts.map(item => [
      `"${(item.equipment || '').replace(/"/g, '""')}"`,
      `"${(item.model || '').replace(/"/g, '""')}"`,
      `"${(item.part_name || '').replace(/"/g, '""')}"`,
      `"${(item.part_number || '').replace(/"/g, '""')}"`,
      item.ps_250 ?? '',
      item.ps_500 ?? '',
      item.ps_1000 ?? '',
      item.ps_2000 ?? '',
      item.ps_4000 ?? '',
      `"${(item.category || '').replace(/"/g, '""')}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const fileName = `Master_Part_Service_${selectedFolder}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  const activeCategory = folderCategories.find(c => c.id === selectedFolder) || folderCategories[0];

  return (
    <div className="space-y-5">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl shadow-md transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{feedback.message}</p>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Bar: Title & Action Buttons */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                <Activity className="w-3.5 h-3.5" />
                SINKRON DENGAN MASTER UNIT & PLAN ({equipments.length} UNIT ARMADA)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                FORMAT MATRIX INTERVAL OEM
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Total: <strong>{filteredParts.length}</strong> part ditampilkan
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Master Database Part Service
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Katalog kebutuhan pelumas & suku cadang berkala (PS 250, 500, 1000, 2000, 4000) disesuaikan persis dengan model unit armada aktif site
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Baris Part</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 transition"
              title="Unduh file Excel / CSV tabel ini"
            >
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Export Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 transition"
              title="Cetak format cetak Excel"
            >
              <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="hidden sm:inline">Cetak</span>
            </button>

            <button
              onClick={handleSeedOEM}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-sm font-medium rounded-xl border border-amber-300 dark:border-amber-700 transition"
              title="Reset ke database standar pabrikan OEM yang disinkronkan dengan armada Master Unit & Plan"
            >
              <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Reset Data Bawaan</span>
            </button>
          </div>
        </div>

        {/* Global Search & Active Filter Reset */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              placeholder="Cari cepat (nama part, nomor part, model unit, catatan)..."
              className="w-full pl-10 pr-9 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {(filterEquipment !== 'ALL' ||
              filterModel !== 'ALL' ||
              filterPartName ||
              filterPartNumber ||
              filterPS250 !== 'ALL' ||
              filterPS500 !== 'ALL' ||
              filterPS1000 !== 'ALL' ||
              filterPS2000 !== 'ALL' ||
              filterPS4000 !== 'ALL' ||
              quickSelectedModel !== 'ALL' ||
              globalSearch) && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-800 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Semua Filter</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          FOLDER MENU TABS (Folder Navigation Bar)
          Diselaraskan dengan kategori armada pada Master Unit & Plan
          ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {folderCategories.map(cat => {
            const stats = folderFleetStats[cat.id] || { fleetUnits: 0, partRows: 0 };
            const isActive = selectedFolder === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelectFolder(cat.id)}
                className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left transition-all whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-500 dark:border-blue-600 shadow-sm text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {/* Folder icon */}
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}
                >
                  {isActive ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{cat.name}</span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                      title={`${stats.partRows} baris part matrix`}
                    >
                      {stats.partRows} Part
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {stats.fleetUnits > 0 && (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {stats.fleetUnits} Unit Pit •
                      </span>
                    )}
                    <span>{cat.modelsDesc}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Model Selector Pills: Direct Link with Master Unit & Plan */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs pb-1 scrollbar-thin">
          <span className="text-slate-400 font-medium whitespace-nowrap pl-1 pr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Pilih Model Armada:
          </span>
          <button
            onClick={() => handleSelectQuickModel('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              quickSelectedModel === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Semua Model
          </button>
          {fleetModelsList.map(m => {
            const isSelected = quickSelectedModel.toUpperCase() === m.model.toUpperCase();
            return (
              <button
                key={m.model}
                onClick={() => handleSelectQuickModel(m.model)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 border-blue-400 dark:border-blue-600 font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{m.model}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  {m.count} Unit
                </span>
              </button>
            );
          })}
          {/* Include Fuso Fighter FN62 reference */}
          <button
            onClick={() => handleSelectQuickModel('FUSO FIGHTER FN62')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition border ${
              quickSelectedModel.includes('FUSO')
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border-amber-400 dark:border-amber-600 font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>FUSO FIGHTER FN62</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-50 dark:bg-amber-900/40 text-[10px] font-bold text-amber-700 dark:text-amber-300">
              Ref. Dokumen
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          EXCEL-STYLE MATRIX TABLE (SESUAI DOKUMEN TERLAMPIR)
          Columns: EQUIPMENT | MODEL | PART NAME | PART NUMBER | INTERVAL SERVICE (250, 500, 1000, 2000, 4000)
          Auto-filter row with dropdowns below each column
          ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        {/* Table View Title Info */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-5 py-3 border-b border-slate-300 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Folder Aktif:
            </span>
            <span className="px-2.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold text-blue-600 dark:text-blue-400">
              {activeCategory.name}
            </span>
            {quickSelectedModel !== 'ALL' && (
              <>
                <span className="text-slate-400">|</span>
                <span className="px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                  Model: {quickSelectedModel}
                </span>
              </>
            )}
            <span className="text-slate-400">|</span>
            <span className="text-slate-600 dark:text-slate-300">
              Menampilkan <strong>{filteredParts.length}</strong> part matrix
            </span>
          </div>
          <div className="text-slate-500 dark:text-slate-400 hidden sm:block">
            Gunakan panah filter dropdown pada setiap kolom header untuk memfilter data seperti di Excel
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border-spacing-0">
            {/* Multi-tier Header matching Excel Reference */}
            <thead>
              {/* Row 1 of Header: Column Names & Main INTERVAL SERVICE group */}
              <tr className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-black text-xs uppercase tracking-wider border-b border-slate-300 dark:border-slate-700">
                <th
                  rowSpan={2}
                  className="border-r border-b border-slate-300 dark:border-slate-700 px-4 py-2.5 min-w-[170px] align-middle font-serif font-black tracking-wide"
                >
                  EQUIPMENT
                </th>
                <th
                  rowSpan={2}
                  className="border-r border-b border-slate-300 dark:border-slate-700 px-4 py-2.5 min-w-[200px] align-middle font-serif font-black tracking-wide"
                >
                  MODEL
                </th>
                <th
                  rowSpan={2}
                  className="border-r border-b border-slate-300 dark:border-slate-700 px-4 py-2.5 min-w-[240px] align-middle font-serif font-black tracking-wide"
                >
                  PART NAME
                </th>
                <th
                  rowSpan={2}
                  className="border-r border-b border-slate-300 dark:border-slate-700 px-4 py-2.5 min-w-[160px] align-middle font-serif font-black tracking-wide"
                >
                  PART NUMBER
                </th>
                <th
                  colSpan={5}
                  className="border-r border-b border-slate-300 dark:border-slate-700 px-4 py-2 text-center font-serif font-black tracking-wide bg-slate-50 dark:bg-slate-800/60"
                >
                  INTERVAL SERVICE
                </th>
                <th
                  rowSpan={2}
                  className="border-b border-slate-300 dark:border-slate-700 px-3 py-2.5 text-center min-w-[90px] align-middle font-serif font-black tracking-wide"
                >
                  AKSI
                </th>
              </tr>

              {/* Row 2 of Header: Sub-columns for Interval (250, 500, 1000, 2000, 4000) */}
              <tr className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold text-xs border-b border-slate-300 dark:border-slate-700 text-center font-serif">
                <th className="border-r border-b border-slate-300 dark:border-slate-700 px-3 py-2 w-16">
                  250
                </th>
                <th className="border-r border-b border-slate-300 dark:border-slate-700 px-3 py-2 w-16">
                  500
                </th>
                <th className="border-r border-b border-slate-300 dark:border-slate-700 px-3 py-2 w-16">
                  1000
                </th>
                <th className="border-r border-b border-slate-300 dark:border-slate-700 px-3 py-2 w-16">
                  2000
                </th>
                <th className="border-r border-b border-slate-300 dark:border-slate-700 px-3 py-2 w-16">
                  4000
                </th>
              </tr>

              {/* Row 3 of Header: Excel Auto-Filter Dropdowns (Exact Match to Reference Image) */}
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b-2 border-slate-400 dark:border-slate-600">
                {/* Equipment Filter Dropdown */}
                <th className="border-r border-slate-300 dark:border-slate-700 p-1.5">
                  <div className="relative flex items-center">
                    <select
                      value={filterEquipment}
                      onChange={e => setFilterEquipment(e.target.value)}
                      className="w-full pl-2 pr-6 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs"
                    >
                      <option value="ALL">Semua Equipment</option>
                      {uniqueEquipments.map(eq => (
                        <option key={eq} value={eq}>
                          {eq}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2 text-slate-500 pointer-events-none" />
                  </div>
                </th>

                {/* Model Filter Dropdown */}
                <th className="border-r border-slate-300 dark:border-slate-700 p-1.5">
                  <div className="relative flex items-center">
                    <select
                      value={filterModel}
                      onChange={e => setFilterModel(e.target.value)}
                      className="w-full pl-2 pr-6 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs"
                    >
                      <option value="ALL">Semua Model</option>
                      {uniqueModels.map(m => {
                        const fleetCount = modelFleetCount[m.toUpperCase()] || 0;
                        return (
                          <option key={m} value={m}>
                            {m} {fleetCount > 0 ? `(${fleetCount} Unit)` : ''}
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2 text-slate-500 pointer-events-none" />
                  </div>
                </th>

                {/* Part Name Search Input Filter */}
                <th className="border-r border-slate-300 dark:border-slate-700 p-1.5">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={filterPartName}
                      onChange={e => setFilterPartName(e.target.value)}
                      placeholder="Filter Part Name..."
                      className="w-full pl-2 pr-6 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
                    />
                    <Filter className="w-3 h-3 absolute right-2 text-slate-400 pointer-events-none" />
                  </div>
                </th>

                {/* Part Number Search Input Filter */}
                <th className="border-r border-slate-300 dark:border-slate-700 p-1.5">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={filterPartNumber}
                      onChange={e => setFilterPartNumber(e.target.value)}
                      placeholder="Filter Part No..."
                      className="w-full pl-2 pr-6 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
                    />
                    <Filter className="w-3 h-3 absolute right-2 text-slate-400 pointer-events-none" />
                  </div>
                </th>

                {/* PS 250 Filter Dropdown */}
                <th className="border-r border-slate-300 dark:border-slate-700 p-1.5">
                  <div className="relative flex items-center">
                    <select
                      value={filterPS250}
                      onChange={e => setFilterPS250(e.target.value)}
                      className="w-full pl-1.5 pr-4 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs text-center"
                    >
                      <option value="ALL">Semua</option>
                      <option value="HAS_VALUE">Ada</option>
                      <option value="BLANK">Kosong</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-1 text-slate-500 pointer-events-none" />
                  </div>
                </th>

                {/* PS 500 Filter Dropdown */}
                <th className="border-r border-slate-300 dark:border-slate-700 p-1.5">
                  <div className="relative flex items-center">
                    <select
                      value={filterPS500}
                      onChange={e => setFilterPS500(e.target.value)}
                      className="w-full pl-1.5 pr-4 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs text-center"
                    >
                      <option value="ALL">Semua</option>
                      <option value="HAS_VALUE">Ada</option>
                      <option value="BLANK">Kosong</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-1 text-slate-500 pointer-events-none" />
                  </div>
                </th>

                {/* PS 1000 Filter Dropdown */}
                <th className="border-r border-slate-300 dark:border-slate-700 p-1.5">
                  <div className="relative flex items-center">
                    <select
                      value={filterPS1000}
                      onChange={e => setFilterPS1000(e.target.value)}
                      className="w-full pl-1.5 pr-4 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs text-center"
                    >
                      <option value="ALL">Semua</option>
                      <option value="HAS_VALUE">Ada</option>
                      <option value="BLANK">Kosong</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-1 text-slate-500 pointer-events-none" />
                  </div>
                </th>

                {/* PS 2000 Filter Dropdown */}
                <th className="border-r border-slate-300 dark:border-slate-700 p-1.5">
                  <div className="relative flex items-center">
                    <select
                      value={filterPS2000}
                      onChange={e => setFilterPS2000(e.target.value)}
                      className="w-full pl-1.5 pr-4 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs text-center"
                    >
                      <option value="ALL">Semua</option>
                      <option value="HAS_VALUE">Ada</option>
                      <option value="BLANK">Kosong</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-1 text-slate-500 pointer-events-none" />
                  </div>
                </th>

                {/* PS 4000 Filter Dropdown */}
                <th className="border-r border-slate-300 dark:border-slate-700 p-1.5">
                  <div className="relative flex items-center">
                    <select
                      value={filterPS4000}
                      onChange={e => setFilterPS4000(e.target.value)}
                      className="w-full pl-1.5 pr-4 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs text-center"
                    >
                      <option value="ALL">Semua</option>
                      <option value="HAS_VALUE">Ada</option>
                      <option value="BLANK">Kosong</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-1 text-slate-500 pointer-events-none" />
                  </div>
                </th>

                {/* Action Column Filter Clear Button */}
                <th className="p-1.5 text-center">
                  <button
                    onClick={handleResetFilters}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition"
                    title="Bersihkan filter"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </th>
              </tr>
            </thead>

            {/* Table Body (Crisp Excel Grid Lines) */}
            <tbody className="divide-y divide-slate-300 dark:divide-slate-700 text-xs font-sans">
              {filteredParts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <FileSpreadsheet className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">Tidak ada baris part yang cocok</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Coba sesuaikan filter model/equipment di atas atau klik reset filter.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-3 px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300 rounded-lg text-xs font-medium border border-blue-200 dark:border-blue-800"
                      >
                        Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredParts.map((item, index) => {
                  const fleetUnitsCount = modelFleetCount[(item.model || '').toUpperCase()] || 0;

                  return (
                    <tr
                      key={item.id || index}
                      className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors group"
                    >
                      {/* EQUIPMENT */}
                      <td className="border-r border-slate-300 dark:border-slate-700 px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200 uppercase whitespace-nowrap">
                        {item.equipment}
                      </td>

                      {/* MODEL (with Fleet Badge if present in Master Unit & Plan) */}
                      <td className="border-r border-slate-300 dark:border-slate-700 px-4 py-2.5 text-slate-700 dark:text-slate-300 uppercase whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium">{item.model}</span>
                          {fleetUnitsCount > 0 ? (
                            <span
                              className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-700"
                              title={`${fleetUnitsCount} unit model ini beroperasi aktif pada Master Unit & Plan`}
                            >
                              {fleetUnitsCount} Unit
                            </span>
                          ) : item.model?.includes('FUSO') ? (
                            <span
                              className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-300 dark:border-amber-700"
                              title="Model referensi dokumen asli pengguna"
                            >
                              Ref. Dok
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* PART NAME */}
                      <td className="border-r border-slate-300 dark:border-slate-700 px-4 py-2.5 font-semibold text-slate-900 dark:text-white uppercase">
                        <div>
                          <span>{item.part_name}</span>
                          {item.notes && (
                            <span className="block text-[10px] font-normal text-slate-400 italic">
                              {item.notes}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* PART NUMBER */}
                      <td className="border-r border-slate-300 dark:border-slate-700 px-4 py-2.5 font-mono text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">
                        {item.part_number}
                      </td>

                      {/* 250 */}
                      <td className="border-r border-slate-300 dark:border-slate-700 px-3 py-2.5 text-center font-bold text-slate-900 dark:text-white">
                        {item.ps_250 !== null && item.ps_250 !== undefined ? item.ps_250 : ''}
                      </td>

                      {/* 500 */}
                      <td className="border-r border-slate-300 dark:border-slate-700 px-3 py-2.5 text-center font-bold text-slate-900 dark:text-white">
                        {item.ps_500 !== null && item.ps_500 !== undefined ? item.ps_500 : ''}
                      </td>

                      {/* 1000 */}
                      <td className="border-r border-slate-300 dark:border-slate-700 px-3 py-2.5 text-center font-bold text-slate-900 dark:text-white">
                        {item.ps_1000 !== null && item.ps_1000 !== undefined ? item.ps_1000 : ''}
                      </td>

                      {/* 2000 */}
                      <td className="border-r border-slate-300 dark:border-slate-700 px-3 py-2.5 text-center font-bold text-slate-900 dark:text-white">
                        {item.ps_2000 !== null && item.ps_2000 !== undefined ? item.ps_2000 : ''}
                      </td>

                      {/* 4000 */}
                      <td className="border-r border-slate-300 dark:border-slate-700 px-3 py-2.5 text-center font-bold text-slate-900 dark:text-white">
                        {item.ps_4000 !== null && item.ps_4000 !== undefined ? item.ps_4000 : ''}
                      </td>

                      {/* AKSI */}
                      <td className="px-2 py-2 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition"
                            title="Edit baris part"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg transition"
                            title="Hapus baris part"
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

        {/* Footer Summary Row */}
        <div className="bg-slate-50 dark:bg-slate-800/70 px-5 py-3 border-t border-slate-300 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span>
              Menampilkan <strong>{filteredParts.length}</strong> dari <strong>{partServices.length}</strong> total baris part
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>
              Sinkronisasi Fleet: <strong>{equipments.length} Unit Armada Terdaftar</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-[11px]">Database Part Matrix Terintegrasi Master Unit & Plan</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: TAMBAH / EDIT BARIS PART SERVICE
          Dilengkapi Sinkronisasi Cepat dengan Unit Armada
          ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingItem ? 'Edit Baris Part Service' : 'Tambah Baris Part Service Matrix'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Data suku cadang dan alokasi kuantitas servis berkala (250 s/d 4000 jam)
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              {/* Quick Pick from Master Unit & Plan */}
              {!editingItem && equipments.length > 0 && (
                <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <label className="block text-xs font-bold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    Pilih Cepat Dari Unit Armada Master Unit & Plan ({equipments.length} Unit)
                  </label>
                  <select
                    onChange={handleSelectMasterUnit}
                    defaultValue=""
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
                  >
                    <option value="">-- Pilih Unit Armada (Mengisi otomatis Equipment & Model) --</option>
                    {equipments.map(eq => (
                      <option key={eq.no_unit} value={eq.no_unit}>
                        {eq.no_unit} — {eq.model} ({eq.tipe || eq.unit_type}) [{eq.status}]
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Equipment */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Equipment *
                  </label>
                  <input
                    type="text"
                    value={formEquipment}
                    onChange={e => setFormEquipment(e.target.value.toUpperCase())}
                    placeholder="Contoh: DUMP TRUCK, EXCAVATOR, BULLDOZER"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none uppercase font-semibold"
                    required
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Model Unit *
                  </label>
                  <input
                    type="text"
                    value={formModel}
                    onChange={e => setFormModel(e.target.value.toUpperCase())}
                    placeholder="Contoh: SHACMAN F3000, CAT 330 GX, CAT D8 GC"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none uppercase font-semibold"
                    required
                  />
                </div>

                {/* Part Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Part Name (Nama Suku Cadang) *
                  </label>
                  <input
                    type="text"
                    value={formPartName}
                    onChange={e => setFormPartName(e.target.value)}
                    placeholder="Contoh: ENGINE OIL, FUEL FILTER"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none uppercase"
                    required
                  />
                </div>

                {/* Part Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Part Number (Nomor Part / Spek) *
                  </label>
                  <input
                    type="text"
                    value={formPartNumber}
                    onChange={e => setFormPartNumber(e.target.value)}
                    placeholder="Contoh: SAE 15W-40, 1R-1808, 61000070005"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none uppercase font-mono"
                    required
                  />
                </div>

                {/* Category */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Komponen
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="Lubricant & Oil">Lubricant & Oil (Pelumas & Oli)</option>
                    <option value="Filter">Filter (Saringan Bahan Bakar, Oli, Udara, Hidrolik)</option>
                    <option value="Belt & Drive">Belt & Drive (Tali Kipas Alternator / AC)</option>
                    <option value="Engine Parts">Engine Parts (Komponen Mesin / PCV Valve)</option>
                    <option value="Consumable & Lab">Consumable & Lab (Botol Sampling SOS, Grease)</option>
                    <option value="Undercarriage">Undercarriage & Hardware</option>
                  </select>
                </div>
              </div>

              {/* Interval Service Qty Grid (250, 500, 1000, 2000, 4000) */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                  Kuantitas Kebutuhan Per Interval Service (Kosongkan jika tidak diganti)
                </h4>
                <div className="grid grid-cols-5 gap-2.5 text-center">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      250
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={formPS250}
                      onChange={e => setFormPS250(e.target.value)}
                      placeholder="-"
                      className="w-full px-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-center font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      500
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={formPS500}
                      onChange={e => setFormPS500(e.target.value)}
                      placeholder="-"
                      className="w-full px-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-center font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      1000
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={formPS1000}
                      onChange={e => setFormPS1000(e.target.value)}
                      placeholder="-"
                      className="w-full px-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-center font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      2000
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={formPS2000}
                      onChange={e => setFormPS2000(e.target.value)}
                      placeholder="-"
                      className="w-full px-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-center font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      4000
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={formPS4000}
                      onChange={e => setFormPS4000(e.target.value)}
                      placeholder="-"
                      className="w-full px-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-center font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan / Spesifikasi Tambahan
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Keterangan kapasitas oli, nomor part alternatif, atau spesifikasi mekanik..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{loading ? 'Menyimpan...' : 'Simpan Data Part'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
