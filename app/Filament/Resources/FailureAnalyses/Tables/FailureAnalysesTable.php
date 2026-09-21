<?php

namespace App\Filament\Resources\FailureAnalyses\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class FailureAnalysesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('item_id')
                    ->label('No. FAR')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->weight('bold')
                    ->color('primary'),

                TextColumn::make('equip_no')
                    ->label('No. Unit')
                    ->searchable()
                    ->sortable()
                    ->badge()
                    ->color('gray'),

                TextColumn::make('no_wo')
                    ->label('Work Order (P4.2)')
                    ->badge()
                    ->color('primary')
                    ->placeholder('Tanpa WO')
                    ->searchable(),

                TextColumn::make('component_name')
                    ->label('Komponen')
                    ->searchable()
                    ->weight('bold'),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match (strtoupper($state)) {
                        'CLOSED'        => 'success',
                        'OPEN'          => 'danger',
                        'INVESTIGATING' => 'warning',
                        default         => 'gray',
                    })
                    ->sortable(),

                TextColumn::make('chronology')
                    ->label('Root Cause / Kronologi')
                    ->limit(35)
                    ->tooltip(fn ($record): ?string => $record->chronology),

                TextColumn::make('lead_investigator')
                    ->label('Investigator')
                    ->searchable(),

                TextColumn::make('tanggal')
                    ->label('Tgl Kejadian')
                    ->date('d M Y')
                    ->sortable(),
            ])
            ->defaultSort('tanggal', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('Filter Status')
                    ->options([
                        'OPEN'          => '🔴 OPEN',
                        'INVESTIGATING' => '🟡 INVESTIGATING',
                        'CLOSED'        => '🟢 CLOSED',
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
