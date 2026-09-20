<?php

namespace App\Filament\Resources\TargetJamHarians\Pages;

use App\Filament\Resources\TargetJamHarians\TargetJamHarianResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditTargetJamHarian extends EditRecord
{
    protected static string $resource = TargetJamHarianResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
