<?php

namespace App\Filament\Resources\OilSamples\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class OilSamplesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sample_code')
                    ->label('Kode Sampel')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('equip_no')
                    ->label('Unit')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('compartment')
                    ->label('Kompartemen')
                    ->searchable(),

                TextColumn::make('sample_date')
                    ->label('Tgl Sampel')
                    ->sortable(),

                TextColumn::make('hm')
                    ->label('HM')
                    ->numeric(decimalPlaces: 0)
                    ->sortable(),

                TextColumn::make('oil_grade')
                    ->label('Grade Oli')
                    ->searchable(),

                TextColumn::make('rating')
                    ->label('Rating')
                    ->badge()
                    ->color(fn ($state) => match ($state) {
                        'A' => 'success',
                        'B' => 'warning',
                        'C' => 'danger',
                        'X' => 'gray',
                        default => 'info',
                    }),

                TextColumn::make('fe')
                    ->label('Fe (ppm)')
                    ->numeric(decimalPlaces: 1)
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('cu')
                    ->label('Cu (ppm)')
                    ->numeric(decimalPlaces: 1)
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('si')
                    ->label('Si (ppm)')
                    ->numeric(decimalPlaces: 1)
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('visc_100')
                    ->label('Visk. 100°C')
                    ->numeric(decimalPlaces: 2)
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('tbn')
                    ->label('TBN')
                    ->numeric(decimalPlaces: 2)
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('water_pct')
                    ->label('Kadar Air (%)')
                    ->numeric(decimalPlaces: 2)
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('top_up')
                    ->label('Top Up (L)')
                    ->numeric(decimalPlaces: 1)
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn ($state) => match ($state) {
                        'APPROVED' => 'success',
                        'PENDING'  => 'warning',
                        'REVIEW'   => 'danger',
                        default    => 'gray',
                    }),

                TextColumn::make('lab_vendor')
                    ->label('Lab')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('created_by')
                    ->label('Dibuat oleh')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('equip_no')
                    ->label('Filter Unit Armada')
                    ->options(function () {
                        return \App\Models\MasterEquip::all()->mapWithKeys(function ($e) {
                            $no = $e->equip_no ?: ($e->no_unit ?: 'UNIT-' . $e->id);
                            return [$no => "{$no} (" . ($e->model ?: 'Unit') . ")"];
                        });
                    })
                    ->searchable(),

                SelectFilter::make('rating')
                    ->label('Rating Lab')
                    ->options([
                        'A' => 'A — Normal / Acceptable',
                        'B' => 'B — Caution / Monitor',
                        'C' => 'C — Critical',
                        'X' => 'X — Urgent Defect',
                    ]),

                SelectFilter::make('status')
                    ->label('Status Hasil')
                    ->options([
                        'APPROVED' => 'Approved',
                        'PENDING'  => 'Pending',
                        'REVIEW'   => 'Under Review',
                    ]),
            ])
            ->defaultSort('id', 'desc')
            ->recordActions([
                \Filament\Actions\Action::make('create_wo')
                    ->label('Buat WO')
                    ->icon(\Filament\Support\Icons\Heroicon::OutlinedWrench)
                    ->color('danger')
                    ->visible(fn ($record) => in_array(strtoupper($record->rating ?? 'A'), ['B', 'C', 'X']))
                    ->requiresConfirmation()
                    ->modalHeading('Terbitkan Work Order dari Temuan SOS')
                    ->modalDescription(fn ($record) => "Terbitkan WO perbaikan/flushing untuk unit {$record->equip_no} kompartemen {$record->compartment} (Rating {$record->rating})?")
                    ->action(function ($record) {
                        $noWo = 'WO-SOS-' . strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $record->equip_no)) . '-' . rand(100, 999);
                        \App\Models\WorkOrder::create([
                            'no_wo' => $noWo,
                            'equip_no' => $record->equip_no,
                            'unit_type' => 'Heavy Equipment',
                            'hm_km' => $record->hm,
                            'tgl_input' => now()->format('Y-m-d'),
                            'tgl_rusak' => now()->format('Y-m-d'),
                            'jam_rusak' => now()->format('H:i'),
                            'sch_unsch' => 'SCHEDULED',
                            'major_comp' => $record->compartment,
                            'kendala' => "[SOS Alert Rating {$record->rating}] " . ($record->interpretation ?: 'Hasil uji lab memerlukan tindak lanjut perbaikan.'),
                            'status' => 'OPEN',
                            'reported_by' => 'Caterpillar SOS Lab',
                        ]);

                        \Filament\Notifications\Notification::make()
                            ->title("Work Order {$noWo} Berhasil Diterbitkan")
                            ->success()
                            ->body("Data tersinkronisasi ke daftar Work Order & Backlog unit {$record->equip_no}.")
                            ->send();
                    }),

                \Filament\Actions\Action::make('sync_hm')
                    ->label('Sync HM')
                    ->icon(\Filament\Support\Icons\Heroicon::OutlinedArrowPath)
                    ->color('info')
                    ->action(function ($record) {
                        if (!empty($record->equip_no) && $record->hm > 0) {
                            $equip = \App\Models\MasterEquip::where('equip_no', $record->equip_no)->first();
                            if ($equip) {
                                $equip->update(['last_hm' => $record->hm]);
                            }
                            $target = \App\Models\TargetJamOperasi::where('equip_no', $record->equip_no)->first();
                            if ($target) {
                                $target->update(['est_hm' => $record->hm]);
                            }
                            \Filament\Notifications\Notification::make()
                                ->title("HM Unit {$record->equip_no} Berhasil Disinkronkan")
                                ->success()
                                ->body("Nilai HM {$record->hm} telah diperbarui pada Master Armada & Target Jam Operasi.")
                                ->send();
                        }
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
