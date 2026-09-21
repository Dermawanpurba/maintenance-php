<?php

namespace App\Filament\Resources\PartServices\Pages;

use App\Filament\Resources\PartServices\PartServiceResource;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPartServices extends ListRecords
{
    protected static string $resource = PartServiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('planning_part_service')
                ->label('Buka Planning Part Service')
                ->icon('heroicon-o-clipboard-document-list')
                ->color('info')
                ->url(url('/admin/planning-part-service')),
            CreateAction::make(),
        ];
    }
}
