import React, { useRef, useEffect, useState } from 'react';
import {
  Boxes,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  ArrowRight,
  Database,
  Layers,
  Activity,
  Info
} from 'lucide-react';
import { Equipment, WorkOrder, Backlog, DailyHM, PartItem, ToolItem } from '../types';

interface Database3dViewProps {
  equipments?: Equipment[];
  workOrders?: WorkOrder[];
  backlogs?: Backlog[];
  dailyHms?: DailyHM[];
  parts?: PartItem[];
  tools?: ToolItem[];
  onNavigate?: (tab: any) => void;
}

interface GraphNode {
  id: string;
  name: string;
  category: 'Executive' | 'Maintenance' | 'Operations' | 'Planning' | 'Master Data' | 'Admin';
  color: string;
  radius: number;
  x: number;
  y: number;
  z: number;
  desc: string;
  targetTab?: string;
  proj?: { x: number; y: number; z: number; scale: number };
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

const INITIAL_NODES: GraphNode[] = [
  // Executive & KPI
  { id: 'top-management', name: 'Top Management KPI', category: 'Executive', color: '#8b5cf6', radius: 18, x: 0, y: 160, z: 0, desc: 'Ringkasan resume eksekutif 1 halaman dan health score armada untuk pimpinan.', targetTab: 'top_management' },
  { id: 'database-3d', name: 'Relasi Database 3D', category: 'Executive', color: '#6366f1', radius: 16, x: -80, y: 140, z: 60, desc: 'Visualisasi graph 3D hubungan relasi antar modul dan tabel data operasional.', targetTab: 'database_3d' },
  { id: 'dashboard', name: 'Operational Dashboard', category: 'Executive', color: '#3b82f6', radius: 17, x: 80, y: 140, z: -60, desc: 'Dashboard operasional real-time status board unit, MTBF, MTTR, dan KPI harian.', targetTab: 'dashboard' },

  // Maintenance Hub
  { id: 'buat-wo', name: 'Buat Work Order (SPK)', category: 'Maintenance', color: '#ef4444', radius: 16, x: 140, y: 40, z: 80, desc: 'Penerbitan Surat Perintah Kerja (SPK / WO) perbaikan unit breakdown.', targetTab: 'wo' },
  { id: 'list-wo', name: 'Daftar Work Orders', category: 'Maintenance', color: '#f97316', radius: 17, x: 120, y: 0, z: 120, desc: 'Monitoring status WO (Open, Progress, Waiting Parts, Closed) dan estimasi downtime.', targetTab: 'wo' },
  { id: 'backlog', name: 'Backlog Defect Management', category: 'Maintenance', color: '#f59e0b', radius: 15, x: 160, y: -40, z: 60, desc: 'Tracking pekerjaan tertunda yang menunggu sparepart atau jadwal shutdown.', targetTab: 'backlog' },
  { id: 'pcr', name: 'Planned Component Replacement (PCR)', category: 'Maintenance', color: '#06b6d4', radius: 16, x: 140, y: -80, z: -40, desc: 'Pemantauan umur pakai komponen utama, estimasi sisa jam kerja, dan biaya overhaul.', targetTab: 'pcr' },
  { id: 'swab-component', name: 'Component Swapping (Kanibalisasi)', category: 'Maintenance', color: '#ec4899', radius: 15, x: 60, y: -120, z: 80, desc: 'Pencatatan transfer komponen antarunit (donor ke penerima) dan status restorasi.', targetTab: 'swab' },
  { id: 'far', name: 'Failure Analysis (FAR)', category: 'Maintenance', color: '#dc2626', radius: 16, x: 160, y: 60, z: -60, desc: 'Analisis akar masalah kerusakan kritis (RCFA) menggunakan metode 5-Why dan Fishbone.', targetTab: 'far' },

  // Operations
  { id: 'daily-hm', name: 'Daily Hour Meter (HM)', category: 'Operations', color: '#0ea5e9', radius: 16, x: -140, y: 40, z: 80, desc: 'Pencatatan jam kerja harian armada (Start HM, Stop HM, KM) dan konsumsi BBM.', targetTab: 'daily_hm' },
  { id: 'aktifitas', name: 'Laporan Aktivitas Mekanik', category: 'Operations', color: '#14b8a6', radius: 15, x: -160, y: -20, z: 60, desc: 'Logbook aktivitas kerja per shift teknisi/mekanik dan realisasi jam kerja.', targetTab: 'aktifitas' },
  { id: 'inspection', name: 'P2H Daily Inspection', category: 'Operations', color: '#059669', radius: 15, x: -120, y: 60, z: 120, desc: 'Pemeriksaan harian pre-operational checklist (P2H 12 Parameter) sebelum unit operasi.', targetTab: 'p2h' },

  // Planning & Coordination
  { id: 'monthly-budget', name: 'Plan Budget Bulanan', category: 'Planning', color: '#10b981', radius: 16, x: 40, y: 100, z: -120, desc: 'Pengendalian alokasi anggaran maintenance per kategori vs realisasi pengeluaran.', targetTab: 'monthly_budget' },
  { id: 'meeting-notes', name: 'Notulen Rapat & Action Items', category: 'Planning', color: '#6366f1', radius: 15, x: -40, y: 100, z: -120, desc: 'Pencatatan hasil rapat koordinasi plant, tindak lanjut action items, dan PIC.', targetTab: 'meetings' },

  // Master Data
  { id: 'master-unit', name: 'Master Unit & Fleet Plan', category: 'Master Data', color: '#2563eb', radius: 18, x: -60, y: -80, z: -60, desc: 'Database seluruh armada alat berat, target jam kerja produksi, dan jadwal service.', targetTab: 'fleet' },
  { id: 'master-stock', name: 'Master Stock Spareparts', category: 'Master Data', color: '#d97706', radius: 17, x: 40, y: -60, z: -100, desc: 'Katalog suku cadang, part number, deskripsi, satuan, dan saldo akhir gudang.', targetTab: 'parts' },
  { id: 'master-tools', name: 'Master Special Tools', category: 'Master Data', color: '#b45309', radius: 15, x: 80, y: -120, z: -60, desc: 'Inventarisasi special tools, torque wrench, scanner diagnostik, dan peminjaman.', targetTab: 'tools' },
  { id: 'master-mekanik', name: 'Master Mekanik & Crew', category: 'Master Data', color: '#0891b2', radius: 15, x: -100, y: -80, z: 20, desc: 'Daftar personil mekanik plant dan tim operator pelapor kerusakan.', targetTab: 'master_crew' },
  { id: 'master-comp', name: 'Master Komponen', category: 'Master Data', color: '#475569', radius: 14, x: 0, y: -140, z: 0, desc: 'Struktur hierarki Major Component dan Minor Component alat berat.', targetTab: 'master_crew' },
  { id: 'part-usage', name: 'Buku Besar Pemakaian Part', category: 'Master Data', color: '#e11d48', radius: 14, x: 60, y: -20, z: -60, desc: 'Riwayat pemakaian sparepart yang terpasang pada masing-masing Work Order.', targetTab: 'monthly_budget' },

  // Admin & System
  { id: 'manage-users', name: 'Kelola User & Hak Akses', category: 'Admin', color: '#7c3aed', radius: 14, x: -80, y: -140, z: -80, desc: 'Pengaturan akun login pengguna, approval pendaftaran, dan hak akses fitur.', targetTab: 'manage_users' },
  { id: 'pengaturan', name: 'Pengaturan Sistem', category: 'Admin', color: '#475569', radius: 14, x: -140, y: -100, z: -40, desc: 'Konfigurasi parameter site, kode plant, auto-refresh, dan backup database.', targetTab: 'settings' },
  { id: 'systemlogs', name: 'System Audit Logs', category: 'Admin', color: '#334155', radius: 13, x: -160, y: -60, z: -100, desc: 'Audit trail pencatatan seluruh aktivitas CRUD, autentikasi, dan mutasi data.', targetTab: 'system' }
];

const INITIAL_EDGES: GraphEdge[] = [
  { from: 'master-unit', to: 'daily-hm', label: 'Mencatat Jam Kerja' },
  { from: 'master-unit', to: 'buat-wo', label: 'Unit Breakdown' },
  { from: 'master-unit', to: 'pcr', label: 'Lifetime Monitoring' },
  { from: 'master-unit', to: 'swab-component', label: 'Donor / Recipient' },
  { from: 'daily-hm', to: 'dashboard', label: 'EWH & Utilisasi' },
  { from: 'daily-hm', to: 'pcr', label: 'Akumulasi Umur HM' },
  { from: 'buat-wo', to: 'list-wo', label: 'Penerbitan WO' },
  { from: 'list-wo', to: 'backlog', label: 'Pending Sparepart' },
  { from: 'list-wo', to: 'master-stock', label: 'Pengambilan Part' },
  { from: 'list-wo', to: 'aktifitas', label: 'Penugasan Mekanik' },
  { from: 'list-wo', to: 'far', label: 'RCFA Breakdown Kritis' },
  { from: 'list-wo', to: 'dashboard', label: 'MTBF & MTTR' },
  { from: 'inspection', to: 'buat-wo', label: 'Temuan Kerusakan' },
  { from: 'master-stock', to: 'part-usage', label: 'Log Pemakaian' },
  { from: 'master-stock', to: 'monthly-budget', label: 'Realisasi Biaya Part' },
  { from: 'master-tools', to: 'aktifitas', label: 'Peminjaman Alat' },
  { from: 'master-mekanik', to: 'aktifitas', label: 'Shift Logbook' },
  { from: 'master-comp', to: 'pcr', label: 'Struktur Komponen' },
  { from: 'monthly-budget', to: 'top-management', label: 'Cost vs Budget' },
  { from: 'dashboard', to: 'top-management', label: 'Fleet Health Briefing' },
  { from: 'meeting-notes', to: 'top-management', label: 'Action Items' },
  { from: 'manage-users', to: 'systemlogs', label: 'Audit Trail' }
];

export const Database3dView: React.FC<Database3dViewProps> = ({
  equipments = [],
  workOrders = [],
  backlogs = [],
  dailyHms = [],
  parts = [],
  tools = [],
  onNavigate
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [autoRotate, setAutoRotate] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  const rotationRef = useRef({ x: 0.35, y: 0.55 });
  const zoomRef = useRef(1.0);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);
  const animIdRef = useRef<number | null>(null);

  // Sync state with refs
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    zoomRef.current = zoomLevel;
  }, [zoomLevel]);

  const categories = ['ALL', 'Executive', 'Maintenance', 'Operations', 'Planning', 'Master Data', 'Admin'];

  const getRecordCount = (nodeId: string): number | string => {
    switch (nodeId) {
      case 'master-unit':
        return equipments.length;
      case 'list-wo':
      case 'buat-wo':
        return workOrders.length;
      case 'backlog':
        return backlogs.length;
      case 'daily-hm':
        return dailyHms.length;
      case 'master-stock':
      case 'part-usage':
        return parts.length;
      case 'master-tools':
        return tools.length;
      default:
        return 'Terkoneksi';
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (containerRef.current && canvas) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = Math.max(560, window.innerHeight - 340);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse & Touch Listeners
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        rotationRef.current.y += dx * 0.006;
        rotationRef.current.x += dy * 0.006;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomRef.current -= e.deltaY * 0.001;
      zoomRef.current = Math.max(0.4, Math.min(2.5, zoomRef.current));
      setZoomLevel(zoomRef.current);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let closest: GraphNode | null = null;
      let minD = 999;

      INITIAL_NODES.forEach(node => {
        if (node.proj) {
          const d = Math.hypot(node.proj.x - mx, node.proj.y - my);
          const hitRadius = node.radius * node.proj.scale + 10;
          if (d < hitRadius && d < minD) {
            minD = d;
            closest = node;
          }
        }
      });

      if (closest) {
        setSelectedNode(closest);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('click', handleClick);

    // Main 3D Rendering Loop
    const draw = () => {
      if (autoRotateRef.current && !isDraggingRef.current) {
        rotationRef.current.y += 0.0025;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Gradient
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        60,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 1.4
      );
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid Stars / Particles background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let i = 0; i < 40; i++) {
        const px = (Math.sin(i * 99 + Date.now() * 0.0001) * 0.5 + 0.5) * canvas.width;
        const py = (Math.cos(i * 33 + Date.now() * 0.0001) * 0.5 + 0.5) * canvas.height;
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3D Projection Math
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const fov = 420;

      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);

      // Project all nodes
      INITIAL_NODES.forEach(node => {
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.z * cosY + node.x * sinY;

        const y2 = node.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + node.y * sinX + 380;

        const scale = (fov / (fov + z2)) * zoomRef.current;
        node.proj = {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale
        };
      });

      // Draw Edges
      INITIAL_EDGES.forEach(edge => {
        const fromNode = INITIAL_NODES.find(n => n.id === edge.from);
        const toNode = INITIAL_NODES.find(n => n.id === edge.to);
        if (!fromNode || !toNode || !fromNode.proj || !toNode.proj) return;

        const isHighlight =
          selectedNode && (selectedNode.id === fromNode.id || selectedNode.id === toNode.id);
        const isFiltered =
          activeCategory === 'ALL' ||
          fromNode.category === activeCategory ||
          toNode.category === activeCategory;

        ctx.beginPath();
        ctx.moveTo(fromNode.proj.x, fromNode.proj.y);
        ctx.lineTo(toNode.proj.x, toNode.proj.y);

        if (isHighlight) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.4;
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = isFiltered ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.06)';
          ctx.lineWidth = isFiltered ? 1 : 0.5;
          ctx.setLineDash([4, 4]);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Painter's Algorithm Z-sorting
      const sortedNodes = [...INITIAL_NODES].sort((a, b) => (b.proj?.z || 0) - (a.proj?.z || 0));

      // Draw Nodes
      sortedNodes.forEach(node => {
        const p = node.proj;
        if (!p) return;

        const isSelected = selectedNode && selectedNode.id === node.id;
        const isFiltered = activeCategory === 'ALL' || node.category === activeCategory;
        const r = node.radius * p.scale * (isSelected ? 1.35 : 1.0);

        // Outer Glow
        if (isSelected || isFiltered) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, r + 6, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.4)' : `${node.color}25`;
          ctx.fill();
        }

        // Node Sphere with light gradient
        const grad = ctx.createRadialGradient(
          p.x - r * 0.3,
          p.y - r * 0.3,
          r * 0.1,
          p.x,
          p.y,
          r
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, node.color);
        grad.addColorStop(1, '#090d16');

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(3, r), 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Border Stroke
        ctx.strokeStyle = isSelected ? '#ffffff' : isFiltered ? node.color : 'rgba(255,255,255,0.2)';
        ctx.lineWidth = isSelected ? 2.5 : 1;
        ctx.stroke();

        // Node Label
        if (p.scale > 0.45 && (isFiltered || isSelected)) {
          ctx.font = `${isSelected ? 'bold ' : ''}${Math.round(11 * p.scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillStyle = isSelected ? '#38bdf8' : '#e2e8f0';
          ctx.fillText(node.name, p.x, p.y + r + 13 * p.scale);
        }
      });

      animIdRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('click', handleClick);
    };
  }, [activeCategory, selectedNode]);

  const handleResetCamera = () => {
    rotationRef.current = { x: 0.35, y: 0.55 };
    zoomRef.current = 1.0;
    setZoomLevel(1.0);
    setSelectedNode(null);
  };

  const handleZoomIn = () => {
    const next = Math.min(2.5, zoomRef.current + 0.2);
    zoomRef.current = next;
    setZoomLevel(next);
  };

  const handleZoomOut = () => {
    const next = Math.max(0.4, zoomRef.current - 0.2);
    zoomRef.current = next;
    setZoomLevel(next);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner Header */}
      <div className="bg-[#0f172a] text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Interactive 3D Engine
              </span>
              <span className="text-xs text-slate-400 font-bold">
                WOSys Knowledge Graph • 24 Entitas & Relasi
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Boxes className="w-7 h-7 text-cyan-400" />
              Relasi Database & Arsitektur ERP 3D
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Visualisasi graph 3D interaktif yang menggambarkan hubungan relasi data antar 24 tabel, modul transaksi, dan struktur ERP pertambangan.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                autoRotate
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              {autoRotate ? 'Rotasi Aktif' : 'Rotasi Diam'}
            </button>

            <button
              onClick={handleZoomIn}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
              title="Perbesar (Zoom In)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={handleZoomOut}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
              title="Perkecil (Zoom Out)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetCamera}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
              title="Reset Posisi Kamera"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            Filter Kategori:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Viewport & Node Inspector Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main 3D Canvas Area */}
        <div
          ref={containerRef}
          className="lg:col-span-3 bg-[#090d16] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative min-h-[560px]"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-grab active:cursor-grabbing block"
          />

          {/* Floating Instructions Overlay */}
          <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-[11px] text-slate-400 flex items-center gap-3 pointer-events-none">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Tarik Mouse: Putar Bola 3D
            </span>
            <span>•</span>
            <span>Scroll: Zoom</span>
            <span>•</span>
            <span>Klik Node: Lihat Skema & Data</span>
          </div>
        </div>

        {/* Selected Node Inspector Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">Inspektor Skema</h3>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                Live Meta
              </span>
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <span
                    className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white mb-2"
                    style={{ backgroundColor: selectedNode.color }}
                  >
                    {selectedNode.category}
                  </span>
                  <h4 className="text-base font-black text-slate-900 leading-snug">
                    {selectedNode.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {selectedNode.desc}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Koneksi Data:</span>
                    <span className="font-black text-slate-800">
                      {getRecordCount(selectedNode.id)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">ID Modul:</span>
                    <span className="font-mono font-bold text-slate-700">{selectedNode.id}</span>
                  </div>
                </div>

                {/* Related Nodes */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Relasi Terkait:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {INITIAL_EDGES.filter(
                      e => e.from === selectedNode.id || e.to === selectedNode.id
                    ).map((edge, idx) => {
                      const otherId = edge.from === selectedNode.id ? edge.to : edge.from;
                      const otherNode = INITIAL_NODES.find(n => n.id === otherId);
                      return (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold"
                          title={edge.label}
                        >
                          → {otherNode?.name || otherId}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Navigation Button */}
                {selectedNode.targetTab && onNavigate && (
                  <button
                    onClick={() => onNavigate(selectedNode.targetTab)}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    Buka Modul {selectedNode.name}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <Info className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-medium">
                  Klik salah satu node pada bola 3D untuk melihat rincian skema tabel, relasi, dan jumlah data.
                </p>
              </div>
            )}
          </div>

            {/* Entity Summary Stats */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Layers className="w-4 h-4 text-emerald-600" />
              Ringkasan Entitas ERP
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-lg font-black text-slate-800">{equipments.length}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Armada Unit</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-lg font-black text-blue-600">{workOrders.length}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Work Orders</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-lg font-black text-amber-600">{backlogs.length}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Backlog Defect</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-lg font-black text-emerald-600">{parts.length}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Spareparts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
