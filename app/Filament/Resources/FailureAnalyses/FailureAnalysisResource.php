<?php

namespace App\Filament\Resources\FailureAnalyses;

use App\Filament\Resources\FailureAnalyses\Pages\CreateFailureAnalysis;
use App\Filament\Resources\FailureAnalyses\Pages\EditFailureAnalysis;
use App\Filament\Resources\FailureAnalyses\Pages\ListFailureAnalyses;
use App\Filament\Resources\FailureAnalyses\Pages\ViewFailureAnalysis;
use App\Filament\Resources\FailureAnalyses\Schemas\FailureAnalysisForm;
use App\Filament\Resources\FailureAnalyses\Schemas\FailureAnalysisInfolist;
use App\Filament\Resources\FailureAnalyses\Tables\FailureAnalysesTable;
use App\Models\FailureAnalysis;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class FailureAnalysisResource extends Resource
{
    protected static ?string $model = FailureAnalysis::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return FailureAnalysisForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return FailureAnalysisInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FailureAnalysesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFailureAnalyses::route('/'),
            'create' => CreateFailureAnalysis::route('/create'),
            'view' => ViewFailureAnalysis::route('/{record}'),
            'edit' => EditFailureAnalysis::route('/{record}/edit'),
        ];
    }
}
