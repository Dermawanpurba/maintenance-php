<?php

namespace App\Filament\Resources\PmRecords\Pages;

use App\Filament\Resources\PmRecords\PmRecordResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditPmRecord extends EditRecord
{
    protected static string $resource = PmRecordResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
