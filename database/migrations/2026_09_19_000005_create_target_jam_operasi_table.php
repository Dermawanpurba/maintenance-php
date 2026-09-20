<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel header per unit per bulan
        Schema::create('target_jam_operasi', function (Blueprint $table) {
            $table->id();
            $table->text('equip_no')->nullable();
            $table->text('section')->nullable()->default('MINING');
            $table->text('model')->nullable();
            $table->double('est_hm')->nullable()->default(0);
            $table->text('status')->nullable()->default('RFU');
            // Next Service
            $table->double('next_service_hours_due')->nullable()->default(0);
            $table->double('next_service_type_hm')->nullable()->default(250);
            $table->text('next_service_type')->nullable()->default('PS-250');
            $table->text('next_service_date')->nullable();
            // PM Type flags (nilai: 1 = ada, 0 = tidak)
            $table->integer('pm_250')->nullable()->default(0);
            $table->integer('pm_500')->nullable()->default(0);
            $table->integer('pm_1000')->nullable()->default(0);
            $table->integer('pm_2000')->nullable()->default(0);
            $table->integer('pm_other')->nullable()->default(0);
            // BA/GG, OIL/FE, POS
            $table->integer('ba_gg')->nullable()->default(0);
            $table->integer('oil_fe')->nullable()->default(0);
            $table->integer('pos')->nullable()->default(0);
            // Period
            $table->integer('plan_year')->nullable()->default(2024);
            $table->integer('plan_month')->nullable()->default(1);
            $table->timestamps();
        });

        // Tabel jam rencana harian per unit
        Schema::create('target_jam_harian', function (Blueprint $table) {
            $table->id();
            $table->text('equip_no')->nullable();
            $table->integer('plan_year')->nullable()->default(2024);
            $table->integer('plan_month')->nullable()->default(1);
            $table->integer('plan_day')->nullable()->default(1);
            $table->double('jam_rencana')->nullable()->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('target_jam_harian');
        Schema::dropIfExists('target_jam_operasi');
    }
};
