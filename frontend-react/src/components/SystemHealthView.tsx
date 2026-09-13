import React, { useState } from 'react';
import { Database, Download, Server, ShieldCheck, RefreshCw, FileArchive, CheckCircle2 } from 'lucide-react';
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
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* 1-Click Backup Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-800/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base">
            <FileArchive className="w-5 h-5" />
            <span>Pencadangan Sistem Lengkap 1-Klik (.ZIP)</span>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            Mengompresi database SQLite fisik (`database.sqlite`), berkas SQL dump MySQL phpMyAdmin, seluruh berkas unggahan pengguna di `storage/app/public/`, serta ringkasan ekspor data JSON (`database_export.json`) ke dalam 1 berkas arsip .ZIP.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all hover:-translate-y-0.5 flex-shrink-0"
        >
          <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
          <span>{downloading ? 'Mengunduh Arsip...' : 'Unduh Paket .ZIP Sekarang'}</span>
        </button>
      </div>

      {/* Grid Status Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Panel 1: Database & Engine */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-md">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <Database className="w-4 h-4" />
            <span>Spesifikasi Database & Concurrency</span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Database Driver</span>
              <span className="font-semibold text-white">SQLite 3 (Local Single File)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Journal Mode</span>
              <span className="font-bold text-emerald-400">WAL (Write-Ahead Logging)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Lock Busy Timeout</span>
              <span className="font-mono text-white">5000 ms</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Synchronous Mode</span>
              <span className="font-semibold text-white">NORMAL</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">API Status</span>
              <span className="font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ONLINE ({latency}ms)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Panel 2: Infrastructure & Deployment */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-md">
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
            <Server className="w-4 h-4" />
            <span>Lingkungan Container VPS Coolify</span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Backend Framework</span>
              <span className="font-semibold text-white">Laravel 13 (PHP 8.4-FPM)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Frontend Technology</span>
              <span className="font-bold text-cyan-400">React 18 + Vite + Tailwind</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Web Server</span>
              <span className="font-semibold text-white">Nginx Alpine + FastCGI</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Process Supervisor</span>
              <span className="font-semibold text-white">Supervisord Daemon</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Security Headers</span>
              <span className="font-semibold text-emerald-400">HSTS, CSP, X-Frame, X-Content-Type</span>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Volumes Notice */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-1">
        <div className="flex items-center space-x-1.5 text-slate-200 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Persistent Storage Volumes Terkonfigurasi:</span>
        </div>
        <p>• Volume Database: <span className="font-mono text-emerald-300">/var/www/html/database</span> (Database SQLite aman dan abadi saat container di-rebuild).</p>
        <p>• Volume Berkas Unggahan: <span className="font-mono text-emerald-300">/var/www/html/storage/app/public</span> (Semua berkas fisik dan foto tersimpan permanen).</p>
      </div>
    </div>
  );
};
