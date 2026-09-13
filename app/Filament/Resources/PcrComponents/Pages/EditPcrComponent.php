<?php

namespace App\Filament\Resources\PcrComponents\Pages;

use App\Filament\Resources\PcrComponents\PcrComponentResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditPcrComponent extends EditRecord
{
    protected static string $resource = PcrComponentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
