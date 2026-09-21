<?php

namespace App\Filament\Resources\PartServices\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class PartServiceInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('equipment'),
                TextEntry::make('model'),
                TextEntry::make('unit_type')
                    ->placeholder('-'),
                TextEntry::make('part_name')
                    ->columnSpanFull(),
                TextEntry::make('part_number'),
                TextEntry::make('ps_250')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('ps_500')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('ps_1000')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('ps_2000')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('ps_4000')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('category')
                    ->placeholder('-'),
                TextEntry::make('notes')
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
