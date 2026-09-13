<?php

namespace App\Filament\Resources\PlanServices\Pages;

use App\Filament\Resources\PlanServices\PlanServiceResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditPlanService extends EditRecord
{
    protected static string $resource = PlanServiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
