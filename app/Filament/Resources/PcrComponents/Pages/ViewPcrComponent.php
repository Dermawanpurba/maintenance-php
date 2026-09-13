<?php

namespace App\Filament\Resources\PcrComponents\Pages;

use App\Filament\Resources\PcrComponents\PcrComponentResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewPcrComponent extends ViewRecord
{
    protected static string $resource = PcrComponentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
