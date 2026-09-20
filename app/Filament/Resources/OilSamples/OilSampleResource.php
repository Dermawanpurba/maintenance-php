<?php

namespace App\Filament\Resources\OilSamples;

use App\Filament\Resources\OilSamples\Pages\CreateOilSample;
use App\Filament\Resources\OilSamples\Pages\EditOilSample;
use App\Filament\Resources\OilSamples\Pages\ListOilSamples;
use App\Filament\Resources\OilSamples\Pages\ViewOilSample;
use App\Filament\Resources\OilSamples\Schemas\OilSampleForm;
use App\Filament\Resources\OilSamples\Schemas\OilSampleInfolist;
use App\Filament\Resources\OilSamples\Tables\OilSamplesTable;
use App\Models\OilSample;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class OilSampleResource extends Resource
{
    protected static ?string $model = OilSample::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBeaker;

    protected static ?string $navigationLabel = 'SOS - Oil Samples';

    protected static string|\UnitEnum|null $navigationGroup = 'Scheduled Oil Sampling';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'sample_code';

    protected static ?string $modelLabel = 'Oil Sample';

    protected static ?string $pluralModelLabel = 'Oil Samples';

    public static function form(Schema $schema): Schema
    {
        return OilSampleForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return OilSampleInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OilSamplesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListOilSamples::route('/'),
            'create' => CreateOilSample::route('/create'),
            'view'   => ViewOilSample::route('/{record}'),
            'edit'   => EditOilSample::route('/{record}/edit'),
        ];
    }
}
