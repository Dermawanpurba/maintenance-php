<?php

namespace App\Filament\Resources\PartServices;

use App\Filament\Resources\PartServices\Pages\CreatePartService;
use App\Filament\Resources\PartServices\Pages\EditPartService;
use App\Filament\Resources\PartServices\Pages\ListPartServices;
use App\Filament\Resources\PartServices\Pages\ViewPartService;
use App\Filament\Resources\PartServices\Schemas\PartServiceForm;
use App\Filament\Resources\PartServices\Schemas\PartServiceInfolist;
use App\Filament\Resources\PartServices\Tables\PartServicesTable;
use App\Models\PartService;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PartServiceResource extends Resource
{
    protected static ?string $model = PartService::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTableCells;

    protected static string|\UnitEnum|null $navigationGroup = 'Master & Warehouse';

    protected static ?string $navigationLabel = 'Master Part Service (Matrix)';

    protected static ?string $modelLabel = 'Part Service Matrix';

    protected static ?string $pluralModelLabel = 'Master Part Services (Matrix)';

    protected static ?int $navigationSort = 3;

    protected static ?string $recordTitleAttribute = 'part_name';

    public static function form(Schema $schema): Schema
    {
        return PartServiceForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return PartServiceInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PartServicesTable::configure($table);
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
            'index' => ListPartServices::route('/'),
            'create' => CreatePartService::route('/create'),
            'view' => ViewPartService::route('/{record}'),
            'edit' => EditPartService::route('/{record}/edit'),
        ];
    }
}
