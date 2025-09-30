<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UploadTugasSertifikasi extends Model
{
    use HasFactory;

    protected $table = 'upload_tugas_sertifikasi';

    protected $fillable = [
        'user_id',
        'sertifikasi_id',
        'pendaftaran_id',
        'judul_tugas',
        'link_url',
        'nama_file',
        'path_file',
        'ukuran_file',
        'tipe_mime',
        'status',
        'feedback',
        'dinilai_oleh',
        'tanggal_upload',
        'tanggal_penilaian',
    ];

    protected $casts = [
        'tanggal_upload' => 'datetime',
        'tanggal_penilaian' => 'datetime',
        'ukuran_file' => 'integer',
    ];

    /**
     * Get the user that owns the upload.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the sertifikasi that this upload belongs to.
     */
    public function sertifikasi(): BelongsTo
    {
        return $this->belongsTo(Sertifikasi::class);
    }

    /**
     * Get the pendaftaran that this upload belongs to.
     */
    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(PendaftaranSertifikasi::class, 'pendaftaran_id');
    }

    /**
     * Get the user who assessed this upload.
     */
    public function assessor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dinilai_oleh');
    }

    /**
     * Scope untuk filter berdasarkan status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope untuk filter pending uploads
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope untuk filter approved uploads
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope untuk filter rejected uploads
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Get file size in human readable format
     */
    public function getFileSizeFormattedAttribute()
    {
        if (!$this->ukuran_file || !is_numeric($this->ukuran_file)) {
            return null;
        }

        $bytes = (float) $this->ukuran_file;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes >= 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Get status badge class for display
     */
    public function getStatusBadgeClassAttribute()
    {
        return match($this->status) {
            'approved' => 'bg-green-100 text-green-800',
            'rejected' => 'bg-red-100 text-red-800',
            'pending' => 'bg-yellow-100 text-yellow-800',
            default => 'bg-gray-100 text-gray-800'
        };
    }

    /**
     * Get status display text
     */
    public function getStatusDisplayAttribute()
    {
        return match($this->status) {
            'approved' => 'Disetujui',
            'rejected' => 'Ditolak',
            'pending' => 'Menunggu Review',
            default => 'Unknown'
        };
    }
}