<?php

namespace App\Filament\Resources\PlanAlats\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class PlanAlatForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('equip_no')
                    ->columnSpanFull(),
                Textarea::make('model')
                    ->columnSpanFull(),
                TextInput::make('plan_hours_per_month')
                    ->numeric()
                    ->default(0),
                TextInput::make('plan_pa')
                    ->numeric()
                    ->default(0),
                TextInput::make('mohh')
                    ->numeric()
                    ->default(0),
                Textarea::make('category')
                    ->columnSpanFull(),
                Textarea::make('status')
                    ->columnSpanFull(),
            ]);
    }
}
