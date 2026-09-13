<?php

namespace App\Filament\Resources\MasterTools\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class MasterToolInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('tool_id')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('tool_name')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('category')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('brand_spec')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('quantity')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('condition')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('location')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('borrower')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('status')
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
