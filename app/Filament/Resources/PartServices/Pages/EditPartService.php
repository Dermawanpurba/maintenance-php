<?php

namespace App\Filament\Resources\PartServices\Pages;

use App\Filament\Resources\PartServices\PartServiceResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditPartService extends EditRecord
{
    protected static string $resource = PartServiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
