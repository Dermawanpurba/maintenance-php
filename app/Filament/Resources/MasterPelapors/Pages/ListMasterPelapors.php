<?php

namespace App\Filament\Resources\MasterPelapors\Pages;

use App\Filament\Resources\MasterPelapors\MasterPelaporResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMasterPelapors extends ListRecords
{
    protected static string $resource = MasterPelaporResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
