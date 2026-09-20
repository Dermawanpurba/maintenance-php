<?php

namespace App\Filament\Resources\MonthlyBudgets\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class MonthlyBudgetsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('item_id')
                    ->label('ID Pos')
                    ->searchable(),
                TextColumn::make('category')
                    ->label('Kategori Anggaran')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('month_year')
                    ->label('Periode')
                    ->sortable(),
                TextColumn::make('budget_plan')
                    ->label('Plan (Rp)')
                    ->numeric()
                    ->money('IDR')
                    ->sortable(),
                TextColumn::make('actual_spent')
                    ->label('Actual (Rp)')
                    ->numeric()
                    ->money('IDR')
                    ->sortable(),
                TextColumn::make('variance')
                    ->label('Selisih (Rp)')
                    ->numeric()
                    ->money('IDR')
                    ->sortable(),
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
