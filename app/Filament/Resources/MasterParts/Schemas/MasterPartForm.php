<?php

namespace App\Filament\Resources\MasterParts\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class MasterPartForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('part_number')
                    ->columnSpanFull(),
                Textarea::make('description')
                    ->columnSpanFull(),
                Textarea::make('uom')
                    ->columnSpanFull(),
                TextInput::make('stock')
                    ->numeric()
                    ->default(0),
                TextInput::make('min_stock')
                    ->numeric()
                    ->default(0),
                TextInput::make('price')
                    ->numeric()
                    ->default(0)
                    ->prefix('$'),
                Textarea::make('category_spare_part')
                    ->columnSpanFull(),
                TextInput::make('qty_final')
                    ->numeric()
                    ->default(0),
            ]);
    }
}
