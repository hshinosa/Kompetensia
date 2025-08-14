<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PKL extends Model
{
    use HasFactory;

    protected $table = 'pkl';

    // Enum constants
    const KATEGORI_OPTIONS = ['Developer', 'Kreatif', 'Marketing', 'Data Analyst', 'Quality Assurance', 'Lainnya'];
    const TIPE_KERJA_OPTIONS = ['Full-time', 'Part-time', 'Remote', 'Hybrid'];
    const DURASI_OPTIONS = ['1 Bulan', '2 Bulan', '3 Bulan', '4 Bulan', '5 Bulan', '6 Bulan'];
    const STATUS_OPTIONS = ['Draft', 'Aktif', 'Selesai', 'Ditutup'];

    protected $fillable = [
        'nama_program',
        'kategori',
        'posisi',
        'tipe_kerja',
        'deskripsi',
        'durasi',
        'peserta_terdaftar',
        'status',
        'persyaratan',
        'benefit'
    ];

    protected $casts = [
        'peserta_terdaftar' => 'integer',
        'persyaratan' => 'array',
        'benefit' => 'array'
    ];

    public function pendaftaran()
    {
        return $this->hasMany(PendaftaranPKL::class, 'pkl_id');
    }

    public function penilaian()
    {
        return $this->hasMany(PenilaianPKL::class, 'pkl_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'Aktif');
    }

    public function scopeByKategori($query, $kategori)
    {
        return $query->where('kategori', $kategori);
    }

    public function scopeByTipeKerja($query, $tipeKerja)
    {
        return $query->where('tipe_kerja', $tipeKerja);
    }

    public function scopeByDurasi($query, $durasi)
    {
        return $query->where('durasi', $durasi);
    }

    // Kuota logic removed
}
