<?php

namespace App\Filament\Resources\Backlogs\Pages;

use App\Filament\Resources\Backlogs\BacklogResource;
use Filament\Resources\Pages\CreateRecord;

class CreateBacklog extends CreateRecord
{
    protected static string $resource = BacklogResource::class;
}
