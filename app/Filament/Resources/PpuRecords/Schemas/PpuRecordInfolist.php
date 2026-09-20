<?php

namespace App\Filament\Resources\PpuRecords\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class PpuRecordInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('unit_no')
                    ->placeholder('-'),
                TextEntry::make('model')
                    ->placeholder('-'),
                TextEntry::make('track_group_used')
                    ->placeholder('-'),
                TextEntry::make('cts_date')
                    ->placeholder('-'),
                TextEntry::make('last_fitted_track_group')
                    ->placeholder('-'),
                TextEntry::make('pct_hours_track')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('hours_track_gp')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('smu')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('sprocket_lh')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('sprocket_rh')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('link_height_lh')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('link_height_rh')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('chain_bushing_lh')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('chain_bushing_rh')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('frame_ext_lh')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('frame_ext_rh')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('grouser_height_lh')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('grouser_height_rh')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('idler_front_lh')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('idler_front_rh')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('idler_rear_lh')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('idler_rear_rh')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('inspection_date')
                    ->placeholder('-'),
                TextEntry::make('inspector')
                    ->placeholder('-'),
                TextEntry::make('notes')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('status')
                    ->placeholder('-'),
                TextEntry::make('created_by')
                    ->placeholder('-'),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
