<?php

namespace App\Filament\Resources\MasterPelapors\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class MasterPelaporForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('nama_pelapor')
                    ->columnSpanFull(),
            ]);
    }
}
