<?php

namespace App\Filament\Resources\TargetJamOperasis\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TargetJamOperasisTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('est_hm')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('next_service_hours_due')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('next_service_type_hm')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('pm_250')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('pm_500')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('pm_1000')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('pm_2000')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('pm_other')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('ba_gg')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('oil_fe')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('pos')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('plan_year')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('plan_month')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('next_service_hours_due_2')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('pm_4000')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('downtime_pm')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('downtime_backlog')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('downtime_midlife')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('downtime_pcr')
                    ->numeric()
                    ->sortable(),
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
