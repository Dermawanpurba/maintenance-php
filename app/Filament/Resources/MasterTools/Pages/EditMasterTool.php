<?php

namespace App\Filament\Resources\MasterTools\Pages;

use App\Filament\Resources\MasterTools\MasterToolResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditMasterTool extends EditRecord
{
    protected static string $resource = MasterToolResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
