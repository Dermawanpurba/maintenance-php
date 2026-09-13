<?php

namespace App\Filament\Resources\MasterMekaniks\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class MasterMekanikForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('nama_mekanik')
                    ->columnSpanFull(),
            ]);
    }
}
