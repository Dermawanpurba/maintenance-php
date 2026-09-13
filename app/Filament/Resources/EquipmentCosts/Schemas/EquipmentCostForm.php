<?php

namespace App\Filament\Resources\EquipmentCosts\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class EquipmentCostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('item_id'),
                Textarea::make('transaction_date')
                    ->columnSpanFull(),
                Textarea::make('equip_no')
                    ->columnSpanFull(),
                Textarea::make('category')
                    ->columnSpanFull(),
                TextInput::make('amount')
                    ->numeric()
                    ->default(0),
                Textarea::make('reference_no')
                    ->columnSpanFull(),
                Textarea::make('wo_no')
                    ->columnSpanFull(),
                Textarea::make('vendor')
                    ->columnSpanFull(),
                Textarea::make('description')
                    ->columnSpanFull(),
                Textarea::make('evidence_url')
                    ->columnSpanFull(),
                Textarea::make('created_by')
                    ->columnSpanFull(),
                Textarea::make('timestamp')
                    ->columnSpanFull(),
            ]);
    }
}
