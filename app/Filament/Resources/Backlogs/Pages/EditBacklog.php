<?php

namespace App\Filament\Resources\Backlogs\Pages;

use App\Filament\Resources\Backlogs\BacklogResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditBacklog extends EditRecord
{
    protected static string $resource = BacklogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
