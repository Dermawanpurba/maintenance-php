<?php

namespace App\Filament\Resources\PlanServices\Pages;

use App\Filament\Resources\PlanServices\PlanServiceResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewPlanService extends ViewRecord
{
    protected static string $resource = PlanServiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
