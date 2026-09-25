<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * TargetJamOperasi — target HM dan jadwal PM per unit per bulan.
 */
class TargetJamOperasi extends Model
{
    use HasFactory;

    protected $table = 'target_jam_operasi';
    protected $guarded = [];

    protected $casts = [
        'est_hm'                   => 'float',
        'next_service_hours_due'   => 'float',
        'next_service_hours_due_2' => 'float',
        'next_service_type_hm'     => 'float',
        'downtime_pm'              => 'float',
        'downtime_backlog'         => 'float',
        'downtime_midlife'         => 'float',
        'downtime_pcr'             => 'float',
        'downtime_unscheduled'     => 'float',
        'target_operating_hours'   => 'float',
        'target_pa'                => 'float',
        'pm_250'                   => 'integer',
        'pm_500'                   => 'integer',
        'pm_1000'                  => 'integer',
        'pm_2000'                  => 'integer',
        'pm_4000'                  => 'integer',
        'pm_other'                 => 'integer',
        'ba_gg'                    => 'integer',
        'oil_fe'                   => 'integer',
        'pos'                      => 'integer',
        'plan_year'                => 'integer',
        'plan_month'               => 'integer',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Unit yang ditarget */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(MasterEquip::class, 'equip_no', 'equip_no');
    }

    // ─── Accessor ───────────────────────────────────────────────────

    /** Total event PM dalam bulan ini */
    public function getTotalPmEventsAttribute(): int
    {
        return ($this->pm_250 ?? 0)
             + ($this->pm_500 ?? 0)
             + ($this->pm_1000 ?? 0)
             + ($this->pm_2000 ?? 0)
             + ($this->pm_4000 ?? 0)
             + ($this->pm_other ?? 0);
    }

    /** Total downtime terencana 1 bulan (jam) */
    public function getTotalPlannedDowntimeAttribute(): float
    {
        return ($this->downtime_pm ?? 0)
             + ($this->downtime_backlog ?? 0)
             + ($this->downtime_midlife ?? 0)
             + ($this->downtime_pcr ?? 0)
             + ($this->downtime_unscheduled ?? 0);
    }
}
