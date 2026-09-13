<?php

namespace App\Filament\Resources\MasterParts\Pages;

use App\Filament\Resources\MasterParts\MasterPartResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewMasterPart extends ViewRecord
{
    protected static string $resource = MasterPartResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
