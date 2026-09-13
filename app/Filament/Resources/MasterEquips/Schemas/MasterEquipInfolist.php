<?php

namespace App\Filament\Resources\MasterEquips\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class MasterEquipInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('equip_no')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('brand')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('unit_type')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('warranty_status')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('model')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('serial_no')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('model_engine')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('serial_engine')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('capacity_unit')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('capacity_attachment')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('dimension_unit')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('dimension_attachment')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('rate_power_kw')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('year')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('status')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('location')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
