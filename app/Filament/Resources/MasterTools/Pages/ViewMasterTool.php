<?php

namespace App\Filament\Resources\MasterTools\Pages;

use App\Filament\Resources\MasterTools\MasterToolResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewMasterTool extends ViewRecord
{
    protected static string $resource = MasterToolResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
