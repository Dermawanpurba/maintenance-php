<?php

namespace App\Filament\Resources\TargetJamHarians;

use App\Filament\Resources\TargetJamHarians\Pages\CreateTargetJamHarian;
use App\Filament\Resources\TargetJamHarians\Pages\EditTargetJamHarian;
use App\Filament\Resources\TargetJamHarians\Pages\ListTargetJamHarians;
use App\Filament\Resources\TargetJamHarians\Pages\ViewTargetJamHarian;
use App\Filament\Resources\TargetJamHarians\Schemas\TargetJamHarianForm;
use App\Filament\Resources\TargetJamHarians\Schemas\TargetJamHarianInfolist;
use App\Filament\Resources\TargetJamHarians\Tables\TargetJamHariansTable;
use App\Models\TargetJamHarian;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class TargetJamHarianResource extends Resource
{
    protected static ?string $model = TargetJamHarian::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return TargetJamHarianForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return TargetJamHarianInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TargetJamHariansTable::configure($table);
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
            'index' => ListTargetJamHarians::route('/'),
            'create' => CreateTargetJamHarian::route('/create'),
            'view' => ViewTargetJamHarian::route('/{record}'),
            'edit' => EditTargetJamHarian::route('/{record}/edit'),
        ];
    }
}
