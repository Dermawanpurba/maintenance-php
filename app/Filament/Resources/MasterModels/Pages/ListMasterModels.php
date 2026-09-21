<?php

namespace App\Filament\Resources\MasterModels\Pages;

use App\Filament\Resources\MasterModels\MasterModelResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMasterModels extends ListRecords
{
    protected static string $resource = MasterModelResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
