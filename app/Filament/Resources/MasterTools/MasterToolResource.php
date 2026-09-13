<?php

namespace App\Filament\Resources\MasterTools;

use App\Filament\Resources\MasterTools\Pages\CreateMasterTool;
use App\Filament\Resources\MasterTools\Pages\EditMasterTool;
use App\Filament\Resources\MasterTools\Pages\ListMasterTools;
use App\Filament\Resources\MasterTools\Pages\ViewMasterTool;
use App\Filament\Resources\MasterTools\Schemas\MasterToolForm;
use App\Filament\Resources\MasterTools\Schemas\MasterToolInfolist;
use App\Filament\Resources\MasterTools\Tables\MasterToolsTable;
use App\Models\MasterTool;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class MasterToolResource extends Resource
{
    protected static ?string $model = MasterTool::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return MasterToolForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return MasterToolInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MasterToolsTable::configure($table);
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
            'index' => ListMasterTools::route('/'),
            'create' => CreateMasterTool::route('/create'),
            'view' => ViewMasterTool::route('/{record}'),
            'edit' => EditMasterTool::route('/{record}/edit'),
        ];
    }
}
