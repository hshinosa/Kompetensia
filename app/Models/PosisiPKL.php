<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosisiPKL extends Model
{
    use HasFactory;

    protected $table = 'posisi_pkl';

    protected $fillable = [
        'nama_posisi',
        'kategori',
        'deskripsi',
        'persyaratan',
        'benefits',
        'tipe',
        'durasi_bulan',
        'jumlah_pendaftar',
        'status',
        'created_by'
    ];

    protected $casts = [
        'persyaratan' => 'array',
        'benefits' => 'array',
        'durasi_bulan' => 'integer',
        'jumlah_pendaftar' => 'integer',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function pendaftaran()
    {
        return $this->hasMany(PendaftaranPKL::class, 'posisi_pkl_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'Aktif');
    }

    public function scopeByTipe($query, $tipe)
    {
        return $query->where('tipe', $tipe);
    }
}
