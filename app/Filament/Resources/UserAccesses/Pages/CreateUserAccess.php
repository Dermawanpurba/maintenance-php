<?php

namespace App\Filament\Resources\UserAccesses\Pages;

use App\Filament\Resources\UserAccesses\UserAccessResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUserAccess extends CreateRecord
{
    protected static string $resource = UserAccessResource::class;
}
