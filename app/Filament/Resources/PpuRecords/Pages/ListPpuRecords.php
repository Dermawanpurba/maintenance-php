<?php

namespace App\Filament\Resources\PpuRecords\Pages;

use App\Filament\Resources\PpuRecords\PpuRecordResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPpuRecords extends ListRecords
{
    protected static string $resource = PpuRecordResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
