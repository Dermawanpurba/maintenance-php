<?php

namespace App\Filament\Resources\PcrComponents\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class PcrComponentInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('item_id')
                    ->placeholder('-'),
                TextEntry::make('equip_no')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('component_name')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('target_lifetime_hm')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('current_hm')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('remaining_hm')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('status')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('estimated_cost')
                    ->money()
                    ->placeholder('-'),
                TextEntry::make('scheduled_date')
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
