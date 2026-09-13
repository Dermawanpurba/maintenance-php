<?php

namespace App\Filament\Resources\MasterEquips\Pages;

use App\Filament\Resources\MasterEquips\MasterEquipResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMasterEquips extends ListRecords
{
    protected static string $resource = MasterEquipResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
