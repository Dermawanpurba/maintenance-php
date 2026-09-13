<?php

namespace App\Filament\Resources\MasterEquips;

use App\Filament\Resources\MasterEquips\Pages\CreateMasterEquip;
use App\Filament\Resources\MasterEquips\Pages\EditMasterEquip;
use App\Filament\Resources\MasterEquips\Pages\ListMasterEquips;
use App\Filament\Resources\MasterEquips\Pages\ViewMasterEquip;
use App\Filament\Resources\MasterEquips\Schemas\MasterEquipForm;
use App\Filament\Resources\MasterEquips\Schemas\MasterEquipInfolist;
use App\Filament\Resources\MasterEquips\Tables\MasterEquipsTable;
use App\Models\MasterEquip;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class MasterEquipResource extends Resource
{
    protected static ?string $model = MasterEquip::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return MasterEquipForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return MasterEquipInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MasterEquipsTable::configure($table);
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
            'index' => ListMasterEquips::route('/'),
            'create' => CreateMasterEquip::route('/create'),
            'view' => ViewMasterEquip::route('/{record}'),
            'edit' => EditMasterEquip::route('/{record}/edit'),
        ];
    }
}
