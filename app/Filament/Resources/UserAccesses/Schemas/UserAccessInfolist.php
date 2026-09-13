<?php

namespace App\Filament\Resources\UserAccesses\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class UserAccessInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('username')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('feature')
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
