import React, { useState } from 'react';
import { FileText, Plus, Search, Calendar, Users, X } from 'lucide-react';
import { MeetingNote } from '../types';
import { api } from '../services/api';

interface MeetingNotesViewProps {
  notes: MeetingNote[];
  onRefresh: () => void;
}

export const MeetingNotesView: React.FC<MeetingNotesViewProps> = ({ notes, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<Partial<MeetingNote>>({
    tanggal: new Date().toISOString().split('T')[0],
    title: '',
    agenda: '',
    decision: '',
    attendees: 'Plant Dept Head, Planner, Foreman, Logistics',
    pic: 'Planner Plant',
  });

  const filtered = notes.filter(n => {
    return (
      (n.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (n.agenda || '').toLowerCase().includes(search.toLowerCase()) ||
      (n.decision || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim() || !form.decision?.trim()) {
      alert('Judul rapat dan keputusan hasil rapat wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.postAction('saveMeetingNotes', form);
      if (res.success) {
        setIsModalOpen(false);
        setForm({
          tanggal: new Date().toISOString().split('T')[0],
          title: '',
          agenda: '',
          decision: '',
          attendees: 'Plant Dept Head, Planner, Foreman, Logistics',
          pic: 'Planner Plant',
        });
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan notulen rapat');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari judul rapat / agenda / keputusan..."
            className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-56 sm:w-72"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Notulen Rapat</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 text-center py-12 text-slate-500 text-xs bg-slate-900/40 rounded-xl border border-slate-800">
            Belum ada notulen rapat operasional plant yang tercatat.
          </div>
        ) : (
          filtered.map((note, idx) => (
            <div key={note.id || idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-sm line-clamp-1">{note.title}</span>
                <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  <span>{note.tanggal}</span>
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Agenda Pembahasan:</span>
                <p className="text-slate-300 line-clamp-2">{note.agenda || '-'}</p>
              </div>

              <div className="space-y-1 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Keputusan & Tindak Lanjut:</span>
                <p className="text-slate-200">{note.decision}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center space-x-1 truncate max-w-[200px]" title={note.attendees}>
                  <Users className="w-3 h-3 text-slate-500" />
                  <span className="truncate">{note.attendees || 'Tim Plant'}</span>
                </span>
                <span className="font-semibold text-slate-300">PIC: {note.pic || 'Dept Head'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Buat Notulen Rapat Plant Baru</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Tanggal Rapat</label>
                  <input
                    type="date"
                    required
                    value={form.tanggal}
                    onChange={e => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">PIC / Notulis</label>
                  <input
                    type="text"
                    value={form.pic}
                    onChange={e => setForm({ ...form, pic: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Judul Rapat</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Evaluasi Kesiapan Alat (PA) & Pengadaan Part"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Agenda Rapat</label>
                <textarea
                  rows={2}
                  placeholder="Poin-poin masalah yang dibahas..."
                  value={form.agenda}
                  onChange={e => setForm({ ...form, agenda: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Keputusan & Tindak Lanjut</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Instruksi kerja, target tanggal selesai, dan penugasan..."
                  value={form.decision}
                  onChange={e => setForm({ ...form, decision: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Daftar Hadir / Peserta</label>
                <input
                  type="text"
                  value={form.attendees}
                  onChange={e => setForm({ ...form, attendees: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center space-x-1"
                >
                  <span>{submitting ? 'Menyimpan...' : 'Simpan Notulen'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
