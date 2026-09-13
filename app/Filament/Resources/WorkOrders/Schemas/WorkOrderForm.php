<?php

namespace App\Filament\Resources\WorkOrders\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class WorkOrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('no_wo')
                    ->columnSpanFull(),
                Textarea::make('equip_no')
                    ->columnSpanFull(),
                Textarea::make('brand')
                    ->columnSpanFull(),
                Textarea::make('unit_type')
                    ->columnSpanFull(),
                Textarea::make('hm_km')
                    ->columnSpanFull(),
                Textarea::make('tgl_input')
                    ->columnSpanFull(),
                Textarea::make('tgl_rusak')
                    ->columnSpanFull(),
                Textarea::make('jam_rusak')
                    ->columnSpanFull(),
                Textarea::make('tgl_selesai')
                    ->columnSpanFull(),
                Textarea::make('jam_selesai')
                    ->columnSpanFull(),
                Textarea::make('pelanggan')
                    ->columnSpanFull(),
                Textarea::make('pm_service')
                    ->columnSpanFull(),
                Textarea::make('major_comp')
                    ->columnSpanFull(),
                Textarea::make('minor_comp')
                    ->columnSpanFull(),
                Textarea::make('sch_unsch')
                    ->columnSpanFull(),
                Textarea::make('reported_by')
                    ->columnSpanFull(),
                Textarea::make('kendala')
                    ->columnSpanFull(),
                Textarea::make('failure_reason')
                    ->columnSpanFull(),
                Textarea::make('status')
                    ->columnSpanFull(),
                Textarea::make('parts_json')
                    ->columnSpanFull(),
                Textarea::make('tech')
                    ->columnSpanFull(),
                Textarea::make('action_log')
                    ->columnSpanFull(),
            ]);
    }
}
