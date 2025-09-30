<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UploadDokumenPKL extends Model
{
    use HasFactory;

    protected $table = 'upload_dokumen_pkl';

    protected $fillable = [
        'pendaftaran_id',
        'user_id',
        'jenis_dokumen',
        'judul_tugas',
        'link_url',
        'file_name',
        'file_path',
        'file_size',
        'file_type',
        'status',
        'keterangan',
        'feedback',
        'assessor',
        'tanggal_upload',
        'tanggal_review',
    ];

    protected $casts = [
        'tanggal_upload' => 'datetime',
        'tanggal_review' => 'datetime',
    ];

    protected $dates = [
        'tanggal_upload',
        'tanggal_review',
        'created_at',
        'updated_at',
    ];

    /**
     * Get the pendaftaran that owns the upload dokumen.
     */
    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(PendaftaranPKL::class, 'pendaftaran_id');
    }

    /**
     * Get the user that owns the upload dokumen.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for filtering by status
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for filtering by jenis dokumen
     */
    public function scopeJenisDokumen($query, $jenis)
    {
        return $query->where('jenis_dokumen', $jenis);
    }

    /**
     * Get formatted file size
     */
    public function getFormattedFileSizeAttribute()
    {
        if (!$this->file_size || !is_numeric($this->file_size)) {
            return null;
        }

        $bytes = (float) $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes >= 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Get status badge color
     */
    public function getStatusBadgeColorAttribute()
    {
        return match($this->status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'approved' => 'bg-green-100 text-green-800',
            'rejected' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Get status text
     */
    public function getStatusTextAttribute()
    {
        return match($this->status) {
            'pending' => 'Menunggu Review',
            'approved' => 'Disetujui',
            'rejected' => 'Ditolak',
            default => 'Unknown',
        };
    }

    /**
     * Get jenis dokumen text
     */
    public function getJenisDokumenTextAttribute()
    {
        return match($this->jenis_dokumen) {
            'proposal' => 'Proposal PKL',
            'laporan-mingguan' => 'Laporan Mingguan',
            'laporan-akhir' => 'Laporan Akhir',
            'evaluasi' => 'Evaluasi',
            default => $this->jenis_dokumen,
        };
    }
}