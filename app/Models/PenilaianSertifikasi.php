<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PenilaianSertifikasi extends Model
{
    use HasFactory;

    protected $table = 'penilaian_sertifikasi';

    protected $fillable = [
        'pendaftaran_id',
        'sertifikasi_id',
        'batch_id',
        'status_kelulusan',
        'catatan_asesor',
        'tanggal_penilaian',
        'asesor_id'
    ];

    protected $casts = [
        'tanggal_penilaian' => 'date'
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(PendaftaranSertifikasi::class, 'pendaftaran_id');
    }

    public function sertifikasi()
    {
        return $this->belongsTo(Sertifikasi::class);
    }

    public function batch()
    {
        return $this->belongsTo(BatchSertifikasi::class, 'batch_id');
    }

    public function asesor()
    {
        return $this->belongsTo(User::class, 'asesor_id');
    }

    public function scopeDiterima($query)
    {
        return $query->where('status_kelulusan', 'Diterima');
    }

    public function scopeDitolak($query)
    {
        return $query->where('status_kelulusan', 'Ditolak');
    }

    // Grade removed: no numeric scoring anymore.
}
