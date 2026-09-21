<?php

namespace App\Filament\Resources\Backlogs\Tables;

use App\Models\Backlog;
use App\Models\WorkOrder;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class BacklogsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('item_id')
                    ->label('ID Backlog')
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

                TextColumn::make('priority')
                    ->label('Prioritas')
                    ->badge()
                    ->color(fn (?string $state): string => match (strtoupper($state ?? 'MEDIUM')) {
                        'HIGH', 'CRITICAL' => 'danger',
                        'MEDIUM'           => 'warning',
                        default            => 'info',
                    })
                    ->sortable(),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match (strtoupper($state)) {
                        'CLOSED'                    => 'success',
                        'OPEN'                      => 'danger',
                        'IN PROGRESS', 'PROGRESS'   => 'warning',
                        default                     => 'gray',
                    })
                    ->sortable(),

                TextColumn::make('deskripsi_backlog')
                    ->label('Deskripsi Temuan')
                    ->limit(40)
                    ->tooltip(fn ($record): ?string => $record->deskripsi_backlog),

                TextColumn::make('no_wo')
                    ->label('Tautan Work Order (P4.1)')
                    ->badge()
                    ->color('primary')
                    ->placeholder('Belum ada WO')
                    ->searchable(),

                TextColumn::make('est_hours')
                    ->label('Est. Jam')
                    ->numeric()
                    ->suffix(' Jam')
                    ->sortable(),

                TextColumn::make('tanggal')
                    ->label('Tgl Temuan')
                    ->date('d M Y')
                    ->sortable(),

                TextColumn::make('closed_at')
                    ->label('Tgl Ditutup')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('tanggal', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('Filter Status')
                    ->options([
                        'OPEN'        => '🔴 OPEN',
                        'IN PROGRESS' => '🟡 IN PROGRESS',
                        'CLOSED'      => '🟢 CLOSED',
                    ]),
                SelectFilter::make('priority')
                    ->label('Filter Prioritas')
                    ->options([
                        'HIGH'   => '🔴 High',
                        'MEDIUM' => '🟡 Medium',
                        'LOW'    => '🔵 Low',
                    ]),
            ])
            ->recordActions([
                Action::make('generate_wo')
                    ->label('Buat WO')
                    ->icon('heroicon-o-wrench')
                    ->color('warning')
                    ->visible(fn (Backlog $record) => $record->status !== 'CLOSED' && empty($record->no_wo))
                    ->requiresConfirmation()
                    ->modalHeading('Terbitkan Work Order dari Backlog')
                    ->modalDescription(fn (Backlog $record) => "Terbitkan Work Order baru untuk unit {$record->equip_no} berdasarkan temuan ini?")
                    ->modalSubmitActionLabel('Ya, Terbitkan WO')
                    ->action(function (Backlog $record): void {
                        $noWo = 'WO-' . date('Ymd-His');

                        WorkOrder::create([
                            'no_wo'          => $noWo,
                            'equip_no'       => $record->equip_no,
                            'tgl_rusak'      => $record->tanggal ?: date('Y-m-d'),
                            'jam_rusak'      => date('H:i'),
                            'kendala'        => $record->deskripsi_backlog,
                            'action_log'     => $record->rencana_eksekusi,
                            'sch_unsch'      => 'BREAKDOWN SCHEDULED',
                            'status'         => 'OPEN',
                            'backlog_id'     => $record->item_id,
                            'reported_by'    => 'Backlog System',
                        ]);

                        $record->update([
                            'no_wo'  => $noWo,
                            'status' => 'IN PROGRESS',
                        ]);

                        Notification::make()
                            ->title("Work Order {$noWo} Berhasil Dibuat")
                            ->body("Backlog {$record->item_id} telah ditautkan ke Work Order {$noWo}.")
                            ->success()
                            ->send();
                    }),
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
