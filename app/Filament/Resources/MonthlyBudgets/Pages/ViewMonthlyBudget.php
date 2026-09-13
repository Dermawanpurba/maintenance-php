<?php

namespace App\Filament\Resources\MonthlyBudgets\Pages;

use App\Filament\Resources\MonthlyBudgets\MonthlyBudgetResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewMonthlyBudget extends ViewRecord
{
    protected static string $resource = MonthlyBudgetResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
