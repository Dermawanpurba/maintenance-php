<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use ZipArchive;

class BackupController extends Controller
{
    /**
     * Generate and download a 1-Click complete system backup archive (.ZIP)
     */
    public function downloadZip()
    {
        $appName = preg_replace('/[^A-Za-z0-9_]/', '', config('app.name', 'WOSYS_ERP'));
        $zipFileName = 'BACKUP_' . $appName . '_' . date('Ymd_His') . '.zip';
        $zipDir = storage_path('app/backups');

        if (!file_exists($zipDir)) {
            mkdir($zipDir, 0755, true);
        }

        $zipPath = $zipDir . '/' . $zipFileName;

        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            return response()->json(['success' => false, 'message' => 'Gagal membuat file ZIP backup di server'], 500);
        }

        // 1. Masukkan file fisik database SQLite
        $sqlitePath = database_path('database.sqlite');
        if (file_exists($sqlitePath)) {
            $zip->addFile($sqlitePath, 'database/database.sqlite');
        }

        // 2. Masukkan SQL dump phpMyAdmin jika ada
        $sqlDumpPath = database_path('maintenance_database_phpmyadmin.sql');
        if (file_exists($sqlDumpPath)) {
            $zip->addFile($sqlDumpPath, 'database/maintenance_database_phpmyadmin.sql');
        }

        // 3. Masukkan seluruh file unggahan pengguna di storage/app/public
        $storagePublic = storage_path('app/public');
        if (file_exists($storagePublic)) {
            $files = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($storagePublic, \RecursiveDirectoryIterator::SKIP_DOTS),
                \RecursiveIteratorIterator::LEAVES_ONLY
            );

            foreach ($files as $file) {
                if (!$file->isDir()) {
                    $filePath = $file->getRealPath();
                    $relativePath = 'storage_files/' . str_replace('\\', '/', substr($filePath, strlen($storagePublic) + 1));
                    $zip->addFile($filePath, $relativePath);
                }
            }
        }

        // 4. Masukkan Ekspor JSON Data Lengkap (Bisa Diimpor & Diaudit Secara Terstruktur)
        $controller = new MaintenanceController();
        $optimizedData = $controller->getOptimizedData();
        $jsonExport = [
            'backup_timestamp' => now()->toIso8601String(),
            'app_name' => config('app.name', 'WOSys ERP'),
            'app_version' => '1.0.0',
            'summary' => [
                'total_equipments' => count($optimizedData['equip'] ?? []),
                'total_work_orders' => count($optimizedData['wo'] ?? []),
                'total_backlogs' => count($optimizedData['backlog'] ?? []),
                'total_daily_hm' => count($optimizedData['dailyHM'] ?? []),
                'total_users' => count($optimizedData['usersData'] ?? []),
            ],
            'data' => $optimizedData
        ];
        $zip->addFromString('database/database_export.json', json_encode($jsonExport, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        // 5. Masukkan Petunjuk Pemulihan (README_BACKUP.txt)
        $readme = "===============================================================\n"
            . "   WOSYS ERP - PANDUAN PEMULIHAN SISTEM (SYSTEM RESTORE GUIDE)\n"
            . "===============================================================\n\n"
            . "Tanggal Pencadangan : " . date('d F Y, H:i:s') . "\n"
            . "Aplikasi            : " . config('app.name', 'WOSys ERP - Maintenance System') . "\n\n"
            . "Struktur Berkas Arsip (.ZIP):\n"
            . "  1. database/database.sqlite\n"
            . "     -> File database utama SQLite 3 (Single Source of Truth).\n"
            . "     -> Salin ke folder 'database/' pada server/container target.\n\n"
            . "  2. database/maintenance_database_phpmyadmin.sql\n"
            . "     -> Skrip SQL lengkap untuk diimpor ke MySQL/phpMyAdmin jika diperlukan.\n\n"
            . "  3. database/database_export.json\n"
            . "     -> Ekspor data terstruktur JSON untuk audit atau interoperabilitas.\n\n"
            . "  4. storage_files/\n"
            . "     -> Berkas fisik unggahan pengguna (PDF, foto, scan dokumen).\n"
            . "     -> Salin seluruh isi ke folder 'storage/app/public/'.\n\n"
            . "Perintah Restore Cepat di VPS Coolify / Linux:\n"
            . "  cp database/database.sqlite /var/www/html/database/database.sqlite\n"
            . "  cp -r storage_files/* /var/www/html/storage/app/public/\n"
            . "  chown -R www-data:www-data /var/www/html/storage /var/www/html/database\n"
            . "  chmod -R 775 /var/www/html/storage /var/www/html/database\n"
            . "  php artisan optimize:clear\n";
        $zip->addFromString('README_BACKUP.txt', $readme);

        $zip->close();

        return response()->download($zipPath, $zipFileName)->deleteFileAfterSend(true);
    }
}
