<?php

namespace App\Filament\Resources\MaintenanceWeeks;

use App\Filament\Resources\MaintenanceWeeks\Pages\CreateMaintenanceWeek;
use App\Filament\Resources\MaintenanceWeeks\Pages\EditMaintenanceWeek;
use App\Filament\Resources\MaintenanceWeeks\Pages\ListMaintenanceWeeks;
use App\Filament\Resources\MaintenanceWeeks\Pages\ViewMaintenanceWeek;
use App\Filament\Resources\MaintenanceWeeks\Schemas\MaintenanceWeekForm;
use App\Filament\Resources\MaintenanceWeeks\Schemas\MaintenanceWeekInfolist;
use App\Filament\Resources\MaintenanceWeeks\Tables\MaintenanceWeeksTable;
use App\Models\MaintenanceWeek;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class MaintenanceWeekResource extends Resource
{
    protected static ?string $model = MaintenanceWeek::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCalendarDays;

    protected static ?string $navigationLabel = 'Kelola Minggu';

    protected static string|\UnitEnum|null $navigationGroup = 'Basic Maintenance';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'week_no';

    protected static ?string $modelLabel = 'Periode Minggu';

    protected static ?string $pluralModelLabel = 'Periode Minggu';

    public static function form(Schema $schema): Schema
    {
        return MaintenanceWeekForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return MaintenanceWeekInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MaintenanceWeeksTable::configure($table);
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
            'index'  => ListMaintenanceWeeks::route('/'),
            'create' => CreateMaintenanceWeek::route('/create'),
            'view'   => ViewMaintenanceWeek::route('/{record}'),
            'edit'   => EditMaintenanceWeek::route('/{record}/edit'),
        ];
    }
}
