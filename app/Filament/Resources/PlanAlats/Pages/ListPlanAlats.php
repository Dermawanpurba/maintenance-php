<?php

namespace App\Filament\Resources\PlanAlats\Pages;

use App\Filament\Resources\PlanAlats\PlanAlatResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPlanAlats extends ListRecords
{
    protected static string $resource = PlanAlatResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
