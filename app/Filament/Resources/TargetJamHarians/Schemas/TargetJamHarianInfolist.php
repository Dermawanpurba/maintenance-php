<?php

namespace App\Filament\Resources\TargetJamHarians\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class TargetJamHarianInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('equip_no')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('plan_year')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('plan_month')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('plan_day')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('jam_rencana')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('downtime_type')
                    ->placeholder('-')
                    ->columnSpanFull(),
            ]);
    }
}
