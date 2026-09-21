<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * P4 — Integrasi Siklus Operasional & Reliability:
 * 1. backlogs: tambah no_wo, closed_at, priority
 * 2. failure_analyses: tambah no_wo
 * 3. swab_components: tambah no_wo, pcr_component_id
 * 4. work_orders: tambah backlog_id
 * 5. index penunjang untuk relasi
 */
return new class extends Migration
{
    public function up(): void
    {
        // 1. backlogs
        if (Schema::hasTable('backlogs')) {
            Schema::table('backlogs', function (Blueprint $table) {
                if (!Schema::hasColumn('backlogs', 'no_wo')) {
                    $table->string('no_wo', 100)->nullable()->index()->after('equip_no');
                }
                if (!Schema::hasColumn('backlogs', 'priority')) {
                    $table->string('priority', 20)->nullable()->default('MEDIUM')->after('status');
                }
                if (!Schema::hasColumn('backlogs', 'closed_at')) {
                    $table->timestamp('closed_at')->nullable()->after('priority');
                }
            });
        }

        // 2. failure_analyses
        if (Schema::hasTable('failure_analyses')) {
            Schema::table('failure_analyses', function (Blueprint $table) {
                if (!Schema::hasColumn('failure_analyses', 'no_wo')) {
                    $table->string('no_wo', 100)->nullable()->index()->after('equip_no');
                }
            });
        }

        // 3. swab_components
        if (Schema::hasTable('swab_components')) {
            Schema::table('swab_components', function (Blueprint $table) {
                if (!Schema::hasColumn('swab_components', 'no_wo')) {
                    $table->string('no_wo', 100)->nullable()->index()->after('target_unit');
                }
                if (!Schema::hasColumn('swab_components', 'pcr_component_id')) {
                    $table->unsignedBigInteger('pcr_component_id')->nullable()->index()->after('component_name');
                }
            });
        }

        // 4. work_orders
        if (Schema::hasTable('work_orders')) {
            Schema::table('work_orders', function (Blueprint $table) {
                if (!Schema::hasColumn('work_orders', 'backlog_id')) {
                    $table->string('backlog_id', 100)->nullable()->index()->after('sch_unsch');
                }
            });
        }

        // 5. equipment_costs (pastikan wo_no ter-index)
        if (Schema::hasTable('equipment_costs')) {
            try {
                Schema::table('equipment_costs', function (Blueprint $table) {
                    $table->index('wo_no');
                });
            } catch (\Throwable) {
                // Ignore jika index sudah ada
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('backlogs')) {
            Schema::table('backlogs', function (Blueprint $table) {
                if (Schema::hasColumn('backlogs', 'no_wo')) $table->dropColumn('no_wo');
                if (Schema::hasColumn('backlogs', 'priority')) $table->dropColumn('priority');
                if (Schema::hasColumn('backlogs', 'closed_at')) $table->dropColumn('closed_at');
            });
        }

        if (Schema::hasTable('failure_analyses')) {
            Schema::table('failure_analyses', function (Blueprint $table) {
                if (Schema::hasColumn('failure_analyses', 'no_wo')) $table->dropColumn('no_wo');
            });
        }

        if (Schema::hasTable('swab_components')) {
            Schema::table('swab_components', function (Blueprint $table) {
                if (Schema::hasColumn('swab_components', 'no_wo')) $table->dropColumn('no_wo');
                if (Schema::hasColumn('swab_components', 'pcr_component_id')) $table->dropColumn('pcr_component_id');
            });
        }

        if (Schema::hasTable('work_orders')) {
            Schema::table('work_orders', function (Blueprint $table) {
                if (Schema::hasColumn('work_orders', 'backlog_id')) $table->dropColumn('backlog_id');
            });
        }
    }
};
