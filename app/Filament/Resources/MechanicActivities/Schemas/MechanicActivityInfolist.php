<?php

namespace App\Filament\Resources\MechanicActivities\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class MechanicActivityInfolist
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
                TextEntry::make('no_wo')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('mekanik')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('aktifitas')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('jam_mulai')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('jam_selesai')
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
