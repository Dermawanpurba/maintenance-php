<?php

namespace App\Filament\Resources\PmRecords;

use App\Filament\Resources\PmRecords\Pages\CreatePmRecord;
use App\Filament\Resources\PmRecords\Pages\EditPmRecord;
use App\Filament\Resources\PmRecords\Pages\ListPmRecords;
use App\Filament\Resources\PmRecords\Pages\ViewPmRecord;
use App\Filament\Resources\PmRecords\Schemas\PmRecordForm;
use App\Filament\Resources\PmRecords\Schemas\PmRecordInfolist;
use App\Filament\Resources\PmRecords\Tables\PmRecordsTable;
use App\Models\PmRecord;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PmRecordResource extends Resource
{
    protected static ?string $model = PmRecord::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return PmRecordForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return PmRecordInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PmRecordsTable::configure($table);
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
            'index' => ListPmRecords::route('/'),
            'create' => CreatePmRecord::route('/create'),
            'view' => ViewPmRecord::route('/{record}'),
            'edit' => EditPmRecord::route('/{record}/edit'),
        ];
    }
}
