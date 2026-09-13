<?php

namespace App\Filament\Resources\MasterEquips\Pages;

use App\Filament\Resources\MasterEquips\MasterEquipResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewMasterEquip extends ViewRecord
{
    protected static string $resource = MasterEquipResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
