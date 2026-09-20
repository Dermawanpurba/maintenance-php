<?php

namespace App\Filament\Resources\OilSamples\Pages;

use App\Filament\Resources\OilSamples\OilSampleResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewOilSample extends ViewRecord
{
    protected static string $resource = OilSampleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
