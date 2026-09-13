<?php

namespace App\Filament\Resources\MasterComponents\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class MasterComponentInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('major_component')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('minor_component')
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
