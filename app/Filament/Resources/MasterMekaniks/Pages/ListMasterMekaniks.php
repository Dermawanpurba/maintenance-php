<?php

namespace App\Filament\Resources\MasterMekaniks\Pages;

use App\Filament\Resources\MasterMekaniks\MasterMekanikResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMasterMekaniks extends ListRecords
{
    protected static string $resource = MasterMekanikResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
