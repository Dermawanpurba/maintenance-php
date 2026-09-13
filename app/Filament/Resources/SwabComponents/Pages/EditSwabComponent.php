<?php

namespace App\Filament\Resources\SwabComponents\Pages;

use App\Filament\Resources\SwabComponents\SwabComponentResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditSwabComponent extends EditRecord
{
    protected static string $resource = SwabComponentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
