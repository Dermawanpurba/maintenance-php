<?php

namespace App\Filament\Resources\MasterTools\Pages;

use App\Filament\Resources\MasterTools\MasterToolResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMasterTools extends ListRecords
{
    protected static string $resource = MasterToolResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
