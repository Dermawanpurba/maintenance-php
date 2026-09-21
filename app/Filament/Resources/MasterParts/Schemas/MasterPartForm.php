<?php

namespace App\Filament\Resources\MasterParts\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class MasterPartForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('part_number')
                    ->label('Nomor Part / Kode')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->columnSpanFull(),

                TextInput::make('part_name')
                    ->label('Nama Suku Cadang')
                    ->required()
                    ->columnSpanFull(),

                Textarea::make('description')
                    ->label('Deskripsi Teknis')
                    ->rows(2)
                    ->columnSpanFull(),

                Select::make('uom')
                    ->label('Satuan (UOM)')
                    ->options([
                        'PCS'   => 'PCS — Pieces',
                        'LTR'   => 'LTR — Liter',
                        'SET'   => 'SET',
                        'BOTOL' => 'BOTOL',
                        'KG'    => 'KG — Kilogram',
                        'MTR'   => 'MTR — Meter',
                        'ROLL'  => 'ROLL',
                    ])
                    ->default('PCS')
                    ->searchable(),

                Select::make('category_spare_part')
                    ->label('Kategori')
                    ->options([
                        'Lubricant & Oil' => '🛢️ Lubricant & Oil',
                        'Filter'          => '🔵 Filter',
                        'Fast Moving'     => '⚡ Fast Moving',
                        'Slow Moving'     => '🐢 Slow Moving',
                        'Consumable'      => '♻️ Consumable',
                        'General'         => '📦 General',
                    ])
                    ->default('General')
                    ->searchable(),

                TextInput::make('stock')
                    ->label('Stok Aktual')
                    ->numeric()
                    ->default(0)
                    ->suffix(fn ($get) => $get('uom') ?: 'PCS'),

                TextInput::make('min_stock')
                    ->label('Minimum Reorder Point')
                    ->numeric()
                    ->default(0)
                    ->suffix(fn ($get) => $get('uom') ?: 'PCS'),

                TextInput::make('price')
                    ->label('Harga Satuan (Est.)')
                    ->numeric()
                    ->default(0)
                    ->prefix('Rp'),

                TextInput::make('bin_location')
                    ->label('Lokasi Gudang')
                    ->default('WH-A')
                    ->placeholder('e.g. WH-A, SHELF-3, WORKSHOP'),

                TextInput::make('qty_final')
                    ->label('Qty Final / Disesuaikan')
                    ->numeric()
                    ->default(0)
                    ->toggleable(isToggledHiddenByDefault: true),
            ]);
    }
}
