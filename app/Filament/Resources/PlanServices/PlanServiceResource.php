<?php

namespace App\Filament\Resources\PlanServices;

use App\Filament\Resources\PlanServices\Pages\CreatePlanService;
use App\Filament\Resources\PlanServices\Pages\EditPlanService;
use App\Filament\Resources\PlanServices\Pages\ListPlanServices;
use App\Filament\Resources\PlanServices\Pages\ViewPlanService;
use App\Filament\Resources\PlanServices\Schemas\PlanServiceForm;
use App\Filament\Resources\PlanServices\Schemas\PlanServiceInfolist;
use App\Filament\Resources\PlanServices\Tables\PlanServicesTable;
use App\Models\PlanService;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PlanServiceResource extends Resource
{
    protected static ?string $model = PlanService::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-calendar-days';

    protected static string|\UnitEnum|null $navigationGroup = 'Master & Warehouse';

    protected static ?string $navigationLabel = 'Estimasi Service (Plan Service)';

    protected static ?string $modelLabel = 'Plan Service';

    protected static ?string $pluralModelLabel = 'Estimasi Service (Plan Service)';

    protected static ?int $navigationSort = 2;

    protected static ?string $recordTitleAttribute = 'equip_no';

    public static function form(Schema $schema): Schema
    {
        return PlanServiceForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return PlanServiceInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PlanServicesTable::configure($table);
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
            'index' => ListPlanServices::route('/'),
            'create' => CreatePlanService::route('/create'),
            'view' => ViewPlanService::route('/{record}'),
            'edit' => EditPlanService::route('/{record}/edit'),
        ];
    }
}
