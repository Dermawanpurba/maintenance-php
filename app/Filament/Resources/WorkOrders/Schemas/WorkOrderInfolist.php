<?php

namespace App\Filament\Resources\WorkOrders\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class WorkOrderInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('no_wo')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('equip_no')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('brand')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('unit_type')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('hm_km')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('tgl_input')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('tgl_rusak')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('jam_rusak')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('tgl_selesai')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('jam_selesai')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('pelanggan')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('pm_service')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('major_comp')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('minor_comp')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('sch_unsch')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('reported_by')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('kendala')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('failure_reason')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('status')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('parts_json')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('tech')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('action_log')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
