<?php

namespace App\Filament\Resources\TargetJamOperasis\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class TargetJamOperasiForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('equip_no')
                    ->columnSpanFull(),
                Textarea::make('section')
                    ->default('MINING')
                    ->columnSpanFull(),
                Textarea::make('model')
                    ->columnSpanFull(),
                TextInput::make('est_hm')
                    ->numeric()
                    ->default(0),
                Textarea::make('status')
                    ->default('RFU')
                    ->columnSpanFull(),
                TextInput::make('next_service_hours_due')
                    ->numeric()
                    ->default(0),
                TextInput::make('next_service_type_hm')
                    ->numeric()
                    ->default(250),
                Textarea::make('next_service_type')
                    ->default('PS-250')
                    ->columnSpanFull(),
                Textarea::make('next_service_date')
                    ->columnSpanFull(),
                TextInput::make('pm_250')
                    ->numeric()
                    ->default(0),
                TextInput::make('pm_500')
                    ->numeric()
                    ->default(0),
                TextInput::make('pm_1000')
                    ->numeric()
                    ->default(0),
                TextInput::make('pm_2000')
                    ->numeric()
                    ->default(0),
                TextInput::make('pm_other')
                    ->numeric()
                    ->default(0),
                TextInput::make('ba_gg')
                    ->numeric()
                    ->default(0),
                TextInput::make('oil_fe')
                    ->numeric()
                    ->default(0),
                TextInput::make('pos')
                    ->numeric()
                    ->default(0),
                TextInput::make('plan_year')
                    ->numeric()
                    ->default(2024),
                TextInput::make('plan_month')
                    ->numeric()
                    ->default(1),
                Textarea::make('est_hm_date')
                    ->default('01-Jun-24')
                    ->columnSpanFull(),
                TextInput::make('next_service_hours_due_2')
                    ->numeric()
                    ->default(0),
                Textarea::make('next_service_type_2')
                    ->default('PS-250')
                    ->columnSpanFull(),
                Textarea::make('next_service_date_2')
                    ->columnSpanFull(),
                TextInput::make('pm_4000')
                    ->numeric()
                    ->default(0),
                TextInput::make('downtime_pm')
                    ->numeric()
                    ->default(0),
                TextInput::make('downtime_backlog')
                    ->numeric()
                    ->default(0),
                TextInput::make('downtime_midlife')
                    ->numeric()
                    ->default(0),
                TextInput::make('downtime_pcr')
                    ->numeric()
                    ->default(0),
            ]);
    }
}
