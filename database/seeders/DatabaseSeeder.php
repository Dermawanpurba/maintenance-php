<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            MaintenanceDatabaseSeeder::class,
            SampleDataSeeder::class,
            OilSampleSeeder::class,
            PpuRecordSeeder::class,
            PsScheduleSeeder::class,
            // BasicMaintenanceHistoricalSeeder::class, // Dipisahkan agar tidak otomatis menginjeksi periode minggu dummy (WEEK 36-38)
        ]);
    }
}
