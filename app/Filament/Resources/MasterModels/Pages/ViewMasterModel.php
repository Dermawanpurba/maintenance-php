<?php

namespace App\Filament\Resources\MasterModels\Pages;

use App\Filament\Resources\MasterModels\MasterModelResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewMasterModel extends ViewRecord
{
    protected static string $resource = MasterModelResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
