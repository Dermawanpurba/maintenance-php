<?php

namespace App\Filament\Resources\MasterMekaniks\Pages;

use App\Filament\Resources\MasterMekaniks\MasterMekanikResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditMasterMekanik extends EditRecord
{
    protected static string $resource = MasterMekanikResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
