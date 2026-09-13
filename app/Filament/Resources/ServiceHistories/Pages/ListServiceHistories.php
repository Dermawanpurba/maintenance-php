<?php

namespace App\Filament\Resources\ServiceHistories\Pages;

use App\Filament\Resources\ServiceHistories\ServiceHistoryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListServiceHistories extends ListRecords
{
    protected static string $resource = ServiceHistoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
