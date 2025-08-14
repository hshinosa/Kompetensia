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
        'pkl_id',
        'status_kelulusan',
        'catatan_pembimbing',
        'tanggal_penilaian',
        'pembimbing_id'
    ];

    protected $casts = [
        'tanggal_penilaian' => 'date'
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(PendaftaranPKL::class, 'pendaftaran_id');
    }

    public function pkl()
    {
        return $this->belongsTo(PKL::class);
    }

    public function pembimbing()
    {
        return $this->belongsTo(User::class, 'pembimbing_id');
    }

    public function scopeLulus($query)
    {
        return $query->where('status_kelulusan', 'Lulus');
    }

    public function scopeTidakLulus($query)
    {
        return $query->where('status_kelulusan', 'Tidak Lulus');
    }

    // Grade removed: no numeric scoring anymore.
}
