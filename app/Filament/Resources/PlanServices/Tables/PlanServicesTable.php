<?php

namespace App\Filament\Resources\PlanServices\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PlanServicesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('equip_no')
                    ->label('No. Unit')
                    ->badge()
                    ->color('primary')
                    ->fontFamily('mono')
                    ->weight('black')
                    ->searchable()
                    ->sortable()
                    ->url(fn ($record) => url("/admin/planning-part-service?unit={$record->equip_no}"))
                    ->tooltip('Klik untuk melihat Alokasi Unit Terjadwal pada Planning Part Service'),
                TextColumn::make('model')
                    ->label('Model Alat')
                    ->weight('bold')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('kategori')
                    ->label('Jenis Service')
                    ->badge()
                    ->color('info')
                    ->sortable(),
                TextColumn::make('last_service_hm')
                    ->label('HM Servis Terakhir')
                    ->numeric()
                    ->suffix(' Jam')
                    ->sortable(),
                TextColumn::make('next_service_hm')
                    ->label('HM Servis Berikutnya')
                    ->numeric()
                    ->suffix(' Jam')
                    ->color('warning')
                    ->weight('black')
                    ->sortable(),
                TextColumn::make('last_service_date')
                    ->label('Tgl Servis Terakhir')
                    ->fontFamily('mono')
                    ->placeholder('-')
                    ->sortable(),
                TextColumn::make('plan_hours_per_month')
                    ->label('Target Jam/Bulan')
                    ->numeric()
                    ->suffix(' Jam')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('kategori')
                    ->label('Jenis Service')
                    ->options([
                        'PS 250' => 'PS 250',
                        'PS 500' => 'PS 500',
                        'PS 1000' => 'PS 1000',
                        'PS 2000' => 'PS 2000',
                        'PS 4000' => 'PS 4000',
                    ]),
            ])
            ->recordActions([
                Action::make('planning_part_service')
                    ->label('Planning Part')
                    ->icon('heroicon-o-clipboard-document-list')
                    ->color('info')
                    ->url(fn ($record) => url("/admin/planning-part-service?unit={$record->equip_no}")),
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
