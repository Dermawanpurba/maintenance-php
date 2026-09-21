<?php

namespace App\Filament\Resources\MasterModels\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class MasterModelsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('model_code')
                    ->label('Kode Model')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->weight('bold')
                    ->color('primary'),

                TextColumn::make('model_name')
                    ->label('Nama Model')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('equipment_type')
                    ->label('Kategori')
                    ->badge()
                    ->color('info')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('unit_type_alias')
                    ->label('Alias')
                    ->badge()
                    ->color('gray')
                    ->searchable(),

                TextColumn::make('manufacturer')
                    ->label('Pabrikan')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('equipments_count')
                    ->label('Unit Terhubung')
                    ->counts('equipments')
                    ->badge()
                    ->color('success')
                    ->sortable(),

                TextColumn::make('part_services_count')
                    ->label('Item BOM')
                    ->counts('partServices')
                    ->badge()
                    ->color('warning')
                    ->sortable(),

                IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),

                TextColumn::make('updated_at')
                    ->label('Update Terakhir')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('model_name')
            ->filters([
                SelectFilter::make('equipment_type')
                    ->label('Filter Kategori')
                    ->options([
                        'BULLDOZER'         => 'Bulldozer',
                        'EXCAVATOR'         => 'Excavator',
                        'WHEEL LOADER'      => 'Wheel Loader',
                        'SKID STEER LOADER' => 'Skid Steer Loader',
                        'DUMP TRUCK'        => 'Dump Truck',
                        'SUPPORT'           => 'Support',
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
            ]);
    }
}
