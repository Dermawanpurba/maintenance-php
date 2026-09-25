<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * PsSchedule — Entitas Jadwal Servis Berkala Harian/Shift (Closed-Loop Maintenance).
 * Mengintegrasikan Setup Planning, Nomor Eksekusi SAP (WO, Notif, Reservasi Part),
 * Referensi Pemantauan Kondisi (PAP/SOS, PPU, P2H), dan Multi-Backlog Bundling.
 */
class PsSchedule extends Model
{
    use HasFactory;

    protected $table = 'ps_schedules';
    protected $guarded = [];

    protected $casts = [
        'current_hm'        => 'float',
        'plan_hm'           => 'float',
        'est_hours'         => 'float',
        'av_parts_percent'  => 'float',
        'actual_hm'         => 'float',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────────

    /** Unit alat berat / armada */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(MasterEquip::class, 'equip_no', 'equip_no');
    }

    /** Work Order induk untuk PS ini */
    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class, 'wo_no', 'no_wo');
    }

    /** Paket pekerjaan perbaikan tertunda (Multi-Backlog Bundling) */
    public function backlogItems(): HasMany
    {
        return $this->hasMany(PsScheduleBacklog::class, 'ps_schedule_id', 'id');
    }

    /** Tautan ke hasil analisis pelumas laboratorium (PAP / SOS) */
    public function oilSample(): BelongsTo
    {
        return $this->belongsTo(OilSample::class, 'pap_ref', 'sample_code');
    }

    /** Scope untuk filter tanggal dan sub-section */
    public function scopeForDate($query, $date)
    {
        return $query->where('schedule_date', $date);
    }

    public function scopeForSubSection($query, $subSection)
    {
        if (blank($subSection) || $subSection === 'ALL') {
            return $query;
        }
        return $query->where('sub_section', $subSection);
    }
}
