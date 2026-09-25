<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Membuat skema tabel operasional Jadwal Servis Berkala (PS Schedule Service)
     * dan relasi bundling Backlog Defect terintegrasi.
     */
    public function up(): void
    {
        // 1. Tabel Utama: ps_schedules (Induk Jadwal Servis Berkala Harian/Shift)
        if (!Schema::hasTable('ps_schedules')) {
            Schema::create('ps_schedules', function (Blueprint $table) {
                $table->id();
                $table->string('schedule_date', 30)->index(); // Format YYYY-MM-DD atau DD-Mmm-YY (misal 2024-09-25)
                
                // Kluster 1: Setup / Planning
                $table->string('equip_no', 100)->index();      // e.g. GS503-0930, PC80-EX-LT, HD785-7WT
                $table->string('code_number', 100)->nullable(); // e.g. GS503-0930, TL001-0071, LT020-0063
                $table->string('model', 100)->nullable();       // e.g. GE500U, VT100 V2, PC80, HD785-7WT
                $table->double('current_hm')->default(0);       // HM Terkini saat dijadwalkan
                $table->double('plan_hm')->default(0);          // Target Plan HM untuk servis
                $table->string('ps_type', 50)->default('250');  // 250, 500, 1000, 2000, 4000, INTERVAL
                $table->string('plan_start_date', 30)->nullable(); // 25-Sep-24
                $table->string('plan_start_time', 20)->default('07:30'); // 07:30, 08:30, dst (staggered)
                $table->double('est_hours')->default(1.0);      // Estimasi downtime (0.8, 1.0, 4.0, 6.0, 10.0 jam)
                $table->string('sub_section', 100)->index()->default('SUPPORT MEDIUM'); 
                    // POWER PLANT, SUPPORT MEDIUM, SUPPORT BIG, PRODUCTION FLEET
                $table->string('pic', 100)->nullable();         // AGUS R, INDRA S, DERY W
                $table->string('location', 150)->nullable();    // CSA IPD, FRONT DENPASAR, ROM 3, PLD, PIT NORTH

                // Kluster 2: Periodic Service (Eksekusi SAP & Kesiapan Part Gudang)
                $table->string('wo_no', 100)->nullable()->index();     // WO Induk PS (misal 2201889842)
                $table->string('notif_no', 100)->nullable()->index();  // Notifikasi SAP (misal 120004182272)
                $table->string('resrv_no', 100)->nullable()->index();  // Reservasi Part Gudang (misal 5800331)
                $table->double('av_parts_percent')->default(100.0);    // Kesiapan part % (98% - 100%)

                // Kluster 3: Reference (Integrasi Program Kondisi & Keandalan)
                $table->string('pap_ref', 100)->nullable();  // Program Analisa Pelumas (Oil Sampling / SOS)
                $table->string('ppa_ref', 100)->nullable();  // Program Pemeriksaan Alat
                $table->string('dms_ref', 100)->nullable();  // Defect Management System
                $table->string('ppm_ref', 100)->nullable();  // Program Pemeriksaan Mesin
                $table->string('ppe_ref', 100)->nullable();  // Program Pemeriksaan Elektrikal / Engine
                $table->string('ppc_ref', 100)->nullable();  // Program Pemeriksaan Chassis / Undercarriage (PPU)
                $table->string('vis_ref', 100)->nullable();  // Visual Inspection (P2H Daily Checklist)

                // Status & Eksekusi Lapangan
                $table->string('status', 30)->default('SCHEDULED')->index(); // SCHEDULED, IN_PROGRESS, DONE, CANCELLED
                $table->string('actual_start_time', 20)->nullable();
                $table->string('actual_end_time', 20)->nullable();
                $table->double('actual_hm')->nullable();
                $table->text('notes')->nullable();
                $table->string('created_by', 100)->nullable()->default('Planner');
                $table->timestamps();
            });
        }

        // 2. Tabel Detail: ps_schedule_backlogs (Multi-Backlog Bundling per Jadwal Servis)
        if (!Schema::hasTable('ps_schedule_backlogs')) {
            Schema::create('ps_schedule_backlogs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('ps_schedule_id')->constrained('ps_schedules')->cascadeOnDelete();
                $table->string('backlog_id', 100)->nullable()->index(); // ID relasi logis ke tabel backlogs
                
                // Penomoran & Kesiapan Perbaikan Backlog
                $table->string('wo_no', 100)->nullable()->index();     // WO Backlog (misal 2201722880)
                $table->string('notif_no', 100)->nullable()->index();  // Notif Backlog (misal 120004183182)
                $table->string('resrv_no', 100)->nullable()->index();  // Reservasi Part Backlog (misal 5375114)
                $table->double('av_parts_percent')->default(100.0);    // Kesiapan suku cadang backlog
                $table->text('description')->nullable();               // Deskripsi kerusakan (misal: AC KURANG DINGIN)
                $table->string('status', 30)->default('PENDING');      // PENDING, COMPLETED, CANCELLED
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ps_schedule_backlogs');
        Schema::dropIfExists('ps_schedules');
    }
};
