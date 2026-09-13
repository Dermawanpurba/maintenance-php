<?php

namespace App\Filament\Resources\DailyHms\Pages;

use App\Filament\Resources\DailyHms\DailyHmResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditDailyHm extends EditRecord
{
    protected static string $resource = DailyHmResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
