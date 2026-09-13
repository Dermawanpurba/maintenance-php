<?php

namespace App\Filament\Resources\EquipmentCosts\Pages;

use App\Filament\Resources\EquipmentCosts\EquipmentCostResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewEquipmentCost extends ViewRecord
{
    protected static string $resource = EquipmentCostResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
