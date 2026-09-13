<?php

namespace App\Filament\Resources\ServiceHistories\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class ServiceHistoryInfolist
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
                TextEntry::make('plan_hm')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('plan_date')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('actual_hm')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('actual_date')
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
