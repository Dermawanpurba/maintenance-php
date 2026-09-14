<?php

namespace App\Filament\Pages\Auth;

use Filament\Auth\Pages\Login as BaseLogin;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Component;

class Login extends BaseLogin
{
    protected function getEmailFormComponent(): Component
    {
        return TextInput::make('email')
            ->label('Username atau Alamat Email')
            ->required()
            ->autocomplete()
            ->autofocus();
    }

    protected function getCredentialsFromFormData(array $data): array
    {
        $login = trim($data['email'] ?? '');
        $isEmail = filter_var($login, FILTER_VALIDATE_EMAIL);

        return [
            $isEmail ? 'email' : 'username' => $login,
            'password' => $data['password'] ?? '',
        ];
    }
}
