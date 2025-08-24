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
        'perusahaan',
    'kategori',
        'deskripsi',
        'persyaratan',
        'lokasi',
        'tipe',
        'durasi_bulan',
    'gaji',
        'jumlah_pendaftar',
        'status',
        'tanggal_mulai',
        'tanggal_selesai',
        'contact_person',
        'contact_email',
        'contact_phone',
        'created_by'
    ];

    protected $casts = [
        'gaji' => 'decimal:2',
    'durasi_bulan' => 'integer',
        'jumlah_pendaftar' => 'integer',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function pendaftaran()
    {
        return $this->hasMany(PendaftaranPKL::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'Aktif');
    }

    public function scopeByTipe($query, $tipe)
    {
        return $query->where('tipe', $tipe);
    }

    public function scopeByPerusahaan($query, $perusahaan)
    {
        return $query->where('perusahaan', 'like', '%' . $perusahaan . '%');
    }
}
