<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PenilaianPKL extends Model
{
    use HasFactory;

    protected $table = 'penilaian_pkl';

    protected $fillable = [
        'pendaftaran_id',
        'posisi_pkl_id',
        'status_penilaian',
        'catatan_penilai',
        'tanggal_penilaian'
    ];

    protected $casts = [
        'tanggal_penilaian' => 'date'
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(PendaftaranPKL::class, 'pendaftaran_id');
    }

    public function posisiPKL()
    {
        return $this->belongsTo(PosisiPKL::class, 'posisi_pkl_id');
    }

    public function scopeDiterima($query)
    {
        return $query->where('status_penilaian', 'Diterima');
    }

    public function scopeDitolak($query)
    {
        return $query->where('status_penilaian', 'Ditolak');
    }

    public function scopeBelumDinilai($query)
    {
        return $query->where('status_penilaian', 'Belum Dinilai');
    }

    // Grade removed: no numeric scoring anymore.
}
