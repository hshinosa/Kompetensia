<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PendaftaranPKL extends Model
{
    use HasFactory;

    protected $table = 'pendaftaran_pkl';

    protected $fillable = [
        'user_id',
        'posisi_pkl_id',
        'status',
        'tanggal_pendaftaran',
        'tanggal_mulai',
        'tanggal_selesai',
        'institusi_asal',
        'program_studi',
        'semester',
        'ipk',
        'motivasi',
        'catatan_admin',
        'tanggal_diproses',
        'berkas_persyaratan'
    ];

    protected $casts = [
        'tanggal_pendaftaran' => 'date',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'semester' => 'integer',
        'ipk' => 'decimal:2',
        'berkas_persyaratan' => 'array'
    ];

    public function pkl(): BelongsTo
    {
        return $this->belongsTo(PKL::class, 'pkl_id');
    }

    /**
     * Mendapatkan data user (peserta) yang terkait dengan pendaftaran ini.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function posisi(): BelongsTo
    {
        return $this->belongsTo(PosisiPKL::class, 'posisi_pkl_id');
    }

    /**
     * Mendapatkan data posisi PKL yang terkait dengan pendaftaran ini.
     */
    public function posisiPKL(): BelongsTo
    {
        return $this->belongsTo(PosisiPKL::class, 'posisi_pkl_id');
    }

    public function penilaian(): HasOne
    {
        return $this->hasOne(PenilaianPKL::class, 'pendaftaran_id');
    }

    public function laporanMingguan(): HasMany
    {
        return $this->hasMany(LaporanMingguan::class, 'pendaftaran_id');
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'Pengajuan');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'Disetujui');
    }
}
