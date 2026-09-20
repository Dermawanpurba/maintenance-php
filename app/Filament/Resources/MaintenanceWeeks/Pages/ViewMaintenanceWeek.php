<?php

namespace App\Filament\Resources\MaintenanceWeeks\Pages;

use App\Filament\Resources\MaintenanceWeeks\MaintenanceWeekResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewMaintenanceWeek extends ViewRecord
{
    protected static string $resource = MaintenanceWeekResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
