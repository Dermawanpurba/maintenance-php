<?php

namespace App\Filament\Resources\SwabComponents\Pages;

use App\Filament\Resources\SwabComponents\SwabComponentResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewSwabComponent extends ViewRecord
{
    protected static string $resource = SwabComponentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
