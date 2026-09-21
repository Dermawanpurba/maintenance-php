<?php

namespace App\Filament\Resources\MasterParts\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class MasterPartsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('part_number')
                    ->label('No. Part')
                    ->fontFamily('mono')
                    ->weight('bold')
                    ->searchable()
                    ->sortable()
                    ->copyable(),

                TextColumn::make('part_name')
                    ->label('Nama Suku Cadang')
                    ->description(fn ($record) => $record->description)
                    ->searchable()
                    ->sortable()
                    ->wrap(),

                TextColumn::make('category_spare_part')
                    ->label('Kategori')
                    ->badge()
                    ->color(fn ($state) => match (true) {
                        str_contains(strtolower((string) $state), 'oil')    => 'info',
                        str_contains(strtolower((string) $state), 'filter') => 'warning',
                        str_contains(strtolower((string) $state), 'fast')   => 'success',
                        default => 'gray',
                    })
                    ->sortable(),

                TextColumn::make('uom')
                    ->label('Satuan')
                    ->badge()
                    ->color('gray'),

                TextColumn::make('stock')
                    ->label('Stok Aktual')
                    ->numeric()
                    ->sortable()
                    ->color(fn ($record) => ($record->stock ?? 0) < ($record->min_stock ?? 0) ? 'danger' : 'success')
                    ->weight('black'),

                TextColumn::make('min_stock')
                    ->label('Min. Stok')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('price')
                    ->label('Harga Satuan')
                    ->money('IDR')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('bin_location')
                    ->label('Lokasi Gudang')
                    ->badge()
                    ->color('gray')
                    ->placeholder('-'),

                TextColumn::make('stock_status')
                    ->label('Status Stok')
                    ->badge()
                    ->color(fn ($state) => match ($state) {
                        'HABIS'  => 'danger',
                        'KRITIS' => 'danger',
                        'RENDAH' => 'warning',
                        'AMAN'   => 'success',
                        default  => 'gray',
                    })
                    ->getStateUsing(fn ($record) => $record->stock_status),

                TextColumn::make('updated_at')
                    ->label('Diupdate')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('category_spare_part')
                    ->label('Kategori')
                    ->options([
                        'Lubricant & Oil' => 'Lubricant & Oil',
                        'Filter'          => 'Filter',
                        'Fast Moving'     => 'Fast Moving',
                        'Slow Moving'     => 'Slow Moving',
                        'Consumable'      => 'Consumable',
                        'General'         => 'General',
                    ]),
                SelectFilter::make('uom')
                    ->label('Satuan')
                    ->options([
                        'PCS'   => 'PCS',
                        'LTR'   => 'Liter',
                        'SET'   => 'SET',
                        'BOTOL' => 'BOTOL',
                        'KG'    => 'KG',
                    ]),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('part_name');
    }
}
