<?php

namespace App\Filament\Resources\PmRecords\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class PmRecordInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('item_id')
                    ->placeholder('-'),
                TextEntry::make('tanggal')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('equip_no')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('pm_type')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('washing_check')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('greasing_check')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('inspection_check')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('torque_check')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('battery_check')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('mechanic')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('notes')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('hm_pm')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('status')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('week_no')
                    ->placeholder('-'),
                TextEntry::make('achievement_pct')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('checklist_json')
                    ->placeholder('-')
                    ->columnSpanFull(),
            ]);
    }
}
