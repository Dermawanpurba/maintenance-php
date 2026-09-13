<?php

namespace App\Filament\Resources\MechanicActivities\Pages;

use App\Filament\Resources\MechanicActivities\MechanicActivityResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewMechanicActivity extends ViewRecord
{
    protected static string $resource = MechanicActivityResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
