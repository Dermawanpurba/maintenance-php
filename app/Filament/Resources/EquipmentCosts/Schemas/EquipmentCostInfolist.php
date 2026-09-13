<?php

namespace App\Filament\Resources\EquipmentCosts\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class EquipmentCostInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('item_id')
                    ->placeholder('-'),
                TextEntry::make('transaction_date')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('equip_no')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('category')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('amount')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('reference_no')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('wo_no')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('vendor')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('description')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('evidence_url')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('created_by')
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
