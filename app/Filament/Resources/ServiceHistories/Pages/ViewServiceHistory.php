<?php

namespace App\Filament\Resources\ServiceHistories\Pages;

use App\Filament\Resources\ServiceHistories\ServiceHistoryResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewServiceHistory extends ViewRecord
{
    protected static string $resource = ServiceHistoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
