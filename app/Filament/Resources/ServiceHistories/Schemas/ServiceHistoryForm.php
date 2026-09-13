<?php

namespace App\Filament\Resources\ServiceHistories\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ServiceHistoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('item_id'),
                Textarea::make('equip_no')
                    ->columnSpanFull(),
                Textarea::make('plan_hm')
                    ->columnSpanFull(),
                Textarea::make('plan_date')
                    ->columnSpanFull(),
                Textarea::make('actual_hm')
                    ->columnSpanFull(),
                Textarea::make('actual_date')
                    ->columnSpanFull(),
                Textarea::make('timestamp')
                    ->columnSpanFull(),
            ]);
    }
}
