import React, { useState } from 'react';
import { FileText, Plus, Search, Calendar, Users, X, CheckCircle2, AlertCircle } from 'lucide-react';
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
    topic: '',
    discussion_summary: '',
    management_decision: '',
    critical_issue: '',
    plant_health: 'OPTIMAL',
    attendees: 'Plant Dept Head, Planner, Foreman Mekanik, Logistics',
    leader: 'Hariadi (GM Plant)',
    status: 'Open'
  });

  const filtered = notes.filter(n => {
    const title = n.topic || n.title || '';
    const agenda = n.discussion_summary || n.agenda || '';
    const decision = n.management_decision || n.decision || '';
    const q = search.toLowerCase();

    return (
      title.toLowerCase().includes(q) ||
      agenda.toLowerCase().includes(q) ||
      decision.toLowerCase().includes(q)
    );
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = form.topic || form.title;
    const decision = form.management_decision || form.decision;

    if (!title?.trim() || !decision?.trim()) {
      alert('Judul rapat dan keputusan hasil rapat wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.postAction('saveMeetingNotes', {
        ...form,
        topic: title,
        discussion_summary: form.discussion_summary || form.agenda || '',
        management_decision: decision,
        leader: form.leader || form.pic || 'Dept Head'
      });
      if (res.success) {
        setIsModalOpen(false);
        setForm({
          tanggal: new Date().toISOString().split('T')[0],
          topic: '',
          discussion_summary: '',
          management_decision: '',
          critical_issue: '',
          plant_health: 'OPTIMAL',
          attendees: 'Plant Dept Head, Planner, Foreman Mekanik, Logistics',
          leader: 'Hariadi (GM Plant)',
          status: 'Open'
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
    <div className="space-y-6 pb-12">
      {/* Top Filter & Action Bar Card */}
      <div className="bg-white border border-slate-200/80 p-4 md:p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari judul rapat / agenda / keputusan..."
            className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 w-56 sm:w-80 font-medium transition-all"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-sm shadow-blue-500/30 transition-all hover:shadow-md active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Notulen Rapat Baru</span>
        </button>
      </div>

      {/* Grid of Meeting Notes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 text-center py-16 text-slate-400 text-xs bg-white rounded-3xl border border-slate-200/80 shadow-sm">
            Belum ada notulen rapat operasional plant yang tercatat.
          </div>
        ) : (
          filtered.map((note, idx) => {
            const title = note.topic || note.title || 'Evaluasi Operasional Plant';
            const agenda = note.discussion_summary || note.agenda || '-';
            const decision = note.management_decision || note.decision || '-';
            const leader = note.leader || note.pic || 'Dept Head';
            const status = note.status || 'Open';

            return (
              <div
                key={note.id || idx}
                className="p-5 md:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-extrabold text-[9px] uppercase tracking-wider border border-blue-200/50">
                          {status}
                        </span>
                        {note.plant_health && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-[9px] uppercase tracking-wider border border-emerald-200/50">
                            {note.plant_health}
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-slate-900 text-sm leading-snug">
                        {title}
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono font-bold flex items-center gap-1.5 flex-shrink-0 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{note.tanggal}</span>
                    </span>
                  </div>

                  {/* Agenda Pembahasan */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                      Agenda Pembahasan:
                    </span>
                    <p className="text-slate-700 font-medium leading-relaxed">
                      {agenda}
                    </p>
                  </div>

                  {/* Keputusan & Tindak Lanjut */}
                  <div className="space-y-1 text-xs bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/60">
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Keputusan &amp; Tindak Lanjut:</span>
                    </span>
                    <p className="text-emerald-950 font-semibold leading-relaxed pt-0.5">
                      {decision}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                  <span className="flex items-center space-x-1.5 truncate max-w-[240px]" title={note.attendees}>
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate font-medium">{note.attendees || 'Tim Plant'}</span>
                  </span>
                  <span className="font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                    PIC: {leader}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Dialog Buat Notulen */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 text-base tracking-tight">
                  Buat Notulen Rapat Plant Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Tanggal Rapat</label>
                  <input
                    type="date"
                    required
                    value={form.tanggal}
                    onChange={e => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Pimpinan Rapat (Leader / PIC)</label>
                  <input
                    type="text"
                    value={form.leader}
                    onChange={e => setForm({ ...form, leader: e.target.value })}
                    placeholder="Contoh: Hariadi (GM Plant)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Topik / Judul Rapat</label>
                <input
                  type="text"
                  required
                  value={form.topic}
                  onChange={e => setForm({ ...form, topic: e.target.value })}
                  placeholder="Contoh: Evaluasi Mingguan Kesiapan Fisik Alat Berat"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Daftar Hadir / Peserta</label>
                <input
                  type="text"
                  value={form.attendees}
                  onChange={e => setForm({ ...form, attendees: e.target.value })}
                  placeholder="Nama atau divisi yang hadir..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Agenda &amp; Ringkasan Pembahasan</label>
                <textarea
                  rows={3}
                  value={form.discussion_summary}
                  onChange={e => setForm({ ...form, discussion_summary: e.target.value })}
                  placeholder="Poin-poin masalah dan diskusi teknis lapangan..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Keputusan &amp; Tindak Lanjut Manajemen</label>
                <textarea
                  rows={3}
                  required
                  value={form.management_decision}
                  onChange={e => setForm({ ...form, management_decision: e.target.value })}
                  placeholder="Instruksi perbaikan, penugasan PIC, deadline..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Notulen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
