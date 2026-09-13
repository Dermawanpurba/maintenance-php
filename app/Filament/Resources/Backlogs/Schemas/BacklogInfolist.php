<?php

namespace App\Filament\Resources\Backlogs\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class BacklogInfolist
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
                TextEntry::make('deskripsi_backlog')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('status')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('rencana_eksekusi')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('est_hours')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
