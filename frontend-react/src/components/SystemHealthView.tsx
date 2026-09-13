import React, { useState } from 'react';
import { Database, Download, Server, ShieldCheck, CheckCircle2, HardDrive, Cpu, ShieldAlert, Zap } from 'lucide-react';
import { api } from '../services/api';

interface SystemHealthViewProps {
  onRefresh: () => void;
  latency: number;
  apiOnline: boolean;
}

export const SystemHealthView: React.FC<SystemHealthViewProps> = ({ latency, apiOnline, onRefresh }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    api.triggerBackupDownload();
    setTimeout(() => setDownloading(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1-Click Backup Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>SISTEM PENCADANGAN OTOMATIS & INTEGRAL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Pencadangan Sistem Lengkap 1-Klik (.ZIP)</h2>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Mengompresi database SQLite fisik (<code className="bg-blue-800/60 px-1.5 py-0.5 rounded text-yellow-200">database.sqlite</code>), berkas SQL dump MySQL phpMyAdmin, seluruh berkas foto inspeksi teknis di <code className="bg-blue-800/60 px-1.5 py-0.5 rounded text-yellow-200">storage/app/public/</code>, serta ringkasan JSON ke dalam 1 berkas arsip .ZIP terenkripsi.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-blue-700 font-bold text-sm shadow-xl shadow-blue-900/30 transition-all hover:-translate-y-0.5 flex-shrink-0 relative z-10 cursor-pointer disabled:opacity-75"
        >
          <Download className={`w-4 h-4 text-blue-600 ${downloading ? 'animate-bounce' : ''}`} />
          <span>{downloading ? 'Memproses Arsip...' : 'Unduh Paket .ZIP Sekarang'}</span>
        </button>

        {/* Decorative circle background */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Grid Status Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel 1: Database & Concurrency */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Spesifikasi SQLite Engine</h3>
                <p className="text-xs text-slate-400">Arsitektur penyimpanan lokal cepat & handal</p>
              </div>
            </div>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>ACTIVE</span>
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Driver Database</span>
              <span className="font-bold text-slate-800">SQLite 3 (Local Single File)</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Journal Mode</span>
              <span className="font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded-lg">WAL (Write-Ahead Logging)</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Lock Busy Timeout</span>
              <span className="font-mono font-bold text-slate-700">5,000 ms</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Synchronous Setting</span>
              <span className="font-bold text-slate-800">NORMAL (High Speed)</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-500 font-medium">Latensi & Status API</span>
              <span className="font-bold text-emerald-600 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{apiOnline ? `Online (${latency} ms)` : 'Offline'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Panel 2: Infrastructure & Deployment */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Lingkungan VPS Coolify</h3>
                <p className="text-xs text-slate-400">Spesifikasi container Docker production</p>
              </div>
            </div>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-bold">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              <span>DOCKER</span>
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Backend Framework</span>
              <span className="font-bold text-slate-800">Laravel 13 (PHP 8.4-FPM)</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Frontend Stack</span>
              <span className="font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded-lg">React 18 + Vite SPA</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Web Engine</span>
              <span className="font-bold text-slate-800">Nginx Alpine + FastCGI</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Process Manager</span>
              <span className="font-bold text-slate-800">Supervisord Daemon</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-500 font-medium">Keamanan Header</span>
              <span className="font-bold text-emerald-600">HSTS, CSP, X-Frame-Options</span>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Volumes Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm mb-3">
          <HardDrive className="w-4 h-4 text-blue-600" />
          <span>Persistent Storage Volumes Terkonfigurasi</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 block mb-1">Volume Database (Abadi):</span>
            <code className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md block">/var/www/html/database</code>
            <p className="text-[11px] text-slate-500 mt-1">Menjamin file SQLite tidak hilang saat container VPS Coolify di-restart atau re-deploy.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 block mb-1">Volume Berkas Unggahan:</span>
            <code className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md block">/var/www/html/storage/app/public</code>
            <p className="text-[11px] text-slate-500 mt-1">Seluruh foto kerusakan P2H dan dokumen lampiran tersimpan secara permanen.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

