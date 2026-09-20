<?php

namespace App\Filament\Resources\PpuRecords;

use App\Filament\Resources\PpuRecords\Pages\CreatePpuRecord;
use App\Filament\Resources\PpuRecords\Pages\EditPpuRecord;
use App\Filament\Resources\PpuRecords\Pages\ListPpuRecords;
use App\Filament\Resources\PpuRecords\Pages\ViewPpuRecord;
use App\Filament\Resources\PpuRecords\Schemas\PpuRecordForm;
use App\Filament\Resources\PpuRecords\Schemas\PpuRecordInfolist;
use App\Filament\Resources\PpuRecords\Tables\PpuRecordsTable;
use App\Models\PpuRecord;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PpuRecordResource extends Resource
{
    protected static ?string $model = PpuRecord::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return PpuRecordForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return PpuRecordInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PpuRecordsTable::configure($table);
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
            'index' => ListPpuRecords::route('/'),
            'create' => CreatePpuRecord::route('/create'),
            'view' => ViewPpuRecord::route('/{record}'),
            'edit' => EditPpuRecord::route('/{record}/edit'),
        ];
    }
}
