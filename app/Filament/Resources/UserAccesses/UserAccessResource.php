<?php

namespace App\Filament\Resources\UserAccesses;

use App\Filament\Resources\UserAccesses\Pages\CreateUserAccess;
use App\Filament\Resources\UserAccesses\Pages\EditUserAccess;
use App\Filament\Resources\UserAccesses\Pages\ListUserAccesses;
use App\Filament\Resources\UserAccesses\Pages\ViewUserAccess;
use App\Filament\Resources\UserAccesses\Schemas\UserAccessForm;
use App\Filament\Resources\UserAccesses\Schemas\UserAccessInfolist;
use App\Filament\Resources\UserAccesses\Tables\UserAccessesTable;
use App\Models\UserAccess;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class UserAccessResource extends Resource
{
    protected static ?string $model = UserAccess::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return UserAccessForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return UserAccessInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UserAccessesTable::configure($table);
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
            'index' => ListUserAccesses::route('/'),
            'create' => CreateUserAccess::route('/create'),
            'view' => ViewUserAccess::route('/{record}'),
            'edit' => EditUserAccess::route('/{record}/edit'),
        ];
    }
}
