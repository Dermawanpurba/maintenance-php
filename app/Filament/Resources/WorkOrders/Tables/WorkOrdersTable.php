<?php

namespace App\Filament\Resources\WorkOrders\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class WorkOrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('no_wo')
                    ->label('No. WO')
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

                TextColumn::make('unit_type')
                    ->label('Tipe / Model')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('sch_unsch')
                    ->label('Klasifikasi')
                    ->badge()
                    ->color(fn (string $state): string => match (strtoupper($state)) {
                        'BREAKDOWN UNSCHEDULED', 'UNSCHEDULED', 'BUS' => 'danger',
                        'BREAKDOWN SCHEDULED', 'SCHEDULED', 'BS'       => 'info',
                        default                                         => 'gray',
                    }),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match (strtoupper($state)) {
                        'CLOSED'                    => 'success',
                        'OPEN'                      => 'danger',
                        'IN PROGRESS', 'PROGRESS'   => 'warning',
                        'WAITING PART'              => 'gray',
                        default                     => 'info',
                    }),

                TextColumn::make('kendala')
                    ->label('Kendala / Masalah')
                    ->limit(35)
                    ->tooltip(fn ($record): ?string => $record->kendala),

                TextColumn::make('tgl_rusak')
                    ->label('Tgl Breakdown')
                    ->date('d M Y')
                    ->sortable(),

                TextColumn::make('tech')
                    ->label('Mekanik / PIC')
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('tgl_rusak', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('Status WO')
                    ->options([
                        'OPEN'         => '🔴 OPEN',
                        'IN PROGRESS'  => '🟡 IN PROGRESS',
                        'WAITING PART' => '⚪ WAITING PART',
                        'CLOSED'       => '🟢 CLOSED',
                    ]),
                SelectFilter::make('sch_unsch')
                    ->label('Klasifikasi Breakdown')
                    ->options([
                        'BREAKDOWN SCHEDULED'   => 'Scheduled (BS)',
                        'BREAKDOWN UNSCHEDULED' => 'Unscheduled (BUS)',
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
