<?php

namespace App\Filament\Resources\PcrComponents;

use App\Filament\Resources\PcrComponents\Pages\CreatePcrComponent;
use App\Filament\Resources\PcrComponents\Pages\EditPcrComponent;
use App\Filament\Resources\PcrComponents\Pages\ListPcrComponents;
use App\Filament\Resources\PcrComponents\Pages\ViewPcrComponent;
use App\Filament\Resources\PcrComponents\Schemas\PcrComponentForm;
use App\Filament\Resources\PcrComponents\Schemas\PcrComponentInfolist;
use App\Filament\Resources\PcrComponents\Tables\PcrComponentsTable;
use App\Models\PcrComponent;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PcrComponentResource extends Resource
{
    protected static ?string $model = PcrComponent::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return PcrComponentForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return PcrComponentInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PcrComponentsTable::configure($table);
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
            'index' => ListPcrComponents::route('/'),
            'create' => CreatePcrComponent::route('/create'),
            'view' => ViewPcrComponent::route('/{record}'),
            'edit' => EditPcrComponent::route('/{record}/edit'),
        ];
    }
}
