<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pm_records', function (Blueprint $table) {
            if (!Schema::hasColumn('pm_records', 'week_no')) {
                $table->string('week_no')->nullable()->default('WEEK 40');
            }
            if (!Schema::hasColumn('pm_records', 'achievement_pct')) {
                $table->double('achievement_pct')->nullable()->default(100);
            }
            if (!Schema::hasColumn('pm_records', 'checklist_json')) {
                $table->longText('checklist_json')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('pm_records', function (Blueprint $table) {
            $table->dropColumn(['week_no', 'achievement_pct', 'checklist_json']);
        });
    }
};
