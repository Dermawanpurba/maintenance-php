import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  UserX,
  Shield,
  Plus,
  Trash2,
  Search,
  RefreshCw,
  Key,
  Users,
  AlertCircle,
  X,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { AppUser } from '../types';
import { api } from '../services/api';

interface ManageUsersViewProps {
  onRefresh?: () => void;
}

export const ManageUsersView: React.FC<ManageUsersViewProps> = ({ onRefresh }) => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formUsername, setFormUsername] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formRole, setFormRole] = useState('MEKANIK');
  const [formPassword, setFormPassword] = useState('');
  const [formEmail, setFormEmail] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getUsersList();
      if (res && res.success) {
        setUsers(res.users || res.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setFeedback({ type: 'error', message: 'Gagal memuat data pengguna: ' + (err.message || 'Error server') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleApprove = async (username: string) => {
    try {
      const res = await api.approveUser({ username, status: 'ACTIVE' });
      if (res && res.success) {
        setFeedback({ type: 'success', message: `Pengguna ${username} berhasil disetujui (ACTIVE)!` });
        loadUsers();
        if (onRefresh) onRefresh();
      } else {
        setFeedback({ type: 'error', message: res?.message || 'Gagal menyetujui pengguna.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Gagal memproses approval.' });
    }
  };

  const handleReject = async (username: string) => {
    if (!window.confirm(`Yakin ingin menolak (REJECT) akses untuk pengguna ${username}?`)) return;
    try {
      const res = await api.approveUser({ username, status: 'REJECTED' });
      if (res && res.success) {
        setFeedback({ type: 'success', message: `Pengguna ${username} ditolak (REJECTED).` });
        loadUsers();
        if (onRefresh) onRefresh();
      } else {
        setFeedback({ type: 'error', message: res?.message || 'Gagal menolak pengguna.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Gagal memproses rejection.' });
    }
  };

  const handleDelete = async (username: string) => {
    if (!window.confirm(`PERINGATAN: Hapus permanen akun pengguna ${username}?`)) return;
    try {
      const res = await api.deleteUser(username);
      if (res && res.success) {
        setFeedback({ type: 'success', message: `Pengguna ${username} berhasil dihapus!` });
        loadUsers();
        if (onRefresh) onRefresh();
      } else {
        setFeedback({ type: 'error', message: res?.message || 'Gagal menghapus pengguna.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Gagal menghapus pengguna.' });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim()) return;

    try {
      setSubmitting(true);
      const payload = {
        username: formUsername.trim().toLowerCase(),
        nama: formNama.trim(),
        role: formRole,
        password: formPassword.trim() || '123456',
        email: formEmail.trim(),
        status: 'ACTIVE'
      };

      const res = await api.saveUser(payload);
      if (res && res.success) {
        setFeedback({ type: 'success', message: `Pengguna ${formUsername} berhasil didaftarkan!` });
        setIsCreateModalOpen(false);
        setFormUsername('');
        setFormNama('');
        setFormPassword('');
        setFormEmail('');
        loadUsers();
        if (onRefresh) onRefresh();
      } else {
        setFeedback({ type: 'error', message: res?.message || 'Gagal menyimpan pengguna baru.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Terjadi kesalahan jaringan.' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (u.username || '').toLowerCase().includes(q) ||
      (u.nama || u.name || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q);

    const userStatus = (u.status || 'ACTIVE').toUpperCase();
    const matchesStatus = statusFilter === 'ALL' || userStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const s = (status || 'ACTIVE').toUpperCase();
    if (s === 'ACTIVE' || s === 'APPROVED') {
      return (
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-black text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Aktif
        </span>
      );
    }
    if (s === 'REJECTED') {
      return (
        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-black text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
          <UserX className="w-3 h-3 text-rose-600" />
          Ditolak
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-black text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
        <AlertCircle className="w-3 h-3 text-amber-600" />
        Menunggu
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const r = (role || 'MEKANIK').toUpperCase();
    let color = 'bg-slate-100 text-slate-700 border-slate-200';
    if (r.includes('PLANNER') || r === 'PMC') color = 'bg-cyan-50 text-cyan-700 border-cyan-200';
    else if (r === 'ADMIN') color = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    else if (r === 'BOSS' || r.includes('HEAD') || r === 'MANAGEMENT') color = 'bg-purple-50 text-purple-700 border-purple-200';
    else if (r === 'PENGAWAS' || r === 'SUPERVISOR') color = 'bg-emerald-50 text-emerald-700 border-emerald-200';

    return (
      <span className={`px-2.5 py-0.5 border rounded-md font-bold text-[10px] uppercase tracking-wider ${color}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-[#0f172a] text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Security & Access Control
              </span>
              <span className="text-xs text-slate-400 font-bold">
                {users.length} Total Pengguna Terdaftar
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Shield className="w-7 h-7 text-blue-400" />
              Kelola Pengguna & Hak Akses
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Manajemen akun pengguna sistem WOSys ERP, persetujuan status aktivasi, dan penugasan peran operasional.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadUsers}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
              title="Segarkan Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <Plus className="w-4 h-4" />
              Tambah User
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
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
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            )}
            {feedback.message}
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari username, nama, atau role..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'ACTIVE', 'PENDING', 'REJECTED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                statusFilter === st
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st === 'ALL' ? 'Semua Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase font-black tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Pengguna</th>
                <th className="py-3.5 px-4">Nama Lengkap</th>
                <th className="py-3.5 px-4">Peran (Role)</th>
                <th className="py-3.5 px-4">Status Akun</th>
                <th className="py-3.5 px-4 text-center w-36">Aksi Persetujuan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Memuat daftar pengguna sistem...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Tidak ada pengguna yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => {
                  const statusUpper = (u.status || 'ACTIVE').toUpperCase();
                  return (
                    <tr key={u.id || u.username || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs uppercase">
                            {u.username.slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block font-mono">{u.username}</span>
                            {u.email && <span className="text-[10px] text-slate-400 block">{u.email}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{u.nama || u.name || '-'}</td>
                      <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(u.status)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {statusUpper !== 'ACTIVE' && statusUpper !== 'APPROVED' && (
                            <button
                              onClick={() => handleApprove(u.username)}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-colors"
                              title="Setujui (Approve)"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {statusUpper !== 'REJECTED' && (
                            <button
                              onClick={() => handleReject(u.username)}
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg border border-amber-200 transition-colors"
                              title="Tolak (Reject)"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(u.username)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition-colors"
                            title="Hapus Pengguna"
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

      {/* Modal Tambah User Baru */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Tambah Pengguna Baru</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Username (Wajib)
                </label>
                <input
                  type="text"
                  required
                  value={formUsername}
                  onChange={e => setFormUsername(e.target.value.toLowerCase())}
                  placeholder="Contoh: mekanik1, planner"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formNama}
                  onChange={e => setFormNama(e.target.value)}
                  placeholder="Nama teknisi / staf"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Role / Peran
                  </label>
                  <select
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="PLANNER">PLANNER / PMC</option>
                    <option value="ADMIN">ADMIN PLANT</option>
                    <option value="PENGAWAS">PENGAWAS / SPV</option>
                    <option value="MEKANIK">MEKANIK</option>
                    <option value="BOSS">MANAGEMENT / BOSS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Password Awal
                  </label>
                  <input
                    type="password"
                    value={formPassword}
                    onChange={e => setFormPassword(e.target.value)}
                    placeholder="Default: 123456"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  placeholder="user@perusahaan.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
