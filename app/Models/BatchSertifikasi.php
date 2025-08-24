<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BatchSertifikasi extends Model
{
    use HasFactory;

    protected $table = 'batch_sertifikasi';

    protected $fillable = [
        'sertifikasi_id',
        'nama_batch',
        'tanggal_mulai',
        'tanggal_selesai',
        'jumlah_pendaftar',
        'status',
        'instruktur',
        'catatan'
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'jumlah_pendaftar' => 'integer'
    ];

    public function sertifikasi()
    {
        return $this->belongsTo(Sertifikasi::class);
    }

    public function pendaftaran()
    {
        return $this->hasMany(PendaftaranSertifikasi::class, 'batch_id');
    }

    public function penilaian()
    {
        return $this->hasMany(PenilaianSertifikasi::class, 'batch_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'Aktif');
    }

    // Date formatting accessors for frontend
    public function getTanggalMulaiFormattedAttribute()
    {
        return $this->tanggal_mulai ? $this->tanggal_mulai->format('d/m/Y') : null;
    }

    public function getTanggalSelesaiFormattedAttribute()
    {
        return $this->tanggal_selesai ? $this->tanggal_selesai->format('d/m/Y') : null;
    }

}
