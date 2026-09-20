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
            BasicMaintenanceHistoricalSeeder::class,
        ]);
    }
}
