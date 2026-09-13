<?php

namespace App\Filament\Resources\SystemLogs\Pages;

use App\Filament\Resources\SystemLogs\SystemLogResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewSystemLog extends ViewRecord
{
    protected static string $resource = SystemLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
