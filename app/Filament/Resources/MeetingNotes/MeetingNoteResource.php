<?php

namespace App\Filament\Resources\MeetingNotes;

use App\Filament\Resources\MeetingNotes\Pages\CreateMeetingNote;
use App\Filament\Resources\MeetingNotes\Pages\EditMeetingNote;
use App\Filament\Resources\MeetingNotes\Pages\ListMeetingNotes;
use App\Filament\Resources\MeetingNotes\Pages\ViewMeetingNote;
use App\Filament\Resources\MeetingNotes\Schemas\MeetingNoteForm;
use App\Filament\Resources\MeetingNotes\Schemas\MeetingNoteInfolist;
use App\Filament\Resources\MeetingNotes\Tables\MeetingNotesTable;
use App\Models\MeetingNote;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class MeetingNoteResource extends Resource
{
    protected static ?string $model = MeetingNote::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return MeetingNoteForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return MeetingNoteInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MeetingNotesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListMeetingNotes::route('/'),
            'create' => CreateMeetingNote::route('/create'),
            'view' => ViewMeetingNote::route('/{record}'),
            'edit' => EditMeetingNote::route('/{record}/edit'),
        ];
    }
}
