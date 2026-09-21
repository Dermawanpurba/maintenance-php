<?php

namespace App\Filament\Resources\Backlogs\Schemas;

use App\Models\MasterEquip;
use App\Models\WorkOrder;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class BacklogForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('item_id')
                    ->label('ID Backlog')
                    ->default(fn () => 'BL-' . date('Ymd-His'))
                    ->required()
                    ->unique(ignoreRecord: true),

                Select::make('equip_no')
                    ->label('Nomor Unit')
                    ->options(fn () => MasterEquip::pluck('equip_no', 'equip_no'))
                    ->searchable()
                    ->preload()
                    ->required(),

                DatePicker::make('tanggal')
                    ->label('Tanggal Temuan')
                    ->default(now()->toDateString())
                    ->required(),

                Select::make('priority')
                    ->label('Prioritas')
                    ->options([
                        'HIGH'   => '🔴 HIGH (Mendesak / Kritis)',
                        'MEDIUM' => '🟡 MEDIUM (Normal)',
                        'LOW'    => '🔵 LOW (Bisa Ditunda)',
                    ])
                    ->default('MEDIUM')
                    ->required(),

                Select::make('status')
                    ->label('Status')
                    ->options([
                        'OPEN'        => '🔴 OPEN',
                        'IN PROGRESS' => '🟡 IN PROGRESS (Ada WO)',
                        'CLOSED'      => '🟢 CLOSED (Selesai)',
                    ])
                    ->default('OPEN')
                    ->required(),

                Select::make('no_wo')
                    ->label('Work Order Penanganan (P4.1)')
                    ->options(fn ($record) => WorkOrder::when($record?->equip_no, fn ($q, $eq) => $q->where('equip_no', $eq))->pluck('no_wo', 'no_wo'))
                    ->searchable()
                    ->placeholder('Pilih WO jika sudah diterbitkan')
                    ->nullable(),

                TextInput::make('est_hours')
                    ->label('Estimasi Jam Kerja (Hours)')
                    ->numeric()
                    ->default(4)
                    ->suffix('Jam'),

                Textarea::make('deskripsi_backlog')
                    ->label('Deskripsi Temuan / Defect Kerusakan')
                    ->rows(3)
                    ->columnSpanFull()
                    ->required(),

                Textarea::make('rencana_eksekusi')
                    ->label('Rencana Tindakan / Part yang Dibutuhkan')
                    ->rows(3)
                    ->columnSpanFull(),
            ]);
    }
}
