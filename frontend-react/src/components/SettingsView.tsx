import React, { useState, useEffect } from 'react';
import {
  Settings,
  HardDrive,
  Download,
  ShieldCheck,
  Save,
  Clock,
  Building,
  Radio,
  CheckCircle2,
  AlertCircle,
  Database
} from 'lucide-react';
import { SettingsData } from '../types';
import { api } from '../services/api';

interface SettingsViewProps {
  initialSettings?: SettingsData;
  onRefresh?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ initialSettings, onRefresh }) => {
  const [siteName, setSiteName] = useState(
    initialSettings?.site_name || 'PT. Benamakmur Selaras Sejahtera'
  );
  const [plantCode, setPlantCode] = useState(initialSettings?.plant_code || 'PLANT-KBCT');
  const [defaultShift, setDefaultShift] = useState(initialSettings?.default_shift || '1');
  const [autoRefresh, setAutoRefresh] = useState(
    initialSettings?.auto_refresh_seconds ? String(initialSettings.auto_refresh_seconds) : '45'
  );
  const [themeColor, setThemeColor] = useState(initialSettings?.theme || 'slate');
  const [waGateway, setWaGateway] = useState(initialSettings?.wa_gateway || '');

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (initialSettings) {
      if (initialSettings.site_name) setSiteName(initialSettings.site_name);
      if (initialSettings.plant_code) setPlantCode(initialSettings.plant_code);
      if (initialSettings.default_shift) setDefaultShift(initialSettings.default_shift);
      if (initialSettings.auto_refresh_seconds) setAutoRefresh(String(initialSettings.auto_refresh_seconds));
      if (initialSettings.theme) setThemeColor(initialSettings.theme);
      if (initialSettings.wa_gateway) setWaGateway(initialSettings.wa_gateway);
    }
  }, [initialSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        site_name: siteName,
        plant_code: plantCode,
        default_shift: defaultShift,
        auto_refresh_seconds: Number(autoRefresh) || 45,
        theme: themeColor,
        wa_gateway: waGateway
      };

      const res = await api.saveSettings(payload);
      if (res && res.success) {
        setFeedback({ type: 'success', message: 'Pengaturan sistem berhasil disimpan!' });
        if (onRefresh) onRefresh();
      } else {
        setFeedback({ type: 'error', message: res?.message || 'Gagal menyimpan pengaturan.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error koneksi server.' });
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = () => {
    api.triggerBackupDownload();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Banner Header */}
      <div className="bg-[#0f172a] text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/30">
                System Configuration
              </span>
              <span className="text-xs text-slate-400 font-bold">
                Parameter Operasional & Pencadangan Data
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Settings className="w-7 h-7 text-purple-400" />
              Pengaturan Sistem ERP
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Konfigurasi parameter perusahaan, default shift operasional, interval sinkronisasi, dan manajemen backup database.
            </p>
          </div>


        </div>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-bold">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            {feedback.message}
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600 p-1">
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form (2 cols) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="w-4 h-4 text-blue-600" />
              Parameter Identitas Perusahaan & Operasional
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Perusahaan / Unit Usaha
                  </label>
                  <input
                    type="text"
                    required
                    value={siteName}
                    onChange={e => setSiteName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kode Plant / Project Site
                  </label>
                  <input
                    type="text"
                    required
                    value={plantCode}
                    onChange={e => setPlantCode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Default Shift Aktif
                  </label>
                  <select
                    value={defaultShift}
                    onChange={e => setDefaultShift(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="1">Shift 1 (Siang - 06:00 s/d 18:00)</option>
                    <option value="2">Shift 2 (Malam - 18:00 s/d 06:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Interval Sinkronisasi Otomatis (Detik)
                  </label>
                  <select
                    value={autoRefresh}
                    onChange={e => setAutoRefresh(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="30">30 Detik (High Frequency)</option>
                    <option value="45">45 Detik (Standar Rekomendasi)</option>
                    <option value="60">60 Detik (Hemat Bandwidth)</option>
                    <option value="120">120 Detik (2 Menit)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor Gateway Emergency / WhatsApp Dispatcher
                </label>
                <input
                  type="text"
                  value={waGateway}
                  onChange={e => setWaGateway(e.target.value)}
                  placeholder="Contoh: 6281234567890"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:border-blue-500 outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Nomor penanggung jawab dispatcher saat laporan breakdown darurat dikirim.
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* System & Architecture Info (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Database className="w-4 h-4 text-indigo-600" />
              Status Database & Arsitektur
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Database Engine:</span>
                <span className="font-bold text-slate-800 font-mono">SQLite 3 (WAL Mode)</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Backend Framework:</span>
                <span className="font-bold text-slate-800 font-mono">Laravel 13 (PHP 8.4)</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Frontend Engine:</span>
                <span className="font-bold text-blue-600 font-mono">React 18 + Vite SPA</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Single Source of Truth:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  database.sqlite
                </span>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};
