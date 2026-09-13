<?php

namespace App\Filament\Resources\MasterComponents\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class MasterComponentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('major_component')
                    ->columnSpanFull(),
                Textarea::make('minor_component')
                    ->columnSpanFull(),
            ]);
    }
}
