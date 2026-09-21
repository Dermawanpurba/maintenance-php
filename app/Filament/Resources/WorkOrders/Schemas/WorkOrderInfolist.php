<?php

namespace App\Filament\Resources\WorkOrders\Schemas;

use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class WorkOrderInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                TextEntry::make('no_wo')
                    ->label('Nomor Work Order')
                    ->weight('bold')
                    ->color('primary')
                    ->copyable(),

                TextEntry::make('equip_no')
                    ->label('Nomor Unit')
                    ->badge()
                    ->color('gray'),

                TextEntry::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match (strtoupper($state)) {
                        'CLOSED'                    => 'success',
                        'OPEN'                      => 'danger',
                        'IN PROGRESS', 'PROGRESS'   => 'warning',
                        'WAITING PART'              => 'gray',
                        default                     => 'info',
                    }),

                TextEntry::make('brand')
                    ->label('Brand / Pabrikan')
                    ->placeholder('-'),

                TextEntry::make('unit_type')
                    ->label('Tipe / Model')
                    ->placeholder('-'),

                TextEntry::make('hm_km')
                    ->label('HM / KM Breakdown')
                    ->numeric()
                    ->placeholder('0'),

                TextEntry::make('sch_unsch')
                    ->label('Klasifikasi Kerusakan')
                    ->badge()
                    ->color(fn (string $state): string => match (strtoupper($state)) {
                        'BREAKDOWN UNSCHEDULED', 'UNSCHEDULED', 'BUS' => 'danger',
                        'BREAKDOWN SCHEDULED', 'SCHEDULED', 'BS'       => 'info',
                        default                                         => 'gray',
                    }),

                TextEntry::make('pm_service')
                    ->label('PM / Service Type')
                    ->placeholder('-'),

                TextEntry::make('reported_by')
                    ->label('Pelapor')
                    ->placeholder('-'),

                TextEntry::make('tgl_rusak')
                    ->label('Tgl Breakdown')
                    ->date('d M Y')
                    ->placeholder('-'),

                TextEntry::make('jam_rusak')
                    ->label('Jam Breakdown')
                    ->placeholder('-'),

                TextEntry::make('tech')
                    ->label('Mekanik / PIC')
                    ->placeholder('-'),

                TextEntry::make('tgl_selesai')
                    ->label('Tgl Selesai / RFU')
                    ->date('d M Y')
                    ->placeholder('-'),

                TextEntry::make('jam_selesai')
                    ->label('Jam Selesai / RFU')
                    ->placeholder('-'),

                TextEntry::make('pelanggan')
                    ->label('Pelanggan / Site')
                    ->placeholder('-'),

                TextEntry::make('major_comp')
                    ->label('Major Component')
                    ->badge()
                    ->color('warning')
                    ->placeholder('-'),

                TextEntry::make('minor_comp')
                    ->label('Minor Component')
                    ->placeholder('-'),

                TextEntry::make('kendala')
                    ->label('Deskripsi Kendala')
                    ->columnSpanFull()
                    ->placeholder('-'),

                TextEntry::make('failure_reason')
                    ->label('Analisa Penyebab Kerusakan')
                    ->columnSpanFull()
                    ->placeholder('-'),

                TextEntry::make('action_log')
                    ->label('Tindakan / Kronologis Perbaikan')
                    ->columnSpanFull()
                    ->placeholder('-'),

                // Suku Cadang Terpakai (P3.1)
                RepeatableEntry::make('parts')
                    ->label('Suku Cadang yang Digunakan (P3.1)')
                    ->columnSpanFull()
                    ->schema([
                        TextEntry::make('part_number')
                            ->label('Nomor Part')
                            ->weight('bold')
                            ->placeholder('-'),

                        TextEntry::make('part_name')
                            ->label('Nama Suku Cadang')
                            ->placeholder('-'),

                        TextEntry::make('qty_used')
                            ->label('Qty Digunakan')
                            ->formatStateUsing(fn ($state, $record) => ($state ?? 0) . ' ' . ($record->uom ?? 'PCS')),

                        TextEntry::make('unit_price')
                            ->label('Harga Satuan')
                            ->money('IDR', locale: 'id'),

                        TextEntry::make('total_price')
                            ->label('Total Biaya Part')
                            ->money('IDR', locale: 'id')
                            ->weight('bold')
                            ->color('success'),

                        TextEntry::make('stock_deducted')
                            ->label('Status Stok')
                            ->badge()
                            ->color(fn ($state) => $state ? 'success' : 'warning')
                            ->formatStateUsing(fn ($state) => $state ? 'Potong Stok' : 'Pending Potong'),
                    ])
                    ->columns(6),
            ]);
    }
}
