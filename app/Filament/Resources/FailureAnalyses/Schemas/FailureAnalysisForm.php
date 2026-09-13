<?php

namespace App\Filament\Resources\FailureAnalyses\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class FailureAnalysisForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('item_id'),
                Textarea::make('tanggal')
                    ->columnSpanFull(),
                Textarea::make('equip_no')
                    ->columnSpanFull(),
                Textarea::make('component_name')
                    ->columnSpanFull(),
                Textarea::make('chronology')
                    ->columnSpanFull(),
                Textarea::make('five_why_json')
                    ->columnSpanFull(),
                Textarea::make('fishbone_json')
                    ->columnSpanFull(),
                Textarea::make('corrective_action')
                    ->columnSpanFull(),
                Textarea::make('preventive_action')
                    ->columnSpanFull(),
                Textarea::make('status')
                    ->columnSpanFull(),
                Textarea::make('lead_investigator')
                    ->columnSpanFull(),
            ]);
    }
}
