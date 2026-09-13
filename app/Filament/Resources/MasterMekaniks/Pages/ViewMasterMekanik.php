<?php

namespace App\Filament\Resources\MasterMekaniks\Pages;

use App\Filament\Resources\MasterMekaniks\MasterMekanikResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewMasterMekanik extends ViewRecord
{
    protected static string $resource = MasterMekanikResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
