<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * MasterPart — single source of truth katalog & stok suku cadang.
 *
 * Setelah P2.1: tabel ini menggabungkan fungsi 'master_parts' + 'stocks'.
 * Model Stock dialihkan ke tabel ini untuk backward-compatibility.
 *
 * Kolom utama:
 * - part_number     : kode unik part
 * - part_name       : nama deskriptif (baru, P2.1)
 * - description     : deskripsi teknis
 * - uom             : satuan (PCS, LTR, SET, dll)
 * - stock           : stok aktual gudang
 * - min_stock       : batas minimum reorder point
 * - price           : harga satuan estimasi
 * - category_spare_part : kategori (Lubricant & Oil, Filter, General)
 * - bin_location    : lokasi fisik di gudang (baru, P2.1)
 * - last_in_date    : tanggal penerimaan terakhir (baru, P2.1)
 * - last_out_date   : tanggal pengeluaran terakhir (baru, P2.1)
 */
class MasterPart extends Model
{
    use HasFactory;

    protected $table = 'master_parts';
    protected $guarded = [];

    protected $casts = [
        'stock'     => 'float',
        'min_stock' => 'float',
        'price'     => 'float',
        'qty_final' => 'float',
    ];

    // ─── Accessor ───────────────────────────────────────────────────

    /**
     * Nama tampilan: prioritaskan part_name, fallback ke description.
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->part_name ?: ($this->description ?: $this->part_number);
    }

    /**
     * True jika stok di bawah minimum (perlu reorder).
     */
    public function getIsLowStockAttribute(): bool
    {
        return ($this->stock ?? 0) < ($this->min_stock ?? 0);
    }

    /**
     * Estimasi nilai total stok tersimpan.
     */
    public function getStockValueAttribute(): float
    {
        return round(($this->stock ?? 0) * ($this->price ?? 0), 2);
    }

    /**
     * Status stok dalam format label.
     */
    public function getStockStatusAttribute(): string
    {
        $stock    = (float) ($this->stock ?? 0);
        $minStock = (float) ($this->min_stock ?? 0);

        if ($stock <= 0)             return 'HABIS';
        if ($stock < $minStock)      return 'KRITIS';
        if ($stock < $minStock * 1.5) return 'RENDAH';
        return 'AMAN';
    }
}
