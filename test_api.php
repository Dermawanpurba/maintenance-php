<?php
$ch = curl_init('https://bss-maintenance-erp.my.id/api/maintenance/router');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['action' => 'syncDatabase']));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);
echo "Response for syncDatabase:\n" . $res . "\n\n";

$ch2 = curl_init('https://bss-maintenance-erp.my.id/api/maintenance/router');
curl_setopt($ch2, CURLOPT_POSTFIELDS, json_encode(['action' => 'getOptimizedData']));
curl_setopt($ch2, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
$res2 = curl_exec($ch2);
echo "Response for getOptimizedData:\n" . substr($res2, 0, 500) . "\n";
