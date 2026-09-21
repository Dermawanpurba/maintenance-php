<?php

namespace App\Filament\Resources\Backlogs;

use App\Filament\Resources\Backlogs\Pages\CreateBacklog;
use App\Filament\Resources\Backlogs\Pages\EditBacklog;
use App\Filament\Resources\Backlogs\Pages\ListBacklogs;
use App\Filament\Resources\Backlogs\Pages\ViewBacklog;
use App\Filament\Resources\Backlogs\Schemas\BacklogForm;
use App\Filament\Resources\Backlogs\Schemas\BacklogInfolist;
use App\Filament\Resources\Backlogs\Tables\BacklogsTable;
use App\Models\Backlog;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;

class BacklogResource extends Resource
{
    protected static ?string $model = Backlog::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-exclamation-triangle';
    protected static string|\UnitEnum|null $navigationGroup = 'Condition Monitoring';
    protected static ?string $navigationLabel = 'Backlog Defect';
    protected static ?int $navigationSort = 4;

    public static function getNavigationBadge(): ?string
    {
        $open = Backlog::where('status', 'OPEN')->count();
        return $open > 0 ? (string) $open : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function form(Schema $schema): Schema
    {
        return BacklogForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return BacklogInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BacklogsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListBacklogs::route('/'),
            'create' => CreateBacklog::route('/create'),
            'view'   => ViewBacklog::route('/{record}'),
            'edit'   => EditBacklog::route('/{record}/edit'),
        ];
    }
}
