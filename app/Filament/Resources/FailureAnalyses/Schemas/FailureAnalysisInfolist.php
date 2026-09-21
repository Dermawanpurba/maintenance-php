<?php

namespace App\Filament\Resources\FailureAnalyses\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class FailureAnalysisInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                TextEntry::make('item_id')
                    ->label('Nomor FAR')
                    ->weight('bold')
                    ->color('primary')
                    ->copyable(),

                TextEntry::make('equip_no')
                    ->label('Nomor Unit')
                    ->badge()
                    ->color('gray'),

                TextEntry::make('status')
                    ->label('Status Analisa')
                    ->badge()
                    ->color(fn (string $state): string => match (strtoupper($state)) {
                        'CLOSED'        => 'success',
                        'OPEN'          => 'danger',
                        'INVESTIGATING' => 'warning',
                        default         => 'gray',
                    }),

                TextEntry::make('no_wo')
                    ->label('Work Order Kejadian (P4.2)')
                    ->badge()
                    ->color('primary')
                    ->placeholder('Tanpa tautan WO'),

                TextEntry::make('component_name')
                    ->label('Komponen Gagal')
                    ->weight('bold'),

                TextEntry::make('lead_investigator')
                    ->label('Lead Investigator')
                    ->placeholder('-'),

                TextEntry::make('tanggal')
                    ->label('Tanggal Kejadian')
                    ->date('d M Y')
                    ->placeholder('-'),

                TextEntry::make('created_at')
                    ->label('Tanggal Laporan Dibuat')
                    ->dateTime('d M Y H:i')
                    ->placeholder('-'),

                TextEntry::make('chronology')
                    ->label('Kronologi Insiden & Indikasi Awal')
                    ->columnSpanFull()
                    ->placeholder('-'),

                TextEntry::make('corrective_action')
                    ->label('Tindakan Korektif Langsung')
                    ->columnSpanFull()
                    ->placeholder('-'),

                TextEntry::make('preventive_action')
                    ->label('Tindakan Pencegahan (Agar Tidak Terulang)')
                    ->columnSpanFull()
                    ->placeholder('-'),
            ]);
    }
}
