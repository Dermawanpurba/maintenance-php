<?php

namespace App\Filament\Resources\SystemLogs\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class SystemLogForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('timestamp')
                    ->columnSpanFull(),
                Textarea::make('action')
                    ->columnSpanFull(),
                Textarea::make('message')
                    ->columnSpanFull(),
                Textarea::make('user')
                    ->columnSpanFull(),
            ]);
    }
}
