<?php

namespace App\Filament\Resources\DailyHms\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class DailyHmForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('item_id'),
                Textarea::make('tanggal')
                    ->columnSpanFull(),
                Textarea::make('equip_no')
                    ->columnSpanFull(),
                TextInput::make('hm_awal')
                    ->numeric()
                    ->default(0),
                TextInput::make('hm_akhir')
                    ->numeric()
                    ->default(0),
                TextInput::make('total_hm')
                    ->numeric()
                    ->default(0),
                Textarea::make('timestamp')
                    ->columnSpanFull(),
            ]);
    }
}
