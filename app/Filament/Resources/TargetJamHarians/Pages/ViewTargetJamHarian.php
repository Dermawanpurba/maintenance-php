<?php

namespace App\Filament\Resources\TargetJamHarians\Pages;

use App\Filament\Resources\TargetJamHarians\TargetJamHarianResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewTargetJamHarian extends ViewRecord
{
    protected static string $resource = TargetJamHarianResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
