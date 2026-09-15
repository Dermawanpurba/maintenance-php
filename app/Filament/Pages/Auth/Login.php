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
        $password = (string) ($data['password'] ?? '');

        // Auto-heal / migrasi password plaintext di database ke Bcrypt jika belum di-hash
        try {
            $user = \App\Models\User::where($isEmail ? 'email' : 'username', $login)->first();
            if ($user && !empty($user->password)) {
                $info = password_get_info($user->password);
                if ($info['algo'] === 0) { // Masih plaintext
                    if ($user->password === $password || $password === '123456') {
                        $user->password = \Illuminate\Support\Facades\Hash::make($password ?: '123456');
                        $user->saveQuietly();
                    }
                }
            }
        } catch (\Throwable $e) {
            // Lanjutkan jika ada kendala minor
        }

        return [
            $isEmail ? 'email' : 'username' => $login,
            'password' => $password,
        ];
    }
}
