<?php

namespace App\Filament\Resources\PmRecords\Pages;

use App\Filament\Resources\PmRecords\PmRecordResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewPmRecord extends ViewRecord
{
    protected static string $resource = PmRecordResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
