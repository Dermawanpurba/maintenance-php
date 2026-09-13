<?php

namespace App\Filament\Resources\ServiceHistories\Pages;

use App\Filament\Resources\ServiceHistories\ServiceHistoryResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditServiceHistory extends EditRecord
{
    protected static string $resource = ServiceHistoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
