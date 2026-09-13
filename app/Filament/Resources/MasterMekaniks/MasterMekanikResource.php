<?php

namespace App\Filament\Resources\MasterMekaniks;

use App\Filament\Resources\MasterMekaniks\Pages\CreateMasterMekanik;
use App\Filament\Resources\MasterMekaniks\Pages\EditMasterMekanik;
use App\Filament\Resources\MasterMekaniks\Pages\ListMasterMekaniks;
use App\Filament\Resources\MasterMekaniks\Pages\ViewMasterMekanik;
use App\Filament\Resources\MasterMekaniks\Schemas\MasterMekanikForm;
use App\Filament\Resources\MasterMekaniks\Schemas\MasterMekanikInfolist;
use App\Filament\Resources\MasterMekaniks\Tables\MasterMekaniksTable;
use App\Models\MasterMekanik;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class MasterMekanikResource extends Resource
{
    protected static ?string $model = MasterMekanik::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return MasterMekanikForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return MasterMekanikInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MasterMekaniksTable::configure($table);
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
            'index' => ListMasterMekaniks::route('/'),
            'create' => CreateMasterMekanik::route('/create'),
            'view' => ViewMasterMekanik::route('/{record}'),
            'edit' => EditMasterMekanik::route('/{record}/edit'),
        ];
    }
}
