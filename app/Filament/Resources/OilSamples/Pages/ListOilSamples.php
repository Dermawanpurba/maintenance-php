<?php

namespace App\Filament\Resources\OilSamples\Pages;

use App\Filament\Resources\OilSamples\OilSampleResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListOilSamples extends ListRecords
{
    protected static string $resource = OilSampleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
