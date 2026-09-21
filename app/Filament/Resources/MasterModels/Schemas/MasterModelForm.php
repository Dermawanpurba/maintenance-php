<?php

namespace App\Filament\Resources\MasterModels\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class MasterModelForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('model_code')
                    ->label('Kode Model (Unik)')
                    ->placeholder('Contoh: CAT_320GX')
                    ->required()
                    ->unique(ignoreRecord: true),

                TextInput::make('model_name')
                    ->label('Nama Lengkap Model')
                    ->placeholder('Contoh: CAT 320 GX')
                    ->required(),

                Select::make('equipment_type')
                    ->label('Tipe Alat (Kategori)')
                    ->options([
                        'BULLDOZER'             => 'BULLDOZER',
                        'EXCAVATOR'             => 'EXCAVATOR',
                        'WHEEL LOADER'          => 'WHEEL LOADER',
                        'SKID STEER LOADER'     => 'SKID STEER LOADER',
                        'DUMP TRUCK'            => 'DUMP TRUCK',
                        'WATER TRUCK 20.000 KL' => 'WATER TRUCK',
                        'LUBE TRUCK'            => 'LUBE TRUCK',
                        'GENSET 40 KVA'         => 'GENSET',
                        'MOTOR GRADER'          => 'MOTOR GRADER',
                        'SUPPORT'               => 'SUPPORT',
                    ])
                    ->searchable(),

                TextInput::make('unit_type_alias')
                    ->label('Alias Singkat')
                    ->placeholder('Contoh: EXCA, DOZER, DT, LOADER'),

                TextInput::make('manufacturer')
                    ->label('Pabrikan / Manufaktur')
                    ->placeholder('Contoh: Caterpillar, Komatsu, SEM, Fuso'),

                Toggle::make('is_active')
                    ->label('Aktif')
                    ->default(true),

                TagsInput::make('aliases')
                    ->label('Daftar Alias / Varian Nama (Untuk Fallback Matching BOM)')
                    ->placeholder('Ketik varian nama lalu tekan Enter')
                    ->columnSpanFull(),
            ]);
    }
}
