<?php

namespace App\Filament\Resources\Stocks;

use App\Filament\Resources\MasterParts\MasterPartResource;
use App\Filament\Resources\Stocks\Pages\CreateStock;
use App\Filament\Resources\Stocks\Pages\EditStock;
use App\Filament\Resources\Stocks\Pages\ListStocks;
use App\Filament\Resources\Stocks\Pages\ViewStock;
use App\Filament\Resources\MasterParts\Schemas\MasterPartForm;
use App\Filament\Resources\MasterParts\Schemas\MasterPartInfolist;
use App\Filament\Resources\MasterParts\Tables\MasterPartsTable;
use App\Models\Stock;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

/**
 * StockResource — backward-compatible alias ke MasterPartResource.
 *
 * Setelah P2.1, model Stock redirect ke tabel master_parts.
 * Resource ini menggunakan form/table yang sama dengan MasterPartResource
 * agar tampilan konsisten. Menu Stocks tetap tersedia di sidebar untuk
 * kompatibilitas navigasi.
 *
 * @see MasterPartResource
 */
class StockResource extends Resource
{
    protected static ?string $model = Stock::class; // → redirected to master_parts

    protected static string|\BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;
    protected static \UnitEnum|string|null   $navigationGroup  = 'Master Data';
    protected static ?string $navigationLabel  = 'Stok Gudang';
    protected static ?int    $navigationSort   = 4;

    // Sembunyikan dari sidebar karena data kini sama dengan Master Part
    protected static bool $shouldRegisterNavigation = false;

    public static function form(Schema $schema): Schema
    {
        // Gunakan form yang sama dengan MasterPart
        return MasterPartForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return MasterPartInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        // Gunakan table yang sama dengan MasterPart
        return MasterPartsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListStocks::route('/'),
            'create' => CreateStock::route('/create'),
            'view'   => ViewStock::route('/{record}'),
            'edit'   => EditStock::route('/{record}/edit'),
        ];
    }
}
