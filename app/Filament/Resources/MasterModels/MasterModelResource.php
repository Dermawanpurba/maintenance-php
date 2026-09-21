<?php

namespace App\Filament\Resources\MasterModels;

use App\Filament\Resources\MasterModels\Pages\CreateMasterModel;
use App\Filament\Resources\MasterModels\Pages\EditMasterModel;
use App\Filament\Resources\MasterModels\Pages\ListMasterModels;
use App\Filament\Resources\MasterModels\Pages\ViewMasterModel;
use App\Filament\Resources\MasterModels\Schemas\MasterModelForm;
use App\Filament\Resources\MasterModels\Schemas\MasterModelInfolist;
use App\Filament\Resources\MasterModels\Tables\MasterModelsTable;
use App\Models\MasterModel;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class MasterModelResource extends Resource
{
    protected static ?string $model = MasterModel::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-truck';
    protected static string|\UnitEnum|null $navigationGroup = 'Master Data';
    protected static ?string $navigationLabel = 'Master Model Unit';
    protected static ?int $navigationSort = 3;

    protected static ?string $recordTitleAttribute = 'model_name';

    public static function form(Schema $schema): Schema
    {
        return MasterModelForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return MasterModelInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MasterModelsTable::configure($table);
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
            'index' => ListMasterModels::route('/'),
            'create' => CreateMasterModel::route('/create'),
            'view' => ViewMasterModel::route('/{record}'),
            'edit' => EditMasterModel::route('/{record}/edit'),
        ];
    }
}
