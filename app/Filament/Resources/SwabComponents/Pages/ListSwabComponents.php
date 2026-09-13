<?php

namespace App\Filament\Resources\SwabComponents\Pages;

use App\Filament\Resources\SwabComponents\SwabComponentResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSwabComponents extends ListRecords
{
    protected static string $resource = SwabComponentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
