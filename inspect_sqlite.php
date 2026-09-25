<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

$tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'migrations' ORDER BY name");

echo "=== TABLES AND ROW COUNTS ===" . PHP_EOL;
foreach ($tables as $t) {
    $count = DB::table($t->name)->count();
    echo str_pad($t->name, 30) . ": " . $count . " rows" . PHP_EOL;
}



