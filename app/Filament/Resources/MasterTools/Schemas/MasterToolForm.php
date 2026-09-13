<?php

namespace App\Filament\Resources\MasterTools\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class MasterToolForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('tool_id')
                    ->columnSpanFull(),
                Textarea::make('tool_name')
                    ->columnSpanFull(),
                Textarea::make('category')
                    ->columnSpanFull(),
                Textarea::make('brand_spec')
                    ->columnSpanFull(),
                TextInput::make('quantity')
                    ->numeric()
                    ->default(0),
                Textarea::make('condition')
                    ->columnSpanFull(),
                Textarea::make('location')
                    ->columnSpanFull(),
                Textarea::make('borrower')
                    ->columnSpanFull(),
                Textarea::make('status')
                    ->columnSpanFull(),
            ]);
    }
}
