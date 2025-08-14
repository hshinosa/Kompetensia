<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModulSertifikasi extends Model
{
    use HasFactory;

    protected $table = 'modul_sertifikasi';

    protected $fillable = [
        'sertifikasi_id',
        'judul',
        'deskripsi',
        'poin_pembelajaran',
        'urutan'
    ];

    protected $casts = [
        'poin_pembelajaran' => 'array',
        'urutan' => 'integer'
    ];

    public function sertifikasi()
    {
        return $this->belongsTo(Sertifikasi::class);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan');
    }
}
