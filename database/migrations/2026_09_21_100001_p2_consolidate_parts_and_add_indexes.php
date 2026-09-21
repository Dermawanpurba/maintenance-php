<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * P2.1 — Konsolidasi master_parts sebagai single source of truth stok.
 * P2.2 — Index pada equip_no semua tabel operasional.
 */
return new class extends Migration
{
    public function up(): void
    {
        // ─────────────────────────────────────────────────────────────
        // P2.1a: Tambah kolom yang belum ada di master_parts
        // ─────────────────────────────────────────────────────────────
        Schema::table('master_parts', function (Blueprint $table) {
            // part_name (alias description yang lebih ekspresif)
            if (!Schema::hasColumn('master_parts', 'part_name')) {
                $table->text('part_name')->nullable()->after('part_number');
            }
            // bin_location untuk lokasi fisik di gudang
            if (!Schema::hasColumn('master_parts', 'bin_location')) {
                $table->string('bin_location', 50)->nullable()->default('WH-A')->after('category_spare_part');
            }
            // last_in_date: tanggal penerimaan terakhir
            if (!Schema::hasColumn('master_parts', 'last_in_date')) {
                $table->string('last_in_date', 20)->nullable()->after('bin_location');
            }
            // last_out_date: tanggal pengeluaran terakhir
            if (!Schema::hasColumn('master_parts', 'last_out_date')) {
                $table->string('last_out_date', 20)->nullable()->after('last_in_date');
            }
        });

        // ─────────────────────────────────────────────────────────────
        // P2.1b: Sinkronisasi data dari stocks → master_parts
        //   Untuk setiap record di stocks yang belum ada di master_parts
        //   (berdasarkan part_number), insert ke master_parts.
        //   Jika sudah ada, update stock jika stocks.stock lebih besar.
        // ─────────────────────────────────────────────────────────────
        $stockRecords = DB::table('stocks')->get();

        foreach ($stockRecords as $s) {
            $partNo = trim($s->part_number ?? '');
            if (empty($partNo)) {
                continue;
            }

            $existing = DB::table('master_parts')
                ->where('part_number', $partNo)
                ->first();

            if ($existing) {
                // Update stok ke nilai terbesar antara keduanya
                $bestStock = max((float) ($existing->stock ?? 0), (float) ($s->stock ?? 0));
                DB::table('master_parts')
                    ->where('part_number', $partNo)
                    ->update([
                        'stock'              => $bestStock,
                        'qty_final'          => $bestStock,
                        'bin_location'       => $existing->bin_location ?? 'WH-A',
                    ]);
            } else {
                // Insert record baru dari stocks
                DB::table('master_parts')->insert([
                    'part_number'        => $partNo,
                    'part_name'          => $s->description ?? '',
                    'description'        => $s->description ?? '',
                    'uom'                => $s->uom ?? 'PCS',
                    'stock'              => (float) ($s->stock ?? 0),
                    'min_stock'          => (float) ($s->min_stock ?? 0),
                    'price'              => (float) ($s->price ?? 0),
                    'category_spare_part'=> $s->category_spare_part ?? 'General',
                    'qty_final'          => (float) ($s->qty_final ?? $s->stock ?? 0),
                    'bin_location'       => 'WH-A',
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ]);
            }
        }

        // Isi part_name dari description untuk record yang sudah ada
        DB::statement("UPDATE master_parts SET part_name = description WHERE part_name IS NULL OR part_name = ''");

        // ─────────────────────────────────────────────────────────────
        // P2.2: Index pada equip_no di semua tabel operasional
        // SQLite tidak support addIndex jika sudah ada, gunakan try/catch
        // ─────────────────────────────────────────────────────────────
        $tablesToIndex = [
            'work_orders',
            'pm_records',
            'daily_hms',
            'service_histories',
            'inspections',
            'backlogs',
            'failure_analyses',
            'pcr_components',
            'equipment_costs',
            'oil_samples',
            'swab_components',    // donor_unit & target_unit
            'plan_alats',
            'plan_services',
            'target_jam_operasi',
            'target_jam_harian',
        ];

        foreach ($tablesToIndex as $tblName) {
            if (!Schema::hasTable($tblName)) {
                continue;
            }

            if (Schema::hasColumn($tblName, 'equip_no')) {
                try {
                    Schema::table($tblName, function (Blueprint $table) {
                        $table->index('equip_no', 'idx_' . $table->getTable() . '_equip_no');
                    });
                } catch (\Throwable) {
                    // Index sudah ada — skip
                }
            }
        }

        // Index tambahan untuk swab_components
        if (Schema::hasTable('swab_components')) {
            try {
                Schema::table('swab_components', function (Blueprint $table) {
                    $table->index('donor_unit',  'idx_swab_donor_unit');
                    $table->index('target_unit', 'idx_swab_target_unit');
                });
            } catch (\Throwable) {}
        }

        // Unique index pada master_parts.part_number
        try {
            Schema::table('master_parts', function (Blueprint $table) {
                $table->unique('part_number', 'uniq_master_parts_part_number');
            });
        } catch (\Throwable) {
            // Mungkin sudah ada duplikat — biarkan tanpa unique constraint
        }

        // Index pada part_services.part_number untuk join cepat
        if (Schema::hasTable('part_services')) {
            try {
                Schema::table('part_services', function (Blueprint $table) {
                    $table->index('part_number', 'idx_part_services_part_number');
                });
            } catch (\Throwable) {}
        }
    }

    public function down(): void
    {
        // Hapus kolom tambahan di master_parts
        Schema::table('master_parts', function (Blueprint $table) {
            $cols = ['part_name', 'bin_location', 'last_in_date', 'last_out_date'];
            foreach ($cols as $col) {
                if (Schema::hasColumn('master_parts', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
        // Note: index & data sync tidak di-rollback (destruktif)
    }
};
