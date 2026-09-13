<?php

namespace App\Filament\Resources\MeetingNotes\Pages;

use App\Filament\Resources\MeetingNotes\MeetingNoteResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditMeetingNote extends EditRecord
{
    protected static string $resource = MeetingNoteResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
