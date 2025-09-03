<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Asesor extends Model
{
    protected $fillable = [
        'nama_asesor',
        'jabatan_asesor',
        'instansi_asesor',
        'foto_asesor',
        'status',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'status' => 'string'
    ];

    /**
     * Relasi ke tabel sertifikasi
     */
    public function sertifikasi(): HasMany
    {
        return $this->hasMany(Sertifikasi::class);
    }

    /**
     * Relasi ke user yang membuat
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relasi ke user yang mengupdate
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Accessor untuk URL foto asesor
     */
    public function getFotoAsesorUrlAttribute(): ?string
    {
        return $this->foto_asesor ? asset('storage/' . $this->foto_asesor) : null;
    }

    /**
     * Scope untuk asesor aktif
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'Aktif');
    }
}
