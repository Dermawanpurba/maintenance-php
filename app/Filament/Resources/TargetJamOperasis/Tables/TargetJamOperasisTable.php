<?php

namespace App\Filament\Resources\TargetJamOperasis\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class TargetJamOperasisTable
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
                    ->url(fn ($record) => url("/admin/planning-part-service?unit={$record->equip_no}&year={$record->plan_year}&month={$record->plan_month}"))
                    ->tooltip('Buka kalkulasi kebutuhan part service untuk unit ini'),
                TextColumn::make('model')
                    ->label('Model Alat')
                    ->weight('bold')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('section')
                    ->label('Section')
                    ->badge()
                    ->color('gray')
                    ->sortable(),
                TextColumn::make('plan_year')
                    ->label('Tahun')
                    ->alignCenter()
                    ->sortable(),
                TextColumn::make('plan_month')
                    ->label('Bulan')
                    ->alignCenter()
                    ->sortable(),
                TextColumn::make('est_hm')
                    ->label('Est HM')
                    ->numeric()
                    ->suffix(' Jam')
                    ->sortable(),
                TextColumn::make('next_service_hours_due')
                    ->label('Due HM')
                    ->numeric()
                    ->suffix(' Jam')
                    ->color('warning')
                    ->weight('bold')
                    ->sortable(),
                TextColumn::make('next_service_type')
                    ->label('Next PM')
                    ->badge()
                    ->color('info')
                    ->placeholder('-'),
                TextColumn::make('pm_250')
                    ->label('250')
                    ->alignCenter()
                    ->placeholder('-')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('pm_500')
                    ->label('500')
                    ->alignCenter()
                    ->placeholder('-')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('pm_1000')
                    ->label('1000')
                    ->alignCenter()
                    ->placeholder('-')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('pm_2000')
                    ->label('2000')
                    ->alignCenter()
                    ->placeholder('-')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('pm_4000')
                    ->label('4000')
                    ->alignCenter()
                    ->placeholder('-')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('plan_year')
                    ->label('Tahun')
                    ->options([
                        2024 => '2024',
                        2025 => '2025',
                        2026 => '2026',
                        2027 => '2027',
                    ]),
                SelectFilter::make('plan_month')
                    ->label('Bulan')
                    ->options([
                        1 => '1 - Januari',
                        2 => '2 - Februari',
                        3 => '3 - Maret',
                        4 => '4 - April',
                        5 => '5 - Mei',
                        6 => '6 - Juni',
                        7 => '7 - Juli',
                        8 => '8 - Agustus',
                        9 => '9 - September',
                        10 => '10 - Oktober',
                        11 => '11 - November',
                        12 => '12 - Desember',
                    ]),
                SelectFilter::make('section')
                    ->label('Section')
                    ->options([
                        'EXCAVATOR' => 'EXCAVATOR',
                        'DUMP TRUCK' => 'DUMP TRUCK',
                        'BULLDOZER' => 'BULLDOZER',
                        'MOTOR GRADER' => 'MOTOR GRADER',
                        'WHEEL LOADER' => 'WHEEL LOADER',
                        'SUPPORT' => 'SUPPORT',
                    ]),
            ])
            ->recordActions([
                Action::make('planning_part_service')
                    ->label('Planning Part')
                    ->icon('heroicon-o-clipboard-document-list')
                    ->color('info')
                    ->url(fn ($record) => url("/admin/planning-part-service?unit={$record->equip_no}&year={$record->plan_year}&month={$record->plan_month}")),
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
