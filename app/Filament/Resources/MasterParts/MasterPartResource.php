<?php

namespace App\Filament\Resources\MasterParts;

use App\Filament\Resources\MasterParts\Pages\CreateMasterPart;
use App\Filament\Resources\MasterParts\Pages\EditMasterPart;
use App\Filament\Resources\MasterParts\Pages\ListMasterParts;
use App\Filament\Resources\MasterParts\Pages\ViewMasterPart;
use App\Filament\Resources\MasterParts\Schemas\MasterPartForm;
use App\Filament\Resources\MasterParts\Schemas\MasterPartInfolist;
use App\Filament\Resources\MasterParts\Tables\MasterPartsTable;
use App\Models\MasterPart;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class MasterPartResource extends Resource
{
    protected static ?string $model = MasterPart::class;

    protected static string|\BackedEnum|null $navigationIcon  = Heroicon::OutlinedRectangleStack;
    protected static \UnitEnum|string|null   $navigationGroup = 'Master Data';
    protected static ?string $navigationLabel  = 'Katalog Suku Cadang';
    protected static ?int    $navigationSort   = 3;

    /**
     * Tampilkan badge merah jika ada part dengan stok di bawah minimum.
     */
    public static function getNavigationBadge(): ?string
    {
        $lowStockCount = MasterPart::whereColumn('stock', '<', 'min_stock')
            ->where('min_stock', '>', 0)
            ->count();

        return $lowStockCount > 0 ? (string) $lowStockCount : null;
    }

    public static function getNavigationBadgeColor(): string
    {
        return 'danger';
    }

    public static function form(Schema $schema): Schema
    {
        return MasterPartForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return MasterPartInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MasterPartsTable::configure($table);
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
            'index' => ListMasterParts::route('/'),
            'create' => CreateMasterPart::route('/create'),
            'view' => ViewMasterPart::route('/{record}'),
            'edit' => EditMasterPart::route('/{record}/edit'),
        ];
    }
}
