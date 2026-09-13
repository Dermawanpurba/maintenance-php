<?php

namespace App\Filament\Resources\SwabComponents\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class SwabComponentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('item_id'),
                Textarea::make('tanggal')
                    ->columnSpanFull(),
                Textarea::make('donor_unit')
                    ->columnSpanFull(),
                Textarea::make('target_unit')
                    ->columnSpanFull(),
                Textarea::make('component_name')
                    ->columnSpanFull(),
                Textarea::make('reason')
                    ->columnSpanFull(),
                Textarea::make('authorized_by')
                    ->columnSpanFull(),
                Textarea::make('mechanic')
                    ->columnSpanFull(),
                Textarea::make('status')
                    ->columnSpanFull(),
                Textarea::make('restoration_date')
                    ->columnSpanFull(),
            ]);
    }
}
