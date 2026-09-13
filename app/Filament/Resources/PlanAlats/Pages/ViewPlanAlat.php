<?php

namespace App\Filament\Resources\PlanAlats\Pages;

use App\Filament\Resources\PlanAlats\PlanAlatResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewPlanAlat extends ViewRecord
{
    protected static string $resource = PlanAlatResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
