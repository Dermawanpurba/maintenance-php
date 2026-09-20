<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('oil_samples', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->nullable()->index();
            $table->string('sample_code')->nullable(); // e.g. LAB-9921
            $table->string('equip_no')->nullable()->index(); // e.g. EX1210
            $table->string('compartment')->nullable(); // e.g. Engine, Hydraulic System, Final Drive Right
            $table->string('sample_date')->nullable(); // e.g. 23-Mar-24 or 2024-03-23
            $table->double('hm')->nullable()->default(0); // Hour Meter e.g. 47006
            $table->string('oil_grade')->nullable(); // e.g. 15W-40, TELLUS 46, SAE 30
            $table->string('rating', 5)->nullable()->default('A'); // A, B, C, X
            $table->double('top_up')->nullable()->default(0); // Liters
            $table->text('repair_notes')->nullable();
            
            // Contamination Parameters (ppm)
            $table->double('si')->nullable()->default(0); // Silicon
            $table->double('al')->nullable()->default(0); // Aluminum
            $table->double('na')->nullable()->default(0); // Sodium
            
            // Wear Metal Parameters (ppm)
            $table->double('fe')->nullable()->default(0); // Iron
            $table->double('cu')->nullable()->default(0); // Copper
            $table->double('cr')->nullable()->default(0); // Chromium
            $table->double('pb')->nullable()->default(0); // Lead
            $table->double('pq')->nullable()->default(0); // Particle Quantifier Index
            
            // Physical Test Parameters
            $table->double('visc_100')->nullable()->default(0); // Viscosity @ 100°C (cSt)
            $table->double('oxi')->nullable()->default(0); // Oxidation
            $table->double('soot')->nullable()->default(0); // Soot percentage
            $table->double('tbn')->nullable()->default(0); // Total Base Number
            $table->double('iso_6')->nullable()->default(0); // Cleanliness ISO 4406 >6µm
            $table->double('iso_14')->nullable()->default(0); // Cleanliness ISO 4406 >14µm
            $table->double('water_pct')->nullable()->default(0); // Water content %
            
            // Diagnostic Interpretation & Metadata
            $table->longText('interpretation')->nullable();
            $table->string('lab_vendor')->nullable()->default('Caterpillar SOS Lab');
            $table->string('status')->nullable()->default('APPROVED'); // APPROVED, PENDING, REVIEW
            $table->string('created_by')->nullable()->default('Planner SOS');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('oil_samples');
    }
};
