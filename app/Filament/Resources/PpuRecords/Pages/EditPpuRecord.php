<?php

namespace App\Filament\Resources\PpuRecords\Pages;

use App\Filament\Resources\PpuRecords\PpuRecordResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditPpuRecord extends EditRecord
{
    protected static string $resource = PpuRecordResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
