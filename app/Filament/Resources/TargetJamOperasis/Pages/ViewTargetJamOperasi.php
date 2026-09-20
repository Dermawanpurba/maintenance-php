<?php

namespace App\Filament\Resources\TargetJamOperasis\Pages;

use App\Filament\Resources\TargetJamOperasis\TargetJamOperasiResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewTargetJamOperasi extends ViewRecord
{
    protected static string $resource = TargetJamOperasiResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
