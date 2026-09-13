<?php

namespace App\Filament\Resources\MasterPelapors;

use App\Filament\Resources\MasterPelapors\Pages\CreateMasterPelapor;
use App\Filament\Resources\MasterPelapors\Pages\EditMasterPelapor;
use App\Filament\Resources\MasterPelapors\Pages\ListMasterPelapors;
use App\Filament\Resources\MasterPelapors\Pages\ViewMasterPelapor;
use App\Filament\Resources\MasterPelapors\Schemas\MasterPelaporForm;
use App\Filament\Resources\MasterPelapors\Schemas\MasterPelaporInfolist;
use App\Filament\Resources\MasterPelapors\Tables\MasterPelaporsTable;
use App\Models\MasterPelapor;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class MasterPelaporResource extends Resource
{
    protected static ?string $model = MasterPelapor::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return MasterPelaporForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return MasterPelaporInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MasterPelaporsTable::configure($table);
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
            'index' => ListMasterPelapors::route('/'),
            'create' => CreateMasterPelapor::route('/create'),
            'view' => ViewMasterPelapor::route('/{record}'),
            'edit' => EditMasterPelapor::route('/{record}/edit'),
        ];
    }
}
