<?php

namespace App\Filament\Resources\MonthlyBudgets\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class MonthlyBudgetInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('item_id')
                    ->placeholder('-'),
                TextEntry::make('month_year')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('category')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('budget_plan')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('actual_spent')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('variance')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('status')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('notes')
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
