<?php

namespace App\Filament\Resources\PartServices\Pages;

use App\Filament\Resources\PartServices\PartServiceResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewPartService extends ViewRecord
{
    protected static string $resource = PartServiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
