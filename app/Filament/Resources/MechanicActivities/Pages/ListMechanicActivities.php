<?php

namespace App\Filament\Resources\MechanicActivities\Pages;

use App\Filament\Resources\MechanicActivities\MechanicActivityResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMechanicActivities extends ListRecords
{
    protected static string $resource = MechanicActivityResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
