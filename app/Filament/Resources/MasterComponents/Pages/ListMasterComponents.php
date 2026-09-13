<?php

namespace App\Filament\Resources\MasterComponents\Pages;

use App\Filament\Resources\MasterComponents\MasterComponentResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMasterComponents extends ListRecords
{
    protected static string $resource = MasterComponentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
