<?php

namespace App\Filament\Resources\EquipmentCosts;

use App\Filament\Resources\EquipmentCosts\Pages\CreateEquipmentCost;
use App\Filament\Resources\EquipmentCosts\Pages\EditEquipmentCost;
use App\Filament\Resources\EquipmentCosts\Pages\ListEquipmentCosts;
use App\Filament\Resources\EquipmentCosts\Pages\ViewEquipmentCost;
use App\Filament\Resources\EquipmentCosts\Schemas\EquipmentCostForm;
use App\Filament\Resources\EquipmentCosts\Schemas\EquipmentCostInfolist;
use App\Filament\Resources\EquipmentCosts\Tables\EquipmentCostsTable;
use App\Models\EquipmentCost;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class EquipmentCostResource extends Resource
{
    protected static ?string $model = EquipmentCost::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return EquipmentCostForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return EquipmentCostInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return EquipmentCostsTable::configure($table);
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
            'index' => ListEquipmentCosts::route('/'),
            'create' => CreateEquipmentCost::route('/create'),
            'view' => ViewEquipmentCost::route('/{record}'),
            'edit' => EditEquipmentCost::route('/{record}/edit'),
        ];
    }
}
