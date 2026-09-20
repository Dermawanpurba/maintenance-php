<?php

namespace App\Filament\Resources\TargetJamHarians\Pages;

use App\Filament\Resources\TargetJamHarians\TargetJamHarianResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTargetJamHarians extends ListRecords
{
    protected static string $resource = TargetJamHarianResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
