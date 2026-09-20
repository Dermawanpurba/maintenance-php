<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('pcr_components') && !Schema::hasColumn('pcr_components', 'install_hm')) {
            Schema::table('pcr_components', function (Blueprint $table) {
                $table->double('install_hm')->nullable()->default(0)->after('component_name');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('pcr_components') && Schema::hasColumn('pcr_components', 'install_hm')) {
            Schema::table('pcr_components', function (Blueprint $table) {
                $table->dropColumn('install_hm');
            });
        }
    }
};
