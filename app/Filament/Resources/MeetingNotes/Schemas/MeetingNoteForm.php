<?php

namespace App\Filament\Resources\MeetingNotes\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class MeetingNoteForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('item_id'),
                Textarea::make('tanggal')
                    ->columnSpanFull(),
                Textarea::make('topic')
                    ->columnSpanFull(),
                Textarea::make('leader')
                    ->columnSpanFull(),
                Textarea::make('attendees')
                    ->columnSpanFull(),
                Textarea::make('discussion_summary')
                    ->columnSpanFull(),
                Textarea::make('action_items_json')
                    ->columnSpanFull(),
                Textarea::make('status')
                    ->columnSpanFull(),
                Textarea::make('plant_health')
                    ->columnSpanFull(),
                Textarea::make('critical_issue')
                    ->columnSpanFull(),
                Textarea::make('operational_impact')
                    ->columnSpanFull(),
                Textarea::make('management_decision')
                    ->columnSpanFull(),
            ]);
    }
}
