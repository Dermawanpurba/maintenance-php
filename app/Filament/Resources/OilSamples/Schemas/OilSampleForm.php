<?php

namespace App\Filament\Resources\OilSamples\Schemas;

use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class OilSampleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Identifikasi Sampel')
                    ->columns(3)
                    ->schema([
                        TextInput::make('item_id')
                            ->label('Item ID')
                            ->default(fn () => 'SOS-' . uniqid())
                            ->disabled()
                            ->dehydrated(),

                        TextInput::make('sample_code')
                            ->label('Kode Sampel (Lab)')
                            ->default(fn () => 'LAB-' . rand(10000, 99999))
                            ->required()
                            ->placeholder('LAB-9921'),

                        Select::make('equip_no')
                            ->label('No. Unit Armada')
                            ->options(function () {
                                return \App\Models\MasterEquip::all()->mapWithKeys(function ($e) {
                                    $no = $e->equip_no ?: ($e->no_unit ?: 'UNIT-' . $e->id);
                                    $model = $e->model ?: ($e->unit_type ?: 'Heavy Equip');
                                    return [$no => "{$no} — {$model}"];
                                });
                            })
                            ->searchable()
                            ->preload()
                            ->live()
                            ->afterStateUpdated(function ($state, callable $set) {
                                if ($state) {
                                    $equip = \App\Models\MasterEquip::where('equip_no', $state)->first();
                                    if ($equip && isset($equip->last_hm) && $equip->last_hm > 0) {
                                        $set('hm', $equip->last_hm);
                                    }
                                }
                            })
                            ->required(),

                        Select::make('compartment')
                            ->label('Kompartemen')
                            ->options(function () {
                                $comps = \App\Models\MasterComponent::pluck('nama_komponen', 'nama_komponen')->toArray();
                                $standards = [
                                    'Engine' => 'Engine',
                                    'Hydraulic System' => 'Hydraulic System',
                                    'Transmission' => 'Transmission',
                                    'Final Drive Right' => 'Final Drive Right',
                                    'Final Drive Left' => 'Final Drive Left',
                                    'Differential Front' => 'Differential Front',
                                    'Differential Rear' => 'Differential Rear',
                                    'Swing Machinery' => 'Swing Machinery',
                                    'Tandem Right' => 'Tandem Right',
                                    'Tandem Left' => 'Tandem Left',
                                    'Cooling System' => 'Cooling System',
                                ];
                                return array_merge($standards, $comps);
                            })
                            ->searchable()
                            ->default('Engine')
                            ->required(),

                        \Filament\Forms\Components\DatePicker::make('sample_date')
                            ->label('Tanggal Sampel')
                            ->default(now())
                            ->displayFormat('d-M-Y'),

                        TextInput::make('hm')
                            ->label('Hour Meter (HM)')
                            ->numeric()
                            ->default(0)
                            ->suffix('HM')
                            ->required(),

                        TextInput::make('oil_grade')
                            ->label('Grade Oli')
                            ->default('15W-40')
                            ->placeholder('15W-40, TELLUS 46, SAE 30'),

                        Select::make('rating')
                            ->label('Rating Laboratorium')
                            ->options([
                                'A' => 'A — Normal / Acceptable',
                                'B' => 'B — Caution / Monitor Closely',
                                'C' => 'C — Critical (Immediate Action)',
                                'X' => 'X — Urgent Defect / Action Required',
                            ])
                            ->default('A')
                            ->required(),

                        TextInput::make('top_up')
                            ->label('Top Up (Liter)')
                            ->numeric()
                            ->default(0)
                            ->suffix('L'),
                    ]),

                Section::make('Parameter Kontaminasi (ppm)')
                    ->columns(3)
                    ->schema([
                        TextInput::make('si')
                            ->label('Si - Silicon')
                            ->numeric()->default(0)->suffix('ppm'),

                        TextInput::make('al')
                            ->label('Al - Aluminum')
                            ->numeric()->default(0)->suffix('ppm'),

                        TextInput::make('na')
                            ->label('Na - Sodium')
                            ->numeric()->default(0)->suffix('ppm'),
                    ]),

                Section::make('Parameter Wear Metal (ppm)')
                    ->columns(3)
                    ->schema([
                        TextInput::make('fe')
                            ->label('Fe - Iron')
                            ->numeric()->default(0)->suffix('ppm'),

                        TextInput::make('cu')
                            ->label('Cu - Copper')
                            ->numeric()->default(0)->suffix('ppm'),

                        TextInput::make('cr')
                            ->label('Cr - Chromium')
                            ->numeric()->default(0)->suffix('ppm'),

                        TextInput::make('pb')
                            ->label('Pb - Lead')
                            ->numeric()->default(0)->suffix('ppm'),

                        TextInput::make('pq')
                            ->label('PQ - Particle Quantifier')
                            ->numeric()->default(0),
                    ]),

                Section::make('Uji Fisik')
                    ->columns(3)
                    ->schema([
                        TextInput::make('visc_100')
                            ->label('Viskositas @ 100°C')
                            ->numeric()->default(0)->suffix('cSt'),

                        TextInput::make('oxi')
                            ->label('Oksidasi')
                            ->numeric()->default(0),

                        TextInput::make('soot')
                            ->label('Soot (%)')
                            ->numeric()->default(0)->suffix('%'),

                        TextInput::make('tbn')
                            ->label('TBN')
                            ->numeric()->default(0),

                        TextInput::make('iso_6')
                            ->label('ISO 4406 > 6µm')
                            ->numeric()->default(0),

                        TextInput::make('iso_14')
                            ->label('ISO 4406 > 14µm')
                            ->numeric()->default(0),

                        TextInput::make('water_pct')
                            ->label('Kadar Air (%)')
                            ->numeric()->default(0)->suffix('%'),
                    ]),

                Section::make('Interpretasi & Metadata')
                    ->columns(3)
                    ->schema([
                        TextInput::make('lab_vendor')
                            ->label('Lab Vendor')
                            ->default('Caterpillar SOS Lab'),

                        Select::make('status')
                            ->label('Status')
                            ->options([
                                'APPROVED' => 'Approved',
                                'PENDING'  => 'Pending',
                                'REVIEW'   => 'Under Review',
                            ])
                            ->default('APPROVED'),

                        TextInput::make('created_by')
                            ->label('Dibuat oleh')
                            ->default('Planner SOS'),

                        Textarea::make('repair_notes')
                            ->label('Catatan Perbaikan')
                            ->columnSpanFull(),

                        Textarea::make('interpretation')
                            ->label('Interpretasi Diagnostik')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
