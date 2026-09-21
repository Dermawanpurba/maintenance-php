<?php

namespace App\Filament\Resources\MasterModels\Pages;

use App\Filament\Resources\MasterModels\MasterModelResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditMasterModel extends EditRecord
{
    protected static string $resource = MasterModelResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
