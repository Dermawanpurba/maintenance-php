<?php

namespace App\Filament\Resources\TargetJamOperasis\Pages;

use App\Filament\Resources\TargetJamOperasis\TargetJamOperasiResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditTargetJamOperasi extends EditRecord
{
    protected static string $resource = TargetJamOperasiResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
