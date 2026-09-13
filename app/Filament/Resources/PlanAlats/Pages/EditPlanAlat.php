<?php

namespace App\Filament\Resources\PlanAlats\Pages;

use App\Filament\Resources\PlanAlats\PlanAlatResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditPlanAlat extends EditRecord
{
    protected static string $resource = PlanAlatResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
