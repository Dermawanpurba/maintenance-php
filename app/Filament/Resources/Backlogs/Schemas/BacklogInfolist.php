<?php

namespace App\Filament\Resources\Backlogs\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class BacklogInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                TextEntry::make('item_id')
                    ->label('ID Backlog')
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
                        default                     => 'gray',
                    }),

                TextEntry::make('priority')
                    ->label('Prioritas')
                    ->badge()
                    ->color(fn (?string $state): string => match (strtoupper($state ?? 'MEDIUM')) {
                        'HIGH', 'CRITICAL' => 'danger',
                        'MEDIUM'           => 'warning',
                        default            => 'info',
                    }),

                TextEntry::make('no_wo')
                    ->label('Work Order Tertaut (P4.1)')
                    ->badge()
                    ->color('primary')
                    ->placeholder('Belum ada WO yang diterbitkan'),

                TextEntry::make('est_hours')
                    ->label('Estimasi Jam Kerja')
                    ->suffix(' Jam')
                    ->numeric(),

                TextEntry::make('tanggal')
                    ->label('Tanggal Temuan')
                    ->date('d M Y')
                    ->placeholder('-'),

                TextEntry::make('closed_at')
                    ->label('Tanggal Selesai / Ditutup')
                    ->dateTime('d M Y H:i')
                    ->placeholder('Masih berstatus OPEN / IN PROGRESS'),

                TextEntry::make('created_at')
                    ->label('Waktu Dicatat')
                    ->dateTime('d M Y H:i')
                    ->placeholder('-'),

                TextEntry::make('deskripsi_backlog')
                    ->label('Deskripsi Temuan Kerusakan')
                    ->columnSpanFull()
                    ->placeholder('-'),

                TextEntry::make('rencana_eksekusi')
                    ->label('Rencana Tindakan & Kebutuhan Suku Cadang')
                    ->columnSpanFull()
                    ->placeholder('-'),
            ]);
    }
}
