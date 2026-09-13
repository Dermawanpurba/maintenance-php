<?php

namespace App\Filament\Resources\DailyHms\Pages;

use App\Filament\Resources\DailyHms\DailyHmResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListDailyHms extends ListRecords
{
    protected static string $resource = DailyHmResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
