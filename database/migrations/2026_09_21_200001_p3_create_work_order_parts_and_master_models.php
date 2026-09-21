<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * P3.1 — Tabel work_order_parts: junction antara work_orders dan master_parts.
 *         Menggantikan penyimpanan parts_json sebagai blob.
 *
 * P3.2 — Tabel master_models: normalisasi model unit agar BOM matching akurat.
 *         Menggantikan fuzzy string match di PlanningPartService.
 */
return new class extends Migration
{
    public function up(): void
    {
        // ─────────────────────────────────────────────────────────────────
        // P3.2: Tabel master_models — direktori model alat berat
        // ─────────────────────────────────────────────────────────────────
        if (!Schema::hasTable('master_models')) {
            Schema::create('master_models', function (Blueprint $table) {
                $table->id();
                $table->string('model_code', 100)->unique()->index();
                    // Kode unik model: 'CAT320GX', 'D8R', 'FUSO_FN62', '140GC'
                $table->string('model_name', 150);
                    // Nama lengkap: 'CAT 320 GX', 'Komatsu D8R', 'FUSO Fighter FN62'
                $table->string('equipment_type', 50)->nullable();
                    // EXCAVATOR, BULLDOZER, DUMP_TRUCK, MOTOR_GRADER, SUPPORT
                $table->string('unit_type_alias', 50)->nullable();
                    // EXCA, DOZER, DT, GREDER (alias singkat dari frontend)
                $table->string('manufacturer', 100)->nullable();
                    // Caterpillar, Komatsu, FUSO, Volvo, dll
                $table->text('aliases')->nullable();
                    // JSON array alias: ["CAT 320GX","CAT320 GX","Excavator 320"]
                    // Dipakai untuk fuzzy fallback matching
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // Tambah kolom model_code FK ke master_equips & part_services
        // Gunakan nullable() agar tidak break existing data
        if (Schema::hasTable('master_equips') && !Schema::hasColumn('master_equips', 'model_code')) {
            Schema::table('master_equips', function (Blueprint $table) {
                $table->string('model_code', 100)->nullable()->index()->after('model');
            });
        }
        if (Schema::hasTable('part_services') && !Schema::hasColumn('part_services', 'model_code')) {
            Schema::table('part_services', function (Blueprint $table) {
                $table->string('model_code', 100)->nullable()->index()->after('model');
            });
        }

        // ─────────────────────────────────────────────────────────────────
        // P3.1: Tabel work_order_parts — detail part per WO (relasional)
        // ─────────────────────────────────────────────────────────────────
        if (!Schema::hasTable('work_order_parts')) {
            Schema::create('work_order_parts', function (Blueprint $table) {
                $table->id();
                $table->string('no_wo', 100)->index();
                    // FK logis ke work_orders.no_wo
                $table->string('part_number', 100)->nullable()->index();
                    // FK logis ke master_parts.part_number
                $table->text('part_name')->nullable();
                    // Nama saat dipakai (bisa berbeda dari katalog)
                $table->decimal('qty_used', 10, 3)->default(0);
                    // Jumlah yang dipakai/digunakan
                $table->string('uom', 20)->nullable()->default('PCS');
                    // Satuan
                $table->decimal('unit_price', 15, 2)->nullable()->default(0);
                    // Harga saat dipakai (snapshot dari master_parts.price)
                $table->decimal('total_price', 15, 2)->nullable()->default(0);
                    // qty_used * unit_price (dihitung otomatis)
                $table->boolean('stock_deducted')->default(false);
                    // Flag: apakah stok sudah dikurangi di master_parts
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('work_order_parts');
        Schema::dropIfExists('master_models');

        // Remove added columns
        if (Schema::hasColumn('master_equips', 'model_code')) {
            Schema::table('master_equips', fn (Blueprint $t) => $t->dropColumn('model_code'));
        }
        if (Schema::hasColumn('part_services', 'model_code')) {
            Schema::table('part_services', fn (Blueprint $t) => $t->dropColumn('model_code'));
        }
    }
};
