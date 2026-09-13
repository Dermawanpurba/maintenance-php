<?php

namespace App\Filament\Resources\EquipmentCosts\Pages;

use App\Filament\Resources\EquipmentCosts\EquipmentCostResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListEquipmentCosts extends ListRecords
{
    protected static string $resource = EquipmentCostResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
