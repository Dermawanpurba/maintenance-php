<?php

namespace App\Filament\Resources\MaintenanceWeeks\Pages;

use App\Filament\Resources\MaintenanceWeeks\MaintenanceWeekResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditMaintenanceWeek extends EditRecord
{
    protected static string $resource = MaintenanceWeekResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
