<?php

namespace App\Filament\Resources\MasterComponents\Pages;

use App\Filament\Resources\MasterComponents\MasterComponentResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewMasterComponent extends ViewRecord
{
    protected static string $resource = MasterComponentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
