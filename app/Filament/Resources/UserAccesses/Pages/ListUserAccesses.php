<?php

namespace App\Filament\Resources\UserAccesses\Pages;

use App\Filament\Resources\UserAccesses\UserAccessResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListUserAccesses extends ListRecords
{
    protected static string $resource = UserAccessResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
