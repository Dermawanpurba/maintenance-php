<?php

namespace App\Filament\Resources\MaintenanceWeeks\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class MaintenanceWeekForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Periode Minggu')
                    ->columns(2)
                    ->schema([
                        Select::make('week_no')
                            ->label('Nomor Minggu')
                            ->required()
                            ->options(collect(range(1, 52))->mapWithKeys(fn ($w) => [
                                'WEEK ' . $w => 'WEEK ' . $w,
                            ])->toArray()),

                        TextInput::make('label')
                            ->label('Label / Keterangan')
                            ->placeholder('e.g. Minggu Pertama Oktober'),

                        DatePicker::make('start_date')
                            ->label('Tanggal Mulai'),

                        DatePicker::make('end_date')
                            ->label('Tanggal Selesai'),

                        Toggle::make('is_active')
                            ->label('Aktif (Minggu Berjalan)')
                            ->default(false)
                            ->columnSpanFull(),

                        TextInput::make('target_compliance')
                            ->label('Target Compliance (%)')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->maxValue(100)
                            ->default(100)
                            ->suffix('%'),

                        Textarea::make('notes')
                            ->label('Catatan')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
