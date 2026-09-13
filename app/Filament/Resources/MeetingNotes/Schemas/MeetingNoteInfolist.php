<?php

namespace App\Filament\Resources\MeetingNotes\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class MeetingNoteInfolist
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
                TextEntry::make('topic')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('leader')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('attendees')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('discussion_summary')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('action_items_json')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('status')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('plant_health')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('critical_issue')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('operational_impact')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('management_decision')
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
