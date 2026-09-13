<?php

namespace App\Filament\Resources\FailureAnalyses\Pages;

use App\Filament\Resources\FailureAnalyses\FailureAnalysisResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditFailureAnalysis extends EditRecord
{
    protected static string $resource = FailureAnalysisResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
