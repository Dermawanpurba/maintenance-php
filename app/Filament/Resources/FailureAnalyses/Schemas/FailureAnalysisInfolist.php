<?php

namespace App\Filament\Resources\FailureAnalyses\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class FailureAnalysisInfolist
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
                TextEntry::make('component_name')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('chronology')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('five_why_json')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('fishbone_json')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('corrective_action')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('preventive_action')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('status')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('lead_investigator')
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
