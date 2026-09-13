<?php

namespace App\Filament\Resources\MasterParts\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class MasterPartInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('part_number')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('description')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('uom')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('stock')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('min_stock')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('price')
                    ->money()
                    ->placeholder('-'),
                TextEntry::make('category_spare_part')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('qty_final')
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
