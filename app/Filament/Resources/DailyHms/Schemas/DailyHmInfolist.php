<?php

namespace App\Filament\Resources\DailyHms\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class DailyHmInfolist
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
                TextEntry::make('hm_awal')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('hm_akhir')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('total_hm')
                    ->numeric()
                    ->placeholder('-'),
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
