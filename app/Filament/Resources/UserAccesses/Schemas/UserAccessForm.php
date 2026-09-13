<?php

namespace App\Filament\Resources\UserAccesses\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class UserAccessForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('username')
                    ->columnSpanFull(),
                Textarea::make('feature')
                    ->columnSpanFull(),
                Textarea::make('timestamp')
                    ->columnSpanFull(),
            ]);
    }
}
