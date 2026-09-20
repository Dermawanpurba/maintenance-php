<?php

namespace App\Filament\Resources\TargetJamHarians\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class TargetJamHarianForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('equip_no')
                    ->columnSpanFull(),
                TextInput::make('plan_year')
                    ->numeric()
                    ->default(2024),
                TextInput::make('plan_month')
                    ->numeric()
                    ->default(1),
                TextInput::make('plan_day')
                    ->numeric()
                    ->default(1),
                TextInput::make('jam_rencana')
                    ->numeric()
                    ->default(0),
                Textarea::make('downtime_type')
                    ->default('PM')
                    ->columnSpanFull(),
            ]);
    }
}
