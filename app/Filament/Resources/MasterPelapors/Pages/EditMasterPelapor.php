<?php

namespace App\Filament\Resources\MasterPelapors\Pages;

use App\Filament\Resources\MasterPelapors\MasterPelaporResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditMasterPelapor extends EditRecord
{
    protected static string $resource = MasterPelaporResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
