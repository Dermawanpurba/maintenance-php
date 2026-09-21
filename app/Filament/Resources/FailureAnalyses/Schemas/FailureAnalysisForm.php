<?php

namespace App\Filament\Resources\FailureAnalyses\Schemas;

use App\Models\MasterEquip;
use App\Models\WorkOrder;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class FailureAnalysisForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('item_id')
                    ->label('Nomor FAR (Laporan RCA)')
                    ->default(fn () => 'FAR-' . date('Ymd-His'))
                    ->required()
                    ->unique(ignoreRecord: true),

                Select::make('equip_no')
                    ->label('Nomor Unit')
                    ->options(fn () => MasterEquip::pluck('equip_no', 'equip_no'))
                    ->searchable()
                    ->preload()
                    ->required()
                    ->reactive(),

                Select::make('no_wo')
                    ->label('Work Order Kejadian (P4.2)')
                    ->options(fn ($get) => WorkOrder::when($get('equip_no'), fn ($q, $eq) => $q->where('equip_no', $eq))->pluck('no_wo', 'no_wo'))
                    ->searchable()
                    ->placeholder('Pilih WO terkait insiden breakdown')
                    ->nullable(),

                DatePicker::make('tanggal')
                    ->label('Tanggal Kejadian Breakdown')
                    ->default(now()->toDateString())
                    ->required(),

                TextInput::make('component_name')
                    ->label('Komponen yang Gagal / Rusak')
                    ->placeholder('Contoh: Torque Converter, Main Pump, Final Drive')
                    ->required(),

                Select::make('status')
                    ->label('Status Analisa')
                    ->options([
                        'OPEN'          => '🔴 OPEN (Sedang Dianalisa)',
                        'INVESTIGATING' => '🟡 INVESTIGATING (Lab / Teardown)',
                        'CLOSED'        => '🟢 CLOSED (Selesai & Tindakan Terpasang)',
                    ])
                    ->default('OPEN')
                    ->required(),

                TextInput::make('lead_investigator')
                    ->label('Lead Investigator / Engineer PIC')
                    ->default('Tim Reliability PMC')
                    ->required(),

                Textarea::make('chronology')
                    ->label('Kronologi & Indikasi Awal Kegagalan (Root Cause)')
                    ->rows(3)
                    ->columnSpanFull()
                    ->required(),

                Textarea::make('corrective_action')
                    ->label('Tindakan Korektif (Immediate Action)')
                    ->rows(2)
                    ->columnSpanFull(),

                Textarea::make('preventive_action')
                    ->label('Tindakan Pencegahan (Preventive Action / SOP Update)')
                    ->rows(2)
                    ->columnSpanFull(),
            ]);
    }
}
