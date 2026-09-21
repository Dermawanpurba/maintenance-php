<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Validation\ValidationException;

/**
 * Work Order — dokumen kerja perbaikan & PM.
 *
 * Hook:
 * - saving  : validasi field wajib saat CLOSED
 * - saved   : sync status unit ke MasterEquip
 */
class WorkOrder extends Model
{
    use HasFactory;

    protected $table = 'work_orders';
    protected $guarded = [];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Unit yang dikerjakan */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(MasterEquip::class, 'equip_no', 'equip_no');
    }

    /** Aktivitas mekanik yang terlibat di WO ini */
    public function mechanicActivities(): HasMany
    {
        return $this->hasMany(MechanicActivity::class, 'no_wo', 'no_wo');
    }

    /** Suku cadang yang dipakai dalam WO ini (tabel relasional, P3.1) */
    public function parts(): HasMany
    {
        return $this->hasMany(WorkOrderPart::class, 'no_wo', 'no_wo');
    }

    /** Failure Analysis / RCA yang dibuat dari WO ini (P4.2) */
    public function failureAnalysis(): HasOne
    {
        return $this->hasOne(FailureAnalysis::class, 'no_wo', 'no_wo');
    }

    /** Backlog defect induk yang memicu WO ini (P4.1) */
    public function backlog(): BelongsTo
    {
        return $this->belongsTo(Backlog::class, 'backlog_id', 'item_id');
    }

    /** Daftar backlog yang diselesaikan oleh WO ini (P4.1) */
    public function backlogs(): HasMany
    {
        return $this->hasMany(Backlog::class, 'no_wo', 'no_wo');
    }

    /** Komponen yang dikanibal/diswab pada WO ini (P4.3) */
    public function swabComponents(): HasMany
    {
        return $this->hasMany(SwabComponent::class, 'no_wo', 'no_wo');
    }

    /** Biaya perbaikan yang dibebankan ke WO ini */
    public function equipmentCosts(): HasMany
    {
        return $this->hasMany(EquipmentCost::class, 'wo_no', 'no_wo');
    }

    // ─── Model Hooks ─────────────────────────────────────────────────

    protected static function booted(): void
    {
        // Validasi field wajib saat menutup WO
        static::saving(function (WorkOrder $workOrder): void {
            $workOrder->status = strtoupper(trim((string) ($workOrder->status ?: 'OPEN')));

            if ($workOrder->status !== 'CLOSED') {
                return;
            }

            $requiredFields = [
                'action_log'  => 'Action / tindakan perbaikan',
                'tgl_selesai' => 'Tanggal RFU',
                'jam_selesai' => 'Jam RFU',
                'tech'        => 'Mekanik / PIC',
            ];

            $errors = [];
            foreach ($requiredFields as $field => $label) {
                if (blank($workOrder->{$field})) {
                    $errors[$field] = "{$label} wajib diisi sebelum WO ditutup.";
                }
            }

            if ($errors !== []) {
                throw ValidationException::withMessages($errors);
            }
        });

        // Sync status unit ke MasterEquip setelah WO disimpan
        static::saved(function (WorkOrder $workOrder): void {
            if (blank($workOrder->equip_no)) {
                return;
            }

            $unitStatus = match ($workOrder->status) {
                'CLOSED'    => 'RFU',
                'BREAKDOWN' => 'B/D',
                default     => 'RWN',
            };

            MasterEquip::where('equip_no', $workOrder->equip_no)
                ->update(['status' => $unitStatus]);

            // P3.1: Auto-deduct stok semua part saat WO CLOSED
            if ($workOrder->status === 'CLOSED') {
                WorkOrderPart::deductStockForWO($workOrder->no_wo);

                // P4.1: Auto-close Backlog terkait saat WO CLOSED
                Backlog::where('no_wo', $workOrder->no_wo)
                    ->orWhere(function ($q) use ($workOrder) {
                        if ($workOrder->backlog_id) {
                            $q->where('item_id', $workOrder->backlog_id);
                        }
                    })
                    ->where('status', '!=', 'CLOSED')
                    ->update([
                        'status'    => 'CLOSED',
                        'closed_at' => now(),
                    ]);

                // P4.2: Auto-close Failure Analysis jika ada
                FailureAnalysis::where('no_wo', $workOrder->no_wo)
                    ->where('status', 'OPEN')
                    ->update(['status' => 'CLOSED']);
            }

            // Log ke system log
            try {
                SystemLog::create([
                    'timestamp' => now()->format('Y-m-d H:i:s'),
                    'action'    => 'WorkOrder_Save',
                    'message'   => "WO {$workOrder->no_wo} ({$workOrder->equip_no}) disimpan dengan status {$workOrder->status}.",
                    'user'      => 'SYSTEM',
                ]);
            } catch (\Throwable) {}
        });
    }

    // ─── Helpers ─────────────────────────────────────────────────────

    /**
     * Sinkronkan tabel relasional parts ke kolom backward-compat parts_json (P3.1).
     */
    public function syncPartsJson(): void
    {
        $parts = $this->parts()->get()->map(function ($p) {
            return [
                'part_number' => $p->part_number,
                'no'          => $p->part_number,
                'part_name'   => $p->part_name,
                'desc'        => $p->part_name,
                'qty'         => (float) $p->qty_used,
                'qty_used'    => (float) $p->qty_used,
                'uom'         => $p->uom,
                'price'       => (float) $p->unit_price,
                'unit_price'  => (float) $p->unit_price,
            ];
        })->values()->toArray();

        $this->updateQuietly(['parts_json' => json_encode($parts)]);
    }
}
