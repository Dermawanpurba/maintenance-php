<?php

namespace App\Filament\Resources\PlanServices\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class PlanServiceForm
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
                Textarea::make('last_service_date')
                    ->columnSpanFull(),
                Textarea::make('last_service_hm')
                    ->columnSpanFull(),
                Textarea::make('next_service_hm')
                    ->columnSpanFull(),
                Textarea::make('kategori')
                    ->columnSpanFull(),
            ]);
    }
}
