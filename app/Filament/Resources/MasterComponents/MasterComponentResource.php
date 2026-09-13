<?php

namespace App\Filament\Resources\MasterComponents;

use App\Filament\Resources\MasterComponents\Pages\CreateMasterComponent;
use App\Filament\Resources\MasterComponents\Pages\EditMasterComponent;
use App\Filament\Resources\MasterComponents\Pages\ListMasterComponents;
use App\Filament\Resources\MasterComponents\Pages\ViewMasterComponent;
use App\Filament\Resources\MasterComponents\Schemas\MasterComponentForm;
use App\Filament\Resources\MasterComponents\Schemas\MasterComponentInfolist;
use App\Filament\Resources\MasterComponents\Tables\MasterComponentsTable;
use App\Models\MasterComponent;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class MasterComponentResource extends Resource
{
    protected static ?string $model = MasterComponent::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return MasterComponentForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return MasterComponentInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MasterComponentsTable::configure($table);
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
            'index' => ListMasterComponents::route('/'),
            'create' => CreateMasterComponent::route('/create'),
            'view' => ViewMasterComponent::route('/{record}'),
            'edit' => EditMasterComponent::route('/{record}/edit'),
        ];
    }
}
