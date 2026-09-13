<?php

namespace App\Filament\Resources\DailyHms\Pages;

use App\Filament\Resources\DailyHms\DailyHmResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewDailyHm extends ViewRecord
{
    protected static string $resource = DailyHmResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
