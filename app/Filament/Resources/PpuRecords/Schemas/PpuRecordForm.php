<?php

namespace App\Filament\Resources\PpuRecords\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class PpuRecordForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('unit_no'),
                TextInput::make('model'),
                TextInput::make('track_group_used'),
                TextInput::make('cts_date'),
                TextInput::make('last_fitted_track_group'),
                TextInput::make('pct_hours_track')
                    ->numeric()
                    ->default(0),
                TextInput::make('hours_track_gp')
                    ->numeric()
                    ->default(0),
                TextInput::make('smu')
                    ->numeric()
                    ->default(0),
                TextInput::make('sprocket_lh')
                    ->numeric()
                    ->default(0),
                TextInput::make('sprocket_rh')
                    ->numeric()
                    ->default(0),
                TextInput::make('link_height_lh')
                    ->numeric()
                    ->default(0),
                TextInput::make('link_height_rh')
                    ->numeric()
                    ->default(0),
                TextInput::make('chain_bushing_lh')
                    ->numeric()
                    ->default(0),
                TextInput::make('chain_bushing_rh')
                    ->numeric()
                    ->default(0),
                TextInput::make('frame_ext_lh')
                    ->numeric()
                    ->default(0),
                TextInput::make('frame_ext_rh')
                    ->numeric()
                    ->default(0),
                TextInput::make('grouser_height_lh')
                    ->numeric()
                    ->default(0),
                TextInput::make('grouser_height_rh')
                    ->numeric()
                    ->default(0),
                TextInput::make('idler_front_lh')
                    ->numeric()
                    ->default(0),
                TextInput::make('idler_front_rh')
                    ->numeric()
                    ->default(0),
                TextInput::make('idler_rear_lh')
                    ->numeric()
                    ->default(0),
                TextInput::make('idler_rear_rh')
                    ->numeric()
                    ->default(0),
                TextInput::make('inspection_date'),
                TextInput::make('inspector'),
                Textarea::make('notes')
                    ->columnSpanFull(),
                TextInput::make('status')
                    ->default('NORMAL'),
                TextInput::make('created_by')
                    ->default('Planner'),
            ]);
    }
}
