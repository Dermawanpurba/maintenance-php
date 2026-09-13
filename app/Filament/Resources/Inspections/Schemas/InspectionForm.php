<?php

namespace App\Filament\Resources\Inspections\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class InspectionForm
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
                Textarea::make('tipe_alat')
                    ->columnSpanFull(),
                Textarea::make('checklist_json')
                    ->columnSpanFull(),
                Textarea::make('inspector')
                    ->columnSpanFull(),
                Textarea::make('timestamp')
                    ->columnSpanFull(),
            ]);
    }
}
