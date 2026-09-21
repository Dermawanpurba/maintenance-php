<?php

namespace App\Filament\Resources\PartServices\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PartServicesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('equipment')
                    ->label('EQUIPMENT')
                    ->badge()
                    ->color('primary')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('model')
                    ->label('MODEL')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('part_name')
                    ->label('PART NAME')
                    ->weight('bold')
                    ->searchable()
                    ->sortable()
                    ->wrap(),
                TextColumn::make('part_number')
                    ->label('PART NUMBER')
                    ->fontFamily('mono')
                    ->searchable()
                    ->copyable()
                    ->sortable(),
                TextColumn::make('ps_250')
                    ->label('250')
                    ->alignCenter()
                    ->placeholder('-')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('ps_500')
                    ->label('500')
                    ->alignCenter()
                    ->placeholder('-')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('ps_1000')
                    ->label('1000')
                    ->alignCenter()
                    ->placeholder('-')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('ps_2000')
                    ->label('2000')
                    ->alignCenter()
                    ->placeholder('-')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('ps_4000')
                    ->label('4000')
                    ->alignCenter()
                    ->placeholder('-')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('category')
                    ->label('CATEGORY')
                    ->badge()
                    ->color('gray')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('equipment')
                    ->options([
                        'DUMP TRUCK' => 'DUMP TRUCK',
                        'DUMP TRUCK 10 RODA' => 'DUMP TRUCK 10 RODA',
                        'EXCAVATOR' => 'EXCAVATOR',
                        'BULLDOZER' => 'BULLDOZER',
                        'WHEEL LOADER' => 'WHEEL LOADER',
                        'WATER TRUCK 20.000 KL' => 'WATER TRUCK 20.000 KL',
                    ]),
                SelectFilter::make('category')
                    ->options([
                        'Lubricant & Oil' => 'Lubricant & Oil',
                        'Filter' => 'Filter',
                        'Belt & Drive' => 'Belt & Drive',
                        'Engine Parts' => 'Engine Parts',
                        'Consumable & Lab' => 'Consumable & Lab',
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
