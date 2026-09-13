<?php

namespace App\Filament\Resources\SwabComponents;

use App\Filament\Resources\SwabComponents\Pages\CreateSwabComponent;
use App\Filament\Resources\SwabComponents\Pages\EditSwabComponent;
use App\Filament\Resources\SwabComponents\Pages\ListSwabComponents;
use App\Filament\Resources\SwabComponents\Pages\ViewSwabComponent;
use App\Filament\Resources\SwabComponents\Schemas\SwabComponentForm;
use App\Filament\Resources\SwabComponents\Schemas\SwabComponentInfolist;
use App\Filament\Resources\SwabComponents\Tables\SwabComponentsTable;
use App\Models\SwabComponent;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SwabComponentResource extends Resource
{
    protected static ?string $model = SwabComponent::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return SwabComponentForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return SwabComponentInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SwabComponentsTable::configure($table);
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
            'index' => ListSwabComponents::route('/'),
            'create' => CreateSwabComponent::route('/create'),
            'view' => ViewSwabComponent::route('/{record}'),
            'edit' => EditSwabComponent::route('/{record}/edit'),
        ];
    }
}
