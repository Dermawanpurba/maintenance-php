<?php

namespace App\Filament\Resources\MasterEquips\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class MasterEquipForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('equip_no')
                    ->columnSpanFull(),
                Textarea::make('brand')
                    ->columnSpanFull(),
                Textarea::make('unit_type')
                    ->columnSpanFull(),
                Textarea::make('warranty_status')
                    ->columnSpanFull(),
                Textarea::make('model')
                    ->columnSpanFull(),
                Textarea::make('serial_no')
                    ->columnSpanFull(),
                Textarea::make('model_engine')
                    ->columnSpanFull(),
                Textarea::make('serial_engine')
                    ->columnSpanFull(),
                Textarea::make('capacity_unit')
                    ->columnSpanFull(),
                Textarea::make('capacity_attachment')
                    ->columnSpanFull(),
                Textarea::make('dimension_unit')
                    ->columnSpanFull(),
                Textarea::make('dimension_attachment')
                    ->columnSpanFull(),
                TextInput::make('rate_power_kw')
                    ->numeric()
                    ->default(0),
                TextInput::make('year')
                    ->numeric()
                    ->default(0),
                Textarea::make('status')
                    ->columnSpanFull(),
                Textarea::make('location')
                    ->columnSpanFull(),
            ]);
    }
}
