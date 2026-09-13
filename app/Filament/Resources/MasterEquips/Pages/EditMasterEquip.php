<?php

namespace App\Filament\Resources\MasterEquips\Pages;

use App\Filament\Resources\MasterEquips\MasterEquipResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditMasterEquip extends EditRecord
{
    protected static string $resource = MasterEquipResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
