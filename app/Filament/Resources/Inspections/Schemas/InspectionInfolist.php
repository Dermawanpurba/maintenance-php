<?php

namespace App\Filament\Resources\Inspections\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class InspectionInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('item_id')
                    ->placeholder('-'),
                TextEntry::make('tanggal')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('equip_no')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('tipe_alat')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('checklist_json')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('inspector')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('timestamp')
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
