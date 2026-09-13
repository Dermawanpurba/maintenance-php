<?php

namespace App\Filament\Resources\PlanServices\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class PlanServiceInfolist
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
                TextEntry::make('last_service_date')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('last_service_hm')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('next_service_hm')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('kategori')
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
