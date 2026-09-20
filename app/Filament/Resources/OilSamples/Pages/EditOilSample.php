<?php

namespace App\Filament\Resources\OilSamples\Pages;

use App\Filament\Resources\OilSamples\OilSampleResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditOilSample extends EditRecord
{
    protected static string $resource = OilSampleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
