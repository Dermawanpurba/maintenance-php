<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('target_jam_operasi', function (Blueprint $table) {
            $table->text('est_hm_date')->nullable()->default('01-Jun-24');
            $table->double('next_service_hours_due_2')->nullable()->default(0);
            $table->text('next_service_type_2')->nullable()->default('PS-250');
            $table->text('next_service_date_2')->nullable();
            $table->integer('pm_4000')->nullable()->default(0);
            $table->double('downtime_pm')->nullable()->default(0);
            $table->double('downtime_backlog')->nullable()->default(0);
            $table->double('downtime_midlife')->nullable()->default(0);
            $table->double('downtime_pcr')->nullable()->default(0);
        });

        Schema::table('target_jam_harian', function (Blueprint $table) {
            $table->text('downtime_type')->nullable()->default('PM');
        });
    }

    public function down(): void
    {
    }
};
