<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Model unit/armada — hub pusat semua data per unit.
 *
 * Semua relasi menggunakan equip_no sebagai foreign key natural
 * karena skema legacy tidak pakai FK integer.
 */
class MasterEquip extends Model
{
    use HasFactory;

    protected $table = 'master_equips';
    protected $guarded = [];

    // ─── Relasi Katalog & Model ─────────────────────────────────────

    /** Direktori model alat berat (P3.2) */
    public function masterModel(): BelongsTo
    {
        return $this->belongsTo(MasterModel::class, 'model_code', 'model_code');
    }

    // ─── Relasi Planning ────────────────────────────────────────────

    /** Rencana operasi bulanan unit ini */
    public function planAlat(): HasOne
    {
        return $this->hasOne(PlanAlat::class, 'equip_no', 'equip_no');
    }

    /** Jadwal & riwayat service (PS interval) */
    public function planService(): HasOne
    {
        return $this->hasOne(PlanService::class, 'equip_no', 'equip_no');
    }

    /** Target jam operasi bulanan (bisa banyak per bulan/tahun) */
    public function targetJamOperasi(): HasMany
    {
        return $this->hasMany(TargetJamOperasi::class, 'equip_no', 'equip_no');
    }

    // ─── Relasi Operasional ─────────────────────────────────────────

    /** Semua Work Order untuk unit ini */
    public function workOrders(): HasMany
    {
        return $this->hasMany(WorkOrder::class, 'equip_no', 'equip_no');
    }

    /** WO aktif (belum CLOSED) */
    public function activeWorkOrders(): HasMany
    {
        return $this->hasMany(WorkOrder::class, 'equip_no', 'equip_no')
            ->whereNotIn('status', ['CLOSED', 'CANCEL']);
    }

    /** Catatan HM harian unit */
    public function dailyHms(): HasMany
    {
        return $this->hasMany(DailyHm::class, 'equip_no', 'equip_no');
    }

    /** Rekap HM hari ini */
    public function todayHm(): HasOne
    {
        return $this->hasOne(DailyHm::class, 'equip_no', 'equip_no')
            ->latestOfMany('tanggal');
    }

    /** PM Records (Preventive Maintenance) */
    public function pmRecords(): HasMany
    {
        return $this->hasMany(PmRecord::class, 'equip_no', 'equip_no');
    }

    /** PM terakhir yang selesai */
    public function latestPmRecord(): HasOne
    {
        return $this->hasOne(PmRecord::class, 'equip_no', 'equip_no')
            ->where('status', 'DONE')
            ->latestOfMany('hm_pm');
    }

    /** Form inspeksi P2H */
    public function inspections(): HasMany
    {
        return $this->hasMany(Inspection::class, 'equip_no', 'equip_no');
    }

    /** Riwayat servis tersimpan */
    public function serviceHistories(): HasMany
    {
        return $this->hasMany(ServiceHistory::class, 'equip_no', 'equip_no');
    }

    // ─── Relasi Condition Monitoring ────────────────────────────────

    /** Sampel SOS (oli) */
    public function oilSamples(): HasMany
    {
        return $this->hasMany(OilSample::class, 'equip_no', 'equip_no');
    }

    /** Sampel SOS terbaru */
    public function latestOilSample(): HasOne
    {
        return $this->hasOne(OilSample::class, 'equip_no', 'equip_no')
            ->latestOfMany('id');
    }

    /** PPU (Periodic Progress/Undercarriage) */
    public function ppuRecords(): HasMany
    {
        return $this->hasMany(PpuRecord::class, 'unit_no', 'equip_no');
    }

    /** Komponen PCR (Component Life Tracking) */
    public function pcrComponents(): HasMany
    {
        return $this->hasMany(PcrComponent::class, 'equip_no', 'equip_no');
    }

    /** Daftar backlog defect/temuan */
    public function backlogs(): HasMany
    {
        return $this->hasMany(Backlog::class, 'equip_no', 'equip_no');
    }

    /** Backlog yang masih open */
    public function openBacklogs(): HasMany
    {
        return $this->hasMany(Backlog::class, 'equip_no', 'equip_no')
            ->where('status', 'OPEN');
    }

    /** Failure Analysis / RCA */
    public function failureAnalyses(): HasMany
    {
        return $this->hasMany(FailureAnalysis::class, 'equip_no', 'equip_no');
    }

    /** Komponen yang dipinjam/diswap dari unit lain */
    public function swabComponentsAsDonor(): HasMany
    {
        return $this->hasMany(SwabComponent::class, 'donor_unit', 'equip_no');
    }

    /** Komponen yang diterima dari unit lain */
    public function swabComponentsAsTarget(): HasMany
    {
        return $this->hasMany(SwabComponent::class, 'target_unit', 'equip_no');
    }

    // ─── Relasi Keuangan ─────────────────────────────────────────────

    /** Biaya operasional & perbaikan */
    public function equipmentCosts(): HasMany
    {
        return $this->hasMany(EquipmentCost::class, 'equip_no', 'equip_no');
    }

    // ─── Accessor Kalkulasi ──────────────────────────────────────────

    /**
     * Status kesehatan unit berdasarkan backlog & WO aktif.
     * Digunakan di dashboard.
     */
    public function getHealthStatusAttribute(): string
    {
        $openWo       = $this->activeWorkOrders()->count();
        $openBacklog  = $this->openBacklogs()->count();
        $status       = strtoupper($this->status ?? '');

        if (in_array($status, ['B/D', 'BREAKDOWN', 'BD'])) {
            return 'BREAKDOWN';
        }
        if ($openWo > 0)      return 'IN_REPAIR';
        if ($openBacklog > 3) return 'DEFECT';
        return 'RFU';
    }
}
