<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('part_services');

        Schema::create('part_services', function (Blueprint $table) {
            $table->id();
            $table->string('equipment')->index(); // DUMP TRUCK 10 RODA, EXCAVATOR, BULLDOZER, MOTOR GRADER
            $table->string('model')->index();     // FUSO FIGHTER FN62, CAT 320 GX, CAT D8 GC, CAT 140
            $table->string('unit_type')->nullable()->index(); // DT, EXCA, DOZER, GREDER
            $table->text('part_name');
            $table->string('part_number')->index();
            $table->double('ps_250')->nullable();
            $table->double('ps_500')->nullable();
            $table->double('ps_1000')->nullable();
            $table->double('ps_2000')->nullable();
            $table->double('ps_4000')->nullable();
            $table->string('category')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('part_services');
    }
};
