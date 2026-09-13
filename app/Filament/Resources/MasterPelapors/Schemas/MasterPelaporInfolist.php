<?php

namespace App\Filament\Resources\MasterPelapors\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class MasterPelaporInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('nama_pelapor')
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
