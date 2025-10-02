<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SertifikatKelulusan extends Model
{
    use HasFactory;

    protected $table = 'sertifikat_kelulusan';

    protected $fillable = [
        'user_id',
        'pendaftaran_sertifikasi_id',
        'pendaftaran_pkl_id',
        'jenis_program',
        'nama_program',
        'link_sertifikat',
        'tanggal_selesai',
        'catatan_admin',
        'diterbitkan_oleh',
    ];

    protected $casts = [
        'tanggal_selesai' => 'date',
    ];

    /**
     * Get the user who owns the certificate.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who issued the certificate.
     */
    public function penerbit(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diterbitkan_oleh');
    }

    /**
     * Get the sertifikasi registration if applicable.
     */
    public function pendaftaranSertifikasi(): BelongsTo
    {
        return $this->belongsTo(PendaftaranSertifikasi::class);
    }

    /**
     * Get the PKL registration if applicable.
     */
    public function pendaftaranPKL(): BelongsTo
    {
        return $this->belongsTo(PendaftaranPKL::class);
    }
}
