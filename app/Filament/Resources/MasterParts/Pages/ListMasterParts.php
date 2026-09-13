<?php

namespace App\Filament\Resources\MasterParts\Pages;

use App\Filament\Resources\MasterParts\MasterPartResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMasterParts extends ListRecords
{
    protected static string $resource = MasterPartResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
