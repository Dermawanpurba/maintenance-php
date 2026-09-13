<?php

namespace App\Filament\Resources\PcrComponents\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class PcrComponentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('item_id'),
                Textarea::make('equip_no')
                    ->columnSpanFull(),
                Textarea::make('component_name')
                    ->columnSpanFull(),
                TextInput::make('target_lifetime_hm')
                    ->numeric()
                    ->default(0),
                TextInput::make('current_hm')
                    ->numeric()
                    ->default(0),
                TextInput::make('remaining_hm')
                    ->numeric()
                    ->default(0),
                Textarea::make('status')
                    ->columnSpanFull(),
                TextInput::make('estimated_cost')
                    ->numeric()
                    ->default(0)
                    ->prefix('$'),
                Textarea::make('scheduled_date')
                    ->columnSpanFull(),
            ]);
    }
}
