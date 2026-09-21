<?php

namespace App\Filament\Resources\MasterEquips\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class MasterEquipsTable
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
                TextColumn::make('unit_type')
                    ->label('Tipe')
                    ->badge()
                    ->color('gray')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('serial_no')
                    ->label('Serial Number')
                    ->fontFamily('mono')
                    ->placeholder('-')
                    ->toggleable(),
                TextColumn::make('location')
                    ->label('Lokasi')
                    ->placeholder('Site Plant')
                    ->toggleable(),
                TextColumn::make('last_hm')
                    ->label('Akumulasi HM')
                    ->numeric()
                    ->suffix(' Jam')
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->colors([
                        'success' => fn ($state) => in_array(strtoupper((string)$state), ['READY', 'RFU', 'OPERASI']),
                        'danger' => fn ($state) => in_array(strtoupper((string)$state), ['BREAKDOWN', 'BD', 'REPAIR']),
                        'warning' => fn ($state) => in_array(strtoupper((string)$state), ['STANDBY', 'MAINTENANCE']),
                    ]),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('unit_type')
                    ->label('Tipe Unit'),
                SelectFilter::make('status')
                    ->label('Status Unit')
                    ->options([
                        'READY' => 'READY / RFU',
                        'BREAKDOWN' => 'BREAKDOWN / BD',
                        'STANDBY' => 'STANDBY',
                        'MAINTENANCE' => 'MAINTENANCE',
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
