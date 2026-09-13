<?php

namespace App\Filament\Resources\FailureAnalyses\Pages;

use App\Filament\Resources\FailureAnalyses\FailureAnalysisResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFailureAnalyses extends ListRecords
{
    protected static string $resource = FailureAnalysisResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
