<?php

namespace App\Filament\Resources\MeetingNotes\Pages;

use App\Filament\Resources\MeetingNotes\MeetingNoteResource;
use Filament\Resources\Pages\CreateRecord;

class CreateMeetingNote extends CreateRecord
{
    protected static string $resource = MeetingNoteResource::class;
}
