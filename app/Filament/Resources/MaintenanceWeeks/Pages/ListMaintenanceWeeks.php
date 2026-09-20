<?php

namespace App\Filament\Resources\MaintenanceWeeks\Pages;

use App\Filament\Resources\MaintenanceWeeks\MaintenanceWeekResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMaintenanceWeeks extends ListRecords
{
    protected static string $resource = MaintenanceWeekResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
