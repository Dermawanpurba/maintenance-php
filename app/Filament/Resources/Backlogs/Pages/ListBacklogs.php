<?php

namespace App\Filament\Resources\Backlogs\Pages;

use App\Filament\Resources\Backlogs\BacklogResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBacklogs extends ListRecords
{
    protected static string $resource = BacklogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
