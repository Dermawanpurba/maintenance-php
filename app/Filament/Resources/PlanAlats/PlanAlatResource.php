<?php

namespace App\Filament\Resources\PlanAlats;

use App\Filament\Resources\PlanAlats\Pages\CreatePlanAlat;
use App\Filament\Resources\PlanAlats\Pages\EditPlanAlat;
use App\Filament\Resources\PlanAlats\Pages\ListPlanAlats;
use App\Filament\Resources\PlanAlats\Pages\ViewPlanAlat;
use App\Filament\Resources\PlanAlats\Schemas\PlanAlatForm;
use App\Filament\Resources\PlanAlats\Schemas\PlanAlatInfolist;
use App\Filament\Resources\PlanAlats\Tables\PlanAlatsTable;
use App\Models\PlanAlat;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PlanAlatResource extends Resource
{
    protected static ?string $model = PlanAlat::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return PlanAlatForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return PlanAlatInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PlanAlatsTable::configure($table);
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
            'index' => ListPlanAlats::route('/'),
            'create' => CreatePlanAlat::route('/create'),
            'view' => ViewPlanAlat::route('/{record}'),
            'edit' => EditPlanAlat::route('/{record}/edit'),
        ];
    }
}
