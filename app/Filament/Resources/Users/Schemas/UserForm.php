<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('username')
                    ->columnSpanFull(),
                Textarea::make('password')
                    ->columnSpanFull(),
                Textarea::make('nama')
                    ->columnSpanFull(),
                Textarea::make('role')
                    ->columnSpanFull(),
                Textarea::make('status')
                    ->columnSpanFull(),
            ]);
    }
}
