<?php

namespace App\Filament\Resources\MeetingNotes\Pages;

use App\Filament\Resources\MeetingNotes\MeetingNoteResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewMeetingNote extends ViewRecord
{
    protected static string $resource = MeetingNoteResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
