<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LaporanMingguan extends Model
{
    use HasFactory;

    protected $table = 'laporan_mingguan';

    protected $fillable = [
        'pendaftaran_id',
        'submissionNumber',
        'submittedDate',
        'status',
        'jenisDocument',
        'submissionType',
        'isAssessed',
        'statusPenilaian',
        'feedback',
        'judulTugas',
        'deskripsiTugas',
        'linkSubmisi',
        'fileName',
        'fileSize',
        'fileType',
    ];

    protected $casts = [
        'isAssessed' => 'boolean',
        'submittedDate' => 'date',
    ];

    /**
     * Get the registration that owns the weekly report.
     */
    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(PendaftaranPKL::class, 'pendaftaran_id');
    }
}