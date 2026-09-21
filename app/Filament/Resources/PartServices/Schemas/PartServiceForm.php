<?php

namespace App\Filament\Resources\PartServices\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class PartServiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('equipment')
                    ->required(),
                TextInput::make('model')
                    ->required(),
                TextInput::make('unit_type'),
                Textarea::make('part_name')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('part_number')
                    ->required(),
                TextInput::make('ps_250')
                    ->numeric(),
                TextInput::make('ps_500')
                    ->numeric(),
                TextInput::make('ps_1000')
                    ->numeric(),
                TextInput::make('ps_2000')
                    ->numeric(),
                TextInput::make('ps_4000')
                    ->numeric(),
                TextInput::make('category'),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }
}
