<?php

namespace App\Filament\Resources\Backlogs\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class BacklogForm
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
                Textarea::make('deskripsi_backlog')
                    ->columnSpanFull(),
                Textarea::make('status')
                    ->columnSpanFull(),
                Textarea::make('rencana_eksekusi')
                    ->columnSpanFull(),
                TextInput::make('est_hours')
                    ->numeric()
                    ->default(0),
            ]);
    }
}
