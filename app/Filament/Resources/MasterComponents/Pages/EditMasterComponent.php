<?php

namespace App\Filament\Resources\MasterComponents\Pages;

use App\Filament\Resources\MasterComponents\MasterComponentResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditMasterComponent extends EditRecord
{
    protected static string $resource = MasterComponentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
