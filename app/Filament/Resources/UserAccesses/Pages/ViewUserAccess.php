<?php

namespace App\Filament\Resources\UserAccesses\Pages;

use App\Filament\Resources\UserAccesses\UserAccessResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewUserAccess extends ViewRecord
{
    protected static string $resource = UserAccessResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
