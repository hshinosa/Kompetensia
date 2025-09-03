<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sertifikasi extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sertifikasi';

    protected $fillable = [
        'nama_sertifikasi',
        'jenis_sertifikasi',
        'deskripsi',
        'thumbnail',
        'asesor_id',
        'tipe_sertifikat',
        'status',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'kapasitas_peserta' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
        'tipe_sertifikat' => 'array'
    ];

    public function modul()
    {
        return $this->hasMany(ModulSertifikasi::class);
    }

    public function batch()
    {
        return $this->hasMany(BatchSertifikasi::class);
    }

    public function pendaftaran()
    {
        return $this->hasMany(PendaftaranSertifikasi::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Relasi ke tabel asesor
     */
    public function asesor()
    {
        return $this->belongsTo(Asesor::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'Aktif');
    }

    public function scopeByJenis($query, $jenis)
    {
        return $query->where('jenis_sertifikasi', $jenis);
    }

    public function getThumbnailUrlAttribute()
    {
        return $this->thumbnail ? asset('storage/' . $this->thumbnail) : null;
    }

    /**
     * Generate slug from nama_sertifikasi
     */
    public function getSlugAttribute()
    {
        return \Illuminate\Support\Str::slug($this->nama_sertifikasi);
    }

    /**
     * Find sertifikasi by slug
     */
    public static function findBySlug($slug)
    {
        return static::active()->get()->firstWhere('slug', $slug);
    }
}
