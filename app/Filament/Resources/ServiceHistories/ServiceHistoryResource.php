<?php

namespace App\Filament\Resources\ServiceHistories;

use App\Filament\Resources\ServiceHistories\Pages\CreateServiceHistory;
use App\Filament\Resources\ServiceHistories\Pages\EditServiceHistory;
use App\Filament\Resources\ServiceHistories\Pages\ListServiceHistories;
use App\Filament\Resources\ServiceHistories\Pages\ViewServiceHistory;
use App\Filament\Resources\ServiceHistories\Schemas\ServiceHistoryForm;
use App\Filament\Resources\ServiceHistories\Schemas\ServiceHistoryInfolist;
use App\Filament\Resources\ServiceHistories\Tables\ServiceHistoriesTable;
use App\Models\ServiceHistory;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ServiceHistoryResource extends Resource
{
    protected static ?string $model = ServiceHistory::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return ServiceHistoryForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ServiceHistoryInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ServiceHistoriesTable::configure($table);
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
            'index' => ListServiceHistories::route('/'),
            'create' => CreateServiceHistory::route('/create'),
            'view' => ViewServiceHistory::route('/{record}'),
            'edit' => EditServiceHistory::route('/{record}/edit'),
        ];
    }
}
