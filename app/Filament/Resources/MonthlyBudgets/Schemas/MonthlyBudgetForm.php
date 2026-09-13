<?php

namespace App\Filament\Resources\MonthlyBudgets\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class MonthlyBudgetForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('item_id'),
                TextInput::make('month_year')
                    ->numeric()
                    ->default(0),
                Textarea::make('category')
                    ->columnSpanFull(),
                TextInput::make('budget_plan')
                    ->numeric()
                    ->default(0),
                TextInput::make('actual_spent')
                    ->numeric()
                    ->default(0),
                TextInput::make('variance')
                    ->numeric()
                    ->default(0),
                Textarea::make('status')
                    ->columnSpanFull(),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }
}
