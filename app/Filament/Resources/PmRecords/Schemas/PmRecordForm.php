<?php

namespace App\Filament\Resources\PmRecords\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class PmRecordForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('item_id'),
                Textarea::make('tanggal')
                    ->columnSpanFull(),
                Textarea::make('equip_no')
                    ->columnSpanFull(),
                Textarea::make('pm_type')
                    ->columnSpanFull(),
                Textarea::make('washing_check')
                    ->columnSpanFull(),
                Textarea::make('greasing_check')
                    ->columnSpanFull(),
                Textarea::make('inspection_check')
                    ->columnSpanFull(),
                Textarea::make('torque_check')
                    ->columnSpanFull(),
                Textarea::make('battery_check')
                    ->columnSpanFull(),
                Textarea::make('mechanic')
                    ->columnSpanFull(),
                Textarea::make('notes')
                    ->columnSpanFull(),
                TextInput::make('hm_pm')
                    ->numeric()
                    ->default(0),
                Textarea::make('status')
                    ->columnSpanFull(),
            ]);
    }
}
