<?php

namespace App\Filament\Resources\PpuRecords\Pages;

use App\Filament\Resources\PpuRecords\PpuRecordResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewPpuRecord extends ViewRecord
{
    protected static string $resource = PpuRecordResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
