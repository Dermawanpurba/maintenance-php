<?php

namespace App\Filament\Resources\Backlogs\Pages;

use App\Filament\Resources\Backlogs\BacklogResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewBacklog extends ViewRecord
{
    protected static string $resource = BacklogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
