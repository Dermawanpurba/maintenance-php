<?php

namespace App\Filament\Resources\PpuRecords\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PpuRecordsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('unit_no')
                    ->searchable(),
                TextColumn::make('model')
                    ->searchable(),
                TextColumn::make('track_group_used')
                    ->searchable(),
                TextColumn::make('cts_date')
                    ->searchable(),
                TextColumn::make('last_fitted_track_group')
                    ->searchable(),
                TextColumn::make('pct_hours_track')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('hours_track_gp')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('smu')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('sprocket_lh')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('sprocket_rh')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('link_height_lh')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('link_height_rh')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('chain_bushing_lh')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('chain_bushing_rh')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('frame_ext_lh')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('frame_ext_rh')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('grouser_height_lh')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('grouser_height_rh')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('idler_front_lh')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('idler_front_rh')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('idler_rear_lh')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('idler_rear_rh')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('inspection_date')
                    ->searchable(),
                TextColumn::make('inspector')
                    ->searchable(),
                TextColumn::make('status')
                    ->searchable(),
                TextColumn::make('created_by')
                    ->searchable(),
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
                //
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
