<?php

namespace App\Filament\Resources\MasterParts\Pages;

use App\Filament\Resources\MasterParts\MasterPartResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditMasterPart extends EditRecord
{
    protected static string $resource = MasterPartResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
