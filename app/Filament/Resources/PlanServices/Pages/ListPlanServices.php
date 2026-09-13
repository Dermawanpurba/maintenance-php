<?php

namespace App\Filament\Resources\PlanServices\Pages;

use App\Filament\Resources\PlanServices\PlanServiceResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPlanServices extends ListRecords
{
    protected static string $resource = PlanServiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
