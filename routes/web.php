<?php

use Illuminate\Support\Facades\Route;

// === WOSYS ERP - PURE REACT 18 SINGLE PAGE APPLICATION (SPA) ===
// All web routing is handled by React Frontend (Clean URL)

Route::get('/{any?}', function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath, [
            'Content-Type' => 'text/html; charset=UTF-8',
        ]);
    }
    return response('React Frontend build (index.html) tidak ditemukan di folder public.', 404);
})->where('any', '.*');
