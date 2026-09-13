<?php

namespace App\Filament\Resources\MechanicActivities;

use App\Filament\Resources\MechanicActivities\Pages\CreateMechanicActivity;
use App\Filament\Resources\MechanicActivities\Pages\EditMechanicActivity;
use App\Filament\Resources\MechanicActivities\Pages\ListMechanicActivities;
use App\Filament\Resources\MechanicActivities\Pages\ViewMechanicActivity;
use App\Filament\Resources\MechanicActivities\Schemas\MechanicActivityForm;
use App\Filament\Resources\MechanicActivities\Schemas\MechanicActivityInfolist;
use App\Filament\Resources\MechanicActivities\Tables\MechanicActivitiesTable;
use App\Models\MechanicActivity;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class MechanicActivityResource extends Resource
{
    protected static ?string $model = MechanicActivity::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return MechanicActivityForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return MechanicActivityInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MechanicActivitiesTable::configure($table);
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
            'index' => ListMechanicActivities::route('/'),
            'create' => CreateMechanicActivity::route('/create'),
            'view' => ViewMechanicActivity::route('/{record}'),
            'edit' => EditMechanicActivity::route('/{record}/edit'),
        ];
    }
}
