<?php

namespace App\Filament\Resources\SystemLogs\Pages;

use App\Filament\Resources\SystemLogs\SystemLogResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSystemLogs extends ListRecords
{
    protected static string $resource = SystemLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
