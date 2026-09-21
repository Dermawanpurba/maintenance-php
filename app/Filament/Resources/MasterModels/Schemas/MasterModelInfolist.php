<?php

namespace App\Filament\Resources\MasterModels\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class MasterModelInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                TextEntry::make('model_code')
                    ->label('Kode Model')
                    ->weight('bold')
                    ->color('primary')
                    ->copyable(),

                TextEntry::make('model_name')
                    ->label('Nama Lengkap Model')
                    ->weight('bold'),

                IconEntry::make('is_active')
                    ->label('Status Aktif')
                    ->boolean(),

                TextEntry::make('equipment_type')
                    ->label('Kategori Alat')
                    ->badge()
                    ->color('info')
                    ->placeholder('-'),

                TextEntry::make('unit_type_alias')
                    ->label('Alias Singkat')
                    ->badge()
                    ->color('gray')
                    ->placeholder('-'),

                TextEntry::make('manufacturer')
                    ->label('Pabrikan / Manufaktur')
                    ->placeholder('-'),

                TextEntry::make('aliases')
                    ->label('Daftar Alias Matching')
                    ->badge()
                    ->color('warning')
                    ->placeholder('Tidak ada alias terdaftar')
                    ->columnSpanFull(),

                TextEntry::make('equipments_count')
                    ->label('Jumlah Unit Terhubung')
                    ->state(fn ($record) => $record->equipments()->count())
                    ->badge()
                    ->color('success'),

                TextEntry::make('part_services_count')
                    ->label('Jumlah Item Part Service (BOM)')
                    ->state(fn ($record) => $record->partServices()->count())
                    ->badge()
                    ->color('warning'),

                TextEntry::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y H:i')
                    ->placeholder('-'),
            ]);
    }
}
