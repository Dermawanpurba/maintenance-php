<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('master_tools')) {
            if (!Schema::hasColumn('master_tools', 'borrow_date')) {
                Schema::table('master_tools', function (Blueprint $table) {
                    $table->string('borrow_date', 50)->nullable()->after('borrower');
                });
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('master_tools')) {
            if (Schema::hasColumn('master_tools', 'borrow_date')) {
                Schema::table('master_tools', function (Blueprint $table) {
                    $table->dropColumn('borrow_date');
                });
            }
        }
    }
};
