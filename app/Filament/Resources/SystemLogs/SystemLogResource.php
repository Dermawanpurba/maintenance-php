<?php

namespace App\Filament\Resources\SystemLogs;

use App\Filament\Resources\SystemLogs\Pages\CreateSystemLog;
use App\Filament\Resources\SystemLogs\Pages\EditSystemLog;
use App\Filament\Resources\SystemLogs\Pages\ListSystemLogs;
use App\Filament\Resources\SystemLogs\Pages\ViewSystemLog;
use App\Filament\Resources\SystemLogs\Schemas\SystemLogForm;
use App\Filament\Resources\SystemLogs\Schemas\SystemLogInfolist;
use App\Filament\Resources\SystemLogs\Tables\SystemLogsTable;
use App\Models\SystemLog;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SystemLogResource extends Resource
{
    protected static ?string $model = SystemLog::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return SystemLogForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return SystemLogInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SystemLogsTable::configure($table);
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
            'index' => ListSystemLogs::route('/'),
            'create' => CreateSystemLog::route('/create'),
            'view' => ViewSystemLog::route('/{record}'),
            'edit' => EditSystemLog::route('/{record}/edit'),
        ];
    }
}
