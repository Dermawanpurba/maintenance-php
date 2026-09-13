<?php

namespace App\Filament\Resources\MasterPelapors\Pages;

use App\Filament\Resources\MasterPelapors\MasterPelaporResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewMasterPelapor extends ViewRecord
{
    protected static string $resource = MasterPelaporResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
