<?php

namespace App\Filament\Resources\TargetJamOperasis;

use App\Filament\Resources\TargetJamOperasis\Pages\CreateTargetJamOperasi;
use App\Filament\Resources\TargetJamOperasis\Pages\EditTargetJamOperasi;
use App\Filament\Resources\TargetJamOperasis\Pages\ListTargetJamOperasis;
use App\Filament\Resources\TargetJamOperasis\Pages\ViewTargetJamOperasi;
use App\Filament\Resources\TargetJamOperasis\Schemas\TargetJamOperasiForm;
use App\Filament\Resources\TargetJamOperasis\Schemas\TargetJamOperasiInfolist;
use App\Filament\Resources\TargetJamOperasis\Tables\TargetJamOperasisTable;
use App\Models\TargetJamOperasi;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class TargetJamOperasiResource extends Resource
{
    protected static ?string $model = TargetJamOperasi::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return TargetJamOperasiForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return TargetJamOperasiInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TargetJamOperasisTable::configure($table);
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
            'index' => ListTargetJamOperasis::route('/'),
            'create' => CreateTargetJamOperasi::route('/create'),
            'view' => ViewTargetJamOperasi::route('/{record}'),
            'edit' => EditTargetJamOperasi::route('/{record}/edit'),
        ];
    }
}
