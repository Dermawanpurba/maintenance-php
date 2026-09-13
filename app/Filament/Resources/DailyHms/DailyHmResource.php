<?php

namespace App\Filament\Resources\DailyHms;

use App\Filament\Resources\DailyHms\Pages\CreateDailyHm;
use App\Filament\Resources\DailyHms\Pages\EditDailyHm;
use App\Filament\Resources\DailyHms\Pages\ListDailyHms;
use App\Filament\Resources\DailyHms\Pages\ViewDailyHm;
use App\Filament\Resources\DailyHms\Schemas\DailyHmForm;
use App\Filament\Resources\DailyHms\Schemas\DailyHmInfolist;
use App\Filament\Resources\DailyHms\Tables\DailyHmsTable;
use App\Models\DailyHm;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class DailyHmResource extends Resource
{
    protected static ?string $model = DailyHm::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return DailyHmForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return DailyHmInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DailyHmsTable::configure($table);
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
            'index' => ListDailyHms::route('/'),
            'create' => CreateDailyHm::route('/create'),
            'view' => ViewDailyHm::route('/{record}'),
            'edit' => EditDailyHm::route('/{record}/edit'),
        ];
    }
}
