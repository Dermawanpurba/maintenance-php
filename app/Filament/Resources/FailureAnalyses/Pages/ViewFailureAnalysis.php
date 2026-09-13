<?php

namespace App\Filament\Resources\FailureAnalyses\Pages;

use App\Filament\Resources\FailureAnalyses\FailureAnalysisResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewFailureAnalysis extends ViewRecord
{
    protected static string $resource = FailureAnalysisResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
