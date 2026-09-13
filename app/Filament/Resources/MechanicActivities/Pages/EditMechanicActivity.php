<?php

namespace App\Filament\Resources\MechanicActivities\Pages;

use App\Filament\Resources\MechanicActivities\MechanicActivityResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditMechanicActivity extends EditRecord
{
    protected static string $resource = MechanicActivityResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
