<?php

namespace App\Filament\Resources\MonthlyBudgets;

use App\Filament\Resources\MonthlyBudgets\Pages\CreateMonthlyBudget;
use App\Filament\Resources\MonthlyBudgets\Pages\EditMonthlyBudget;
use App\Filament\Resources\MonthlyBudgets\Pages\ListMonthlyBudgets;
use App\Filament\Resources\MonthlyBudgets\Pages\ViewMonthlyBudget;
use App\Filament\Resources\MonthlyBudgets\Schemas\MonthlyBudgetForm;
use App\Filament\Resources\MonthlyBudgets\Schemas\MonthlyBudgetInfolist;
use App\Filament\Resources\MonthlyBudgets\Tables\MonthlyBudgetsTable;
use App\Models\MonthlyBudget;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class MonthlyBudgetResource extends Resource
{
    protected static ?string $model = MonthlyBudget::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $navigationLabel = 'Maintenance Budget & Realization';

    protected static string|\UnitEnum|null $navigationGroup = 'Planning & Coordination';

    protected static ?string $modelLabel = 'Maintenance Budget';

    protected static ?string $pluralModelLabel = 'Maintenance Budget & Realization';

    public static function form(Schema $schema): Schema
    {
        return MonthlyBudgetForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return MonthlyBudgetInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MonthlyBudgetsTable::configure($table);
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
            'index' => ListMonthlyBudgets::route('/'),
            'create' => CreateMonthlyBudget::route('/create'),
            'view' => ViewMonthlyBudget::route('/{record}'),
            'edit' => EditMonthlyBudget::route('/{record}/edit'),
        ];
    }
}
