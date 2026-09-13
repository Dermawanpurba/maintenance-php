<?php

namespace App\Filament\Resources\PcrComponents\Pages;

use App\Filament\Resources\PcrComponents\PcrComponentResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPcrComponents extends ListRecords
{
    protected static string $resource = PcrComponentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
