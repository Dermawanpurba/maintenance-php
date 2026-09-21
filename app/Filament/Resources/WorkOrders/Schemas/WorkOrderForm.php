<?php

namespace App\Filament\Resources\WorkOrders\Schemas;

use App\Models\MasterEquip;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class WorkOrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('no_wo')
                    ->label('Nomor Work Order')
                    ->placeholder('Otomatis dibuat jika kosong')
                    ->default(fn () => 'WO-' . date('Ymd-His')),

                Select::make('equip_no')
                    ->label('Nomor Unit')
                    ->options(fn () => MasterEquip::pluck('equip_no', 'equip_no'))
                    ->searchable()
                    ->preload()
                    ->required()
                    ->reactive()
                    ->afterStateUpdated(function ($state, callable $set) {
                        if ($state) {
                            $eq = MasterEquip::where('equip_no', $state)->first();
                            if ($eq) {
                                $set('brand', $eq->brand);
                                $set('unit_type', $eq->model ?: $eq->unit_type);
                                $set('hm_km', $eq->last_hm);
                            }
                        }
                    }),

                TextInput::make('brand')
                    ->label('Brand / Pabrikan'),

                TextInput::make('unit_type')
                    ->label('Tipe / Model Alat'),

                TextInput::make('hm_km')
                    ->label('HM / KM Breakdown')
                    ->numeric()
                    ->default(0),

                Select::make('sch_unsch')
                    ->label('Klasifikasi Breakdown')
                    ->options([
                        'BREAKDOWN UNSCHEDULED' => '🔴 Unscheduled Breakdown (BUS)',
                        'BREAKDOWN SCHEDULED'   => '🔵 Scheduled Breakdown (BS)',
                    ])
                    ->default('BREAKDOWN UNSCHEDULED')
                    ->required(),

                Select::make('status')
                    ->label('Status WO')
                    ->options([
                        'OPEN'         => '🔴 OPEN',
                        'IN PROGRESS'  => '🟡 IN PROGRESS',
                        'WAITING PART' => '⚪ WAITING PART',
                        'CLOSED'       => '🟢 CLOSED',
                        'CANCEL'       => '⚫ CANCEL',
                    ])
                    ->default('OPEN')
                    ->required(),

                TextInput::make('reported_by')
                    ->label('Pelapor')
                    ->default('Operator Pit'),

                DatePicker::make('tgl_rusak')
                    ->label('Tanggal Breakdown')
                    ->default(now()->toDateString()),

                TextInput::make('jam_rusak')
                    ->label('Jam Breakdown')
                    ->placeholder('HH:MM')
                    ->default(now()->format('H:i')),

                DatePicker::make('tgl_selesai')
                    ->label('Tanggal RFU / Selesai'),

                TextInput::make('jam_selesai')
                    ->label('Jam RFU / Selesai')
                    ->placeholder('HH:MM'),

                TextInput::make('tech')
                    ->label('Mekanik / Teknisi PIC'),

                Select::make('major_comp')
                    ->label('Major Component')
                    ->options([
                        'ENGINE'        => 'ENGINE',
                        'TRANSMISSION'  => 'TRANSMISSION',
                        'HYDRAULIC'     => 'HYDRAULIC',
                        'ELECTRICAL'    => 'ELECTRICAL',
                        'UNDERCARRIAGE' => 'UNDERCARRIAGE',
                        'ATTACHMENT'    => 'ATTACHMENT',
                        'BRAKE & WHEEL' => 'BRAKE & WHEEL',
                        'CHASSIS'       => 'CHASSIS',
                        'CABIN'         => 'CABIN',
                        'GENERAL'       => 'GENERAL',
                    ])
                    ->searchable(),

                TextInput::make('minor_comp')
                    ->label('Minor Component / Sub Assembly'),

                TextInput::make('pelanggan')
                    ->label('Pelanggan / Site / Section'),

                Textarea::make('kendala')
                    ->label('Keluhan / Deskripsi Kerusakan')
                    ->rows(3)
                    ->columnSpanFull()
                    ->required(),

                Textarea::make('failure_reason')
                    ->label('Penyebab Kerusakan (Root Cause / Analisa)')
                    ->rows(2)
                    ->columnSpanFull(),

                Textarea::make('action_log')
                    ->label('Tindakan / Kronologis Perbaikan')
                    ->rows(3)
                    ->columnSpanFull(),

                // Suku Cadang Terpakai (P3.1 Relasional)
                Repeater::make('parts')
                    ->relationship('parts')
                    ->label('Daftar Suku Cadang yang Digunakan (P3.1)')
                    ->schema([
                        TextInput::make('part_number')
                            ->label('Part Number')
                            ->placeholder('Contoh: 714-16-00010')
                            ->columnSpan(2),

                        TextInput::make('part_name')
                            ->label('Nama Suku Cadang')
                            ->columnSpan(4),

                        TextInput::make('qty_used')
                            ->label('Qty')
                            ->numeric()
                            ->default(1)
                            ->columnSpan(2),

                        Select::make('uom')
                            ->label('UOM')
                            ->options([
                                'PCS'   => 'PCS',
                                'LTR'   => 'LTR',
                                'SET'   => 'SET',
                                'BOTOL' => 'BOTOL',
                                'KG'    => 'KG',
                                'MTR'   => 'MTR',
                            ])
                            ->default('PCS')
                            ->columnSpan(2),

                        TextInput::make('unit_price')
                            ->label('Harga Satuan')
                            ->numeric()
                            ->prefix('Rp')
                            ->default(0)
                            ->columnSpan(2),
                    ])
                    ->columns(12)
                    ->columnSpanFull()
                    ->collapsible()
                    ->defaultItems(0),
            ]);
    }
}
