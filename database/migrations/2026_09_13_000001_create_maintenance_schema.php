<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('app_users', function (Blueprint $table) {
            $table->id();
            $table->text('username')->nullable();
            $table->text('password')->nullable();
            $table->text('nama')->nullable();
            $table->text('role')->nullable();
            $table->text('status')->nullable();
            $table->timestamps();
        });

        Schema::create('user_access', function (Blueprint $table) {
            $table->id();
            $table->text('username')->nullable();
            $table->text('feature')->nullable();
            $table->text('timestamp')->nullable();
            $table->timestamps();
        });

        Schema::create('plan_alats', function (Blueprint $table) {
            $table->id();
            $table->text('equip_no')->nullable();
            $table->text('model')->nullable();
            $table->double('plan_hours_per_month')->nullable()->default(0);
            $table->double('plan_pa')->nullable()->default(0);
            $table->double('mohh')->nullable()->default(0);
            $table->text('category')->nullable();
            $table->text('status')->nullable();
            $table->timestamps();
        });

        Schema::create('plan_services', function (Blueprint $table) {
            $table->id();
            $table->text('equip_no')->nullable();
            $table->text('model')->nullable();
            $table->double('plan_hours_per_month')->nullable()->default(0);
            $table->double('plan_pa')->nullable()->default(0);
            $table->text('last_service_date')->nullable();
            $table->text('last_service_hm')->nullable();
            $table->text('next_service_hm')->nullable();
            $table->text('kategori')->nullable();
            $table->timestamps();
        });

        Schema::create('master_equips', function (Blueprint $table) {
            $table->id();
            $table->text('equip_no')->nullable();
            $table->text('brand')->nullable();
            $table->text('unit_type')->nullable();
            $table->text('warranty_status')->nullable();
            $table->text('model')->nullable();
            $table->text('serial_no')->nullable();
            $table->text('model_engine')->nullable();
            $table->text('serial_engine')->nullable();
            $table->text('capacity_unit')->nullable();
            $table->text('capacity_attachment')->nullable();
            $table->text('dimension_unit')->nullable();
            $table->text('dimension_attachment')->nullable();
            $table->double('rate_power_kw')->nullable()->default(0);
            $table->double('year')->nullable()->default(0);
            $table->text('status')->nullable();
            $table->text('location')->nullable();
            $table->timestamps();
        });

        Schema::create('master_parts', function (Blueprint $table) {
            $table->id();
            $table->text('part_number')->nullable();
            $table->longText('description')->nullable();
            $table->text('uom')->nullable();
            $table->double('stock')->nullable()->default(0);
            $table->double('min_stock')->nullable()->default(0);
            $table->double('price')->nullable()->default(0);
            $table->text('category_spare_part')->nullable();
            $table->double('qty_final')->nullable()->default(0);
            $table->timestamps();
        });

        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->text('part_number')->nullable();
            $table->longText('description')->nullable();
            $table->text('uom')->nullable();
            $table->double('stock')->nullable()->default(0);
            $table->double('min_stock')->nullable()->default(0);
            $table->double('price')->nullable()->default(0);
            $table->text('category_spare_part')->nullable();
            $table->double('qty_final')->nullable()->default(0);
            $table->timestamps();
        });

        Schema::create('master_components', function (Blueprint $table) {
            $table->id();
            $table->text('major_component')->nullable();
            $table->text('minor_component')->nullable();
            $table->timestamps();
        });

        Schema::create('master_mekaniks', function (Blueprint $table) {
            $table->id();
            $table->text('nama_mekanik')->nullable();
            $table->timestamps();
        });

        Schema::create('master_pelapors', function (Blueprint $table) {
            $table->id();
            $table->text('nama_pelapor')->nullable();
            $table->timestamps();
        });

        Schema::create('work_orders', function (Blueprint $table) {
            $table->id();
            $table->text('no_wo')->nullable();
            $table->text('equip_no')->nullable();
            $table->text('brand')->nullable();
            $table->text('unit_type')->nullable();
            $table->text('hm_km')->nullable();
            $table->text('tgl_input')->nullable();
            $table->text('tgl_rusak')->nullable();
            $table->text('jam_rusak')->nullable();
            $table->text('tgl_selesai')->nullable();
            $table->text('jam_selesai')->nullable();
            $table->text('pelanggan')->nullable();
            $table->text('pm_service')->nullable();
            $table->text('major_comp')->nullable();
            $table->text('minor_comp')->nullable();
            $table->text('sch_unsch')->nullable();
            $table->text('reported_by')->nullable();
            $table->longText('kendala')->nullable();
            $table->longText('failure_reason')->nullable();
            $table->text('status')->nullable();
            $table->longText('parts_json')->nullable();
            $table->text('tech')->nullable();
            $table->longText('action_log')->nullable();
            $table->timestamps();
        });

        Schema::create('backlogs', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->nullable()->index();
            $table->text('tanggal')->nullable();
            $table->text('equip_no')->nullable();
            $table->text('deskripsi_backlog')->nullable();
            $table->text('status')->nullable();
            $table->text('rencana_eksekusi')->nullable();
            $table->double('est_hours')->nullable()->default(0);
            $table->timestamps();
        });

        Schema::create('daily_hms', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->nullable()->index();
            $table->text('tanggal')->nullable();
            $table->text('equip_no')->nullable();
            $table->double('hm_awal')->nullable()->default(0);
            $table->double('hm_akhir')->nullable()->default(0);
            $table->double('total_hm')->nullable()->default(0);
            $table->text('timestamp')->nullable();
            $table->timestamps();
        });

        Schema::create('mechanic_activities', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->nullable()->index();
            $table->text('tanggal')->nullable();
            $table->text('no_wo')->nullable();
            $table->text('mekanik')->nullable();
            $table->text('aktifitas')->nullable();
            $table->text('jam_mulai')->nullable();
            $table->text('jam_selesai')->nullable();
            $table->timestamps();
        });

        Schema::create('service_histories', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->nullable()->index();
            $table->text('equip_no')->nullable();
            $table->text('plan_hm')->nullable();
            $table->text('plan_date')->nullable();
            $table->text('actual_hm')->nullable();
            $table->text('actual_date')->nullable();
            $table->text('timestamp')->nullable();
            $table->timestamps();
        });

        Schema::create('inspections', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->nullable()->index();
            $table->text('tanggal')->nullable();
            $table->text('equip_no')->nullable();
            $table->text('tipe_alat')->nullable();
            $table->longText('checklist_json')->nullable();
            $table->text('inspector')->nullable();
            $table->text('timestamp')->nullable();
            $table->timestamps();
        });

        Schema::create('pcr_components', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->nullable()->index();
            $table->text('equip_no')->nullable();
            $table->text('component_name')->nullable();
            $table->double('target_lifetime_hm')->nullable()->default(0);
            $table->double('current_hm')->nullable()->default(0);
            $table->double('remaining_hm')->nullable()->default(0);
            $table->text('status')->nullable();
            $table->double('estimated_cost')->nullable()->default(0);
            $table->text('scheduled_date')->nullable();
            $table->timestamps();
        });

        Schema::create('pm_records', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->nullable()->index();
            $table->text('tanggal')->nullable();
            $table->text('equip_no')->nullable();
            $table->text('pm_type')->nullable();
            $table->text('washing_check')->nullable();
            $table->text('greasing_check')->nullable();
            $table->text('inspection_check')->nullable();
            $table->text('torque_check')->nullable();
            $table->text('battery_check')->nullable();
            $table->text('mechanic')->nullable();
            $table->longText('notes')->nullable();
            $table->double('hm_pm')->nullable()->default(0);
            $table->text('status')->nullable();
            $table->timestamps();
        });

        Schema::create('monthly_budgets', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->nullable()->index();
            $table->double('month_year')->nullable()->default(0);
            $table->text('category')->nullable();
            $table->double('budget_plan')->nullable()->default(0);
            $table->double('actual_spent')->nullable()->default(0);
            $table->double('variance')->nullable()->default(0);
            $table->text('status')->nullable();
            $table->longText('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('equipment_costs', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->nullable()->index();
            $table->text('transaction_date')->nullable();
            $table->text('equip_no')->nullable();
            $table->text('category')->nullable();
            $table->double('amount')->nullable()->default(0);
            $table->text('reference_no')->nullable();
            $table->text('wo_no')->nullable();
            $table->text('vendor')->nullable();
            $table->longText('description')->nullable();
            $table->text('evidence_url')->nullable();
            $table->text('created_by')->nullable();
            $table->text('timestamp')->nullable();
            $table->timestamps();
        });

        Schema::create('failure_analyses', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->nullable()->index();
            $table->text('tanggal')->nullable();
            $table->text('equip_no')->nullable();
            $table->text('component_name')->nullable();
            $table->longText('chronology')->nullable();
            $table->longText('five_why_json')->nullable();
            $table->longText('fishbone_json')->nullable();
            $table->longText('corrective_action')->nullable();
            $table->longText('preventive_action')->nullable();
            $table->text('status')->nullable();
            $table->text('lead_investigator')->nullable();
            $table->timestamps();
        });

        Schema::create('swab_components', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->nullable()->index();
            $table->text('tanggal')->nullable();
            $table->text('donor_unit')->nullable();
            $table->text('target_unit')->nullable();
            $table->text('component_name')->nullable();
            $table->text('reason')->nullable();
            $table->text('authorized_by')->nullable();
            $table->text('mechanic')->nullable();
            $table->text('status')->nullable();
            $table->text('restoration_date')->nullable();
            $table->timestamps();
        });

        Schema::create('meeting_notes', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->nullable()->index();
            $table->text('tanggal')->nullable();
            $table->text('topic')->nullable();
            $table->text('leader')->nullable();
            $table->text('attendees')->nullable();
            $table->longText('discussion_summary')->nullable();
            $table->longText('action_items_json')->nullable();
            $table->text('status')->nullable();
            $table->text('plant_health')->nullable();
            $table->text('critical_issue')->nullable();
            $table->text('operational_impact')->nullable();
            $table->text('management_decision')->nullable();
            $table->timestamps();
        });

        Schema::create('master_tools', function (Blueprint $table) {
            $table->id();
            $table->text('tool_id')->nullable();
            $table->text('tool_name')->nullable();
            $table->text('category')->nullable();
            $table->text('brand_spec')->nullable();
            $table->double('quantity')->nullable()->default(0);
            $table->text('condition')->nullable();
            $table->text('location')->nullable();
            $table->text('borrower')->nullable();
            $table->text('status')->nullable();
            $table->timestamps();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->text('key')->nullable();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        Schema::create('system_logs', function (Blueprint $table) {
            $table->id();
            $table->text('timestamp')->nullable();
            $table->text('action')->nullable();
            $table->longText('message')->nullable();
            $table->text('user')->nullable();
            $table->timestamps();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('system_logs');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('master_tools');
        Schema::dropIfExists('meeting_notes');
        Schema::dropIfExists('swab_components');
        Schema::dropIfExists('failure_analyses');
        Schema::dropIfExists('equipment_costs');
        Schema::dropIfExists('monthly_budgets');
        Schema::dropIfExists('pm_records');
        Schema::dropIfExists('pcr_components');
        Schema::dropIfExists('inspections');
        Schema::dropIfExists('service_histories');
        Schema::dropIfExists('mechanic_activities');
        Schema::dropIfExists('daily_hms');
        Schema::dropIfExists('backlogs');
        Schema::dropIfExists('work_orders');
        Schema::dropIfExists('master_pelapors');
        Schema::dropIfExists('master_mekaniks');
        Schema::dropIfExists('master_components');
        Schema::dropIfExists('stocks');
        Schema::dropIfExists('master_parts');
        Schema::dropIfExists('master_equips');
        Schema::dropIfExists('plan_services');
        Schema::dropIfExists('plan_alats');
        Schema::dropIfExists('user_access');
        Schema::dropIfExists('app_users');
    }
};
