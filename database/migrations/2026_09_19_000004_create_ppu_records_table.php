<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ppu_records', function (Blueprint $table) {
            $table->id();

            // Identitas Unit
            $table->string('unit_no')->nullable()->index();       // e.g. DZ153
            $table->string('model')->nullable();                   // e.g. D8R, D65P
            $table->string('track_group_used')->nullable();        // e.g. CAT (TU), ITM (HHI), KOMATSU

            // CTS & Track History
            $table->string('cts_date')->nullable();                // e.g. 13-May-24
            $table->string('last_fitted_track_group')->nullable(); // e.g. 12-Jan-24
            $table->double('pct_hours_track')->nullable()->default(0); // (%) Hours Track Group
            $table->double('hours_track_gp')->nullable()->default(0);  // Hours Track GP
            $table->double('smu')->nullable()->default(0);         // Service Meter Units (HM)

            // Sprocket — 3 Teeth (mm)
            $table->double('sprocket_lh')->nullable()->default(0);
            $table->double('sprocket_rh')->nullable()->default(0);

            // Track Link — Link Height (mm)
            $table->double('link_height_lh')->nullable()->default(0);
            $table->double('link_height_rh')->nullable()->default(0);

            // Track Link — Chain Bushing (mm)
            $table->double('chain_bushing_lh')->nullable()->default(0);
            $table->double('chain_bushing_rh')->nullable()->default(0);

            // Track Link — Frame Extension (mm)
            $table->double('frame_ext_lh')->nullable()->default(0);
            $table->double('frame_ext_rh')->nullable()->default(0);

            // Track Shoe — Grouser Height (mm)
            $table->double('grouser_height_lh')->nullable()->default(0);
            $table->double('grouser_height_rh')->nullable()->default(0);

            // Idler — Front (mm)
            $table->double('idler_front_lh')->nullable()->default(0);
            $table->double('idler_front_rh')->nullable()->default(0);

            // Idler — Rear (mm)
            $table->double('idler_rear_lh')->nullable()->default(0);
            $table->double('idler_rear_rh')->nullable()->default(0);

            // Metadata
            $table->string('inspection_date')->nullable();
            $table->string('inspector')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->nullable()->default('NORMAL'); // NORMAL, CAUTION, CRITICAL
            $table->string('created_by')->nullable()->default('Planner');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ppu_records');
    }
};
