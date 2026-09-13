<?php

namespace App\Filament\Resources\MechanicActivities\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class MechanicActivityForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('item_id'),
                Textarea::make('tanggal')
                    ->columnSpanFull(),
                Textarea::make('no_wo')
                    ->columnSpanFull(),
                Textarea::make('mekanik')
                    ->columnSpanFull(),
                Textarea::make('aktifitas')
                    ->columnSpanFull(),
                Textarea::make('jam_mulai')
                    ->columnSpanFull(),
                Textarea::make('jam_selesai')
                    ->columnSpanFull(),
            ]);
    }
}
