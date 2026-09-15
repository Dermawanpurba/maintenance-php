<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'app_users';
    protected $guarded = [];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /**
     * Tentukan apakah pengguna dapat mengakses Filament Admin Panel.
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return true;
    }

    public function getNameAttribute()
    {
        return $this->nama ?: $this->username;
    }

    public function getEmailAttribute()
    {
        return $this->attributes['email'] ?? ($this->username ? $this->username . '@wosys.local' : 'user@wosys.local');
    }
}
