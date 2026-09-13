<?php

namespace App\Filament\Resources\SwabComponents\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class SwabComponentInfolist
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
                TextEntry::make('donor_unit')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('target_unit')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('component_name')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('reason')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('authorized_by')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('mechanic')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('status')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('restoration_date')
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
