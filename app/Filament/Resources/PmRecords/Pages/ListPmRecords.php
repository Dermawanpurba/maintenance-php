<?php

namespace App\Filament\Resources\PmRecords\Pages;

use App\Filament\Resources\PmRecords\PmRecordResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPmRecords extends ListRecords
{
    protected static string $resource = PmRecordResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
