<?php

use Illuminate\Support\Facades\Route;

// === MAINTENANCE MANAGEMENT SYSTEM (WOSYS ERP - PROFESSIONAL) ===
// Port: 8003 | SQLite 3 Standalone
// Frontend Blade SPA: resources/views/maintenance.blade.php
// REST API Backend: /api/maintenance/*

Route::get('/', fn () => view('maintenance'));
Route::get('/classic', fn () => view('maintenance'));
Route::get('/maintenance', fn () => view('maintenance'));
Route::get('/dashboard', fn () => view('maintenance'));
