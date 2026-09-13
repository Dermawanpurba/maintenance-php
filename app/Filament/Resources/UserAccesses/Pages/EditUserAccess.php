<?php

namespace App\Filament\Resources\UserAccesses\Pages;

use App\Filament\Resources\UserAccesses\UserAccessResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditUserAccess extends EditRecord
{
    protected static string $resource = UserAccessResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
