<?php

namespace App\Filament\Resources\PlanAlats\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class PlanAlatInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('equip_no')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('model')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('plan_hours_per_month')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('plan_pa')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('mohh')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('category')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('status')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
