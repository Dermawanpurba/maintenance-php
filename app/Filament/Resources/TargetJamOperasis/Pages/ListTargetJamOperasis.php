<?php

namespace App\Filament\Resources\TargetJamOperasis\Pages;

use App\Filament\Resources\TargetJamOperasis\TargetJamOperasiResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTargetJamOperasis extends ListRecords
{
    protected static string $resource = TargetJamOperasiResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
