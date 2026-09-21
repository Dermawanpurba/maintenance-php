<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Stock — alias backward-compatible ke tabel master_parts.
 *
 * Setelah P2.1 konsolidasi, tabel 'stocks' tidak lagi menjadi
 * single source of truth. Model ini dialihkan ke 'master_parts'
 * agar semua kode lama yang masih memanggil Stock::... tetap bekerja
 * tanpa perubahan apapun.
 *
 * @deprecated Gunakan MasterPart::class untuk kode baru.
 *             Model ini hanya untuk backward-compatibility.
 */
class Stock extends Model
{
    use HasFactory;

    /**
     * Arahkan ke tabel master_parts sebagai single source of truth.
     * Tabel 'stocks' lama dibiarkan ada tapi tidak lagi ditulis.
     */
    protected $table = 'master_parts';

    protected $guarded = [];

    protected $casts = [
        'stock'     => 'float',
        'min_stock' => 'float',
        'price'     => 'float',
        'qty_final' => 'float',
    ];
}
