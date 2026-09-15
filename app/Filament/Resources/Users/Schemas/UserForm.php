<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('username')
                    ->label('Username')
                    ->required()
                    ->maxLength(50),

                TextInput::make('nama')
                    ->label('Nama Lengkap')
                    ->required()
                    ->maxLength(100),

                TextInput::make('password')
                    ->label('Password')
                    ->password()
                    ->revealable()
                    ->dehydrated(fn ($state) => filled($state))
                    ->required(fn (string $operation): bool => $operation === 'create')
                    ->helperText('Kosongkan jika tidak ingin mengubah password saat edit.'),

                Select::make('role')
                    ->label('Peran / Hak Akses')
                    ->options([
                        'admin' => 'Admin ERP',
                        'planner' => 'Planner Maintenance',
                        'mekanik' => 'Tim Mekanik',
                        'boss' => 'Management / Boss',
                        'direksi' => 'Direksi',
                    ])
                    ->required(),

                Select::make('status')
                    ->label('Status Akun')
                    ->options([
                        'active' => 'Aktif',
                        'inactive' => 'Nonaktif',
                    ])
                    ->default('active')
                    ->required(),
            ]);
    }
}
