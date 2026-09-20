<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class WorkOrder extends Model
{
    use HasFactory;

    protected $table = 'work_orders';
    protected $guarded = [];

    protected static function booted(): void
    {
        static::saving(function (WorkOrder $workOrder): void {
            $workOrder->status = strtoupper(trim((string) ($workOrder->status ?: 'OPEN')));

            if ($workOrder->status !== 'CLOSED') {
                return;
            }

            $requiredFields = [
                'action_log' => 'Action / tindakan perbaikan',
                'tgl_selesai' => 'Tanggal RFU',
                'jam_selesai' => 'Jam RFU',
                'tech' => 'Mekanik / PIC',
            ];

            $errors = [];
            foreach ($requiredFields as $field => $label) {
                if (blank($workOrder->{$field})) {
                    $errors[$field] = "{$label} wajib diisi sebelum WO ditutup.";
                }
            }

            if ($errors !== []) {
                throw ValidationException::withMessages($errors);
            }
        });

        static::saved(function (WorkOrder $workOrder): void {
            if (blank($workOrder->equip_no)) {
                return;
            }

            $unitStatus = match ($workOrder->status) {
                'CLOSED' => 'RFU',
                'BREAKDOWN' => 'B/D',
                default => 'RWN',
            };

            MasterEquip::where('equip_no', $workOrder->equip_no)
                ->update(['status' => $unitStatus]);
        });
    }
}
