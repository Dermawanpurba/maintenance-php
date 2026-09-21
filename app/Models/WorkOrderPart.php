<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * WorkOrderPart — detail suku cadang yang dipakai dalam sebuah Work Order.
 *
 * Menggantikan work_orders.parts_json (blob JSON) dengan tabel relasional
 * yang bisa di-query, dianalisis, dan menyebabkan deduction stok otomatis.
 *
 * Hook:
 * - saving  : hitung total_price dari qty_used × unit_price
 * - saved   : jika WO CLOSED dan stok belum dikurangi → auto-deduct master_parts.stock
 * - deleting: jika stok pernah dikurangi → kembalikan stok (rollback)
 */
class WorkOrderPart extends Model
{
    use HasFactory;

    protected $table = 'work_order_parts';
    protected $guarded = [];

    protected $casts = [
        'qty_used'       => 'float',
        'unit_price'     => 'float',
        'total_price'    => 'float',
        'stock_deducted' => 'boolean',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Work Order induk */
    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class, 'no_wo', 'no_wo');
    }

    /** Part di katalog master */
    public function masterPart(): BelongsTo
    {
        return $this->belongsTo(MasterPart::class, 'part_number', 'part_number');
    }

    // ─── Model Hooks ─────────────────────────────────────────────────

    protected static function booted(): void
    {
        // Hitung total_price otomatis sebelum simpan
        static::saving(function (WorkOrderPart $wop): void {
            $qty   = (float) ($wop->qty_used   ?? 0);
            $price = (float) ($wop->unit_price  ?? 0);

            // Jika unit_price belum diisi, snapshot dari master_parts
            if ($price <= 0 && filled($wop->part_number)) {
                $price = (float) (MasterPart::where('part_number', $wop->part_number)
                    ->value('price') ?? 0);
                $wop->unit_price = $price;

                // Isi part_name dari katalog jika belum ada
                if (blank($wop->part_name)) {
                    $wop->part_name = MasterPart::where('part_number', $wop->part_number)
                        ->value('part_name') ?: MasterPart::where('part_number', $wop->part_number)
                        ->value('description') ?: $wop->part_number;
                }
            }

            $wop->total_price = round($qty * $price, 2);
        });

        // Auto-deduct stok saat WO CLOSED & sync ke work_orders.parts_json
        static::saved(function (WorkOrderPart $wop): void {
            if (!$wop->stock_deducted) {
                // Cek apakah WO sudah CLOSED
                $woStatus = WorkOrder::where('no_wo', $wop->no_wo)->value('status');
                if (strtoupper($woStatus ?? '') === 'CLOSED') {
                    static::deductStock($wop);
                }
            }

            // Sync ke kolom backward-compat parts_json di work_orders
            try {
                $wop->workOrder?->syncPartsJson();
            } catch (\Throwable) {}
        });

        // Rollback stok jika WorkOrderPart dihapus dan stok sudah pernah dikurangi
        static::deleting(function (WorkOrderPart $wop): void {
            if (!$wop->stock_deducted || blank($wop->part_number) || ($wop->qty_used ?? 0) <= 0) {
                return;
            }

            MasterPart::where('part_number', $wop->part_number)
                ->update([
                    'stock'     => \DB::raw('stock + ' . (float) $wop->qty_used),
                    'qty_final' => \DB::raw('qty_final + ' . (float) $wop->qty_used),
                ]);

            try {
                SystemLog::create([
                    'timestamp' => now()->format('Y-m-d H:i:s'),
                    'action'    => 'WorkOrderPart_StockRollback',
                    'message'   => "Rollback stok part {$wop->part_number}: +" . $wop->qty_used
                                 . " (WO {$wop->no_wo} dihapus).",
                    'user'      => 'SYSTEM',
                ]);
            } catch (\Throwable) {}
        });

        // Sync ke parts_json setelah part terhapus
        static::deleted(function (WorkOrderPart $wop): void {
            try {
                $wop->workOrder?->syncPartsJson();
            } catch (\Throwable) {}
        });
    }

    // ─── Static Helpers ─────────────────────────────────────────────

    /**
     * Kurangi stok master_parts berdasarkan qty_used.
     * Tidak akan membuat stok negatif (floor di 0).
     */
    public static function deductStock(self $wop): void
    {
        if (blank($wop->part_number) || ($wop->qty_used ?? 0) <= 0) {
            return;
        }

        $qty = (float) $wop->qty_used;

        MasterPart::where('part_number', $wop->part_number)
            ->update([
                'stock'     => \DB::raw('MAX(0, stock - ' . $qty . ')'),
                'qty_final' => \DB::raw('MAX(0, qty_final - ' . $qty . ')'),
            ]);

        // Tandai sudah dikurangi
        $wop->updateQuietly(['stock_deducted' => true]);

        try {
            SystemLog::create([
                'timestamp' => now()->format('Y-m-d H:i:s'),
                'action'    => 'WorkOrderPart_StockDeduct',
                'message'   => "Deduct stok part {$wop->part_number}: -{$qty} "
                             . "(WO {$wop->no_wo}).",
                'user'      => 'SYSTEM',
            ]);
        } catch (\Throwable) {}
    }

    /**
     * Trigger deduct stok semua part dari sebuah WO yang baru saja CLOSED.
     * Dipanggil dari WorkOrder::saved() hook saat status → CLOSED.
     *
     * @param string $no_wo
     */
    public static function deductStockForWO(string $no_wo): void
    {
        static::where('no_wo', $no_wo)
            ->where('stock_deducted', false)
            ->each(function (self $wop): void {
                static::deductStock($wop);
            });
    }
}
