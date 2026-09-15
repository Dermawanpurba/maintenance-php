<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('app_users')) {
            if (!Schema::hasColumn('app_users', 'email')) {
                Schema::table('app_users', function (Blueprint $table) {
                    $table->text('email')->nullable();
                });
            }

            // Isi nilai email otomatis untuk seluruh user lama
            try {
                DB::statement("UPDATE app_users SET email = username || '@wosys.local' WHERE email IS NULL OR email = ''");
            } catch (\Throwable $e) {
                // Ignore if driver differs
            }
        }
    }

    public function down(): void
    {
        //
    }
};
