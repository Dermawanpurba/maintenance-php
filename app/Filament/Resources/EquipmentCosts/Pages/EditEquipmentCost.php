<?php

namespace App\Filament\Resources\EquipmentCosts\Pages;

use App\Filament\Resources\EquipmentCosts\EquipmentCostResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditEquipmentCost extends EditRecord
{
    protected static string $resource = EquipmentCostResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
