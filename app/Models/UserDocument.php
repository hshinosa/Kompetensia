<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class UserDocument extends Model
{
    use HasFactory;

    protected $table = 'dokumen_pengguna';

    protected $fillable = [
        'user_id',
        'jenis_dokumen',
        'nama_dokumen',
        'path_file',
        'ukuran_file',
        'tipe_mime',
        'terverifikasi',
        'aktif',
        'catatan',
        'tanggal_verifikasi',
        'diverifikasi_oleh',
        
        // Fields untuk PKL submissions
        'nomor_submisi',
        'tipe_submisi', // 'link' | 'dokumen'
        'kategori_submisi', // 'laporan' | 'tugas'
        'judul_tugas',
        'deskripsi_tugas',
        'link_submisi',
        'status_penilaian', // 'menunggu' | 'diterima' | 'ditolak'
        'feedback_pembimbing',
        'pendaftaran_pkl_id',
        'tanggal_submit'
    ];

    protected $casts = [
        'terverifikasi' => 'boolean',
        'aktif' => 'boolean',
        'tanggal_verifikasi' => 'datetime',
        'tanggal_submit' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relationships
    public function pengguna()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function diverifikasiOleh()
    {
        return $this->belongsTo(User::class, 'diverifikasi_oleh');
    }

    public function pendaftaranPKL()
    {
        return $this->belongsTo(PendaftaranPKL::class, 'pendaftaran_pkl_id');
    }

    // Scopes
    public function scopeBerdasarkanTipe($query, $tipe)
    {
        return $query->where('jenis_dokumen', $tipe);
    }

    public function scopeTerverifikasi($query)
    {
        return $query->where('terverifikasi', true);
    }

    public function scopeAktif($query)
    {
        return $query->where('aktif', true);
    }

    public function scopeBerdasarkanPengguna($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeSubmisiPKL($query)
    {
        return $query->where('jenis_dokumen', 'submisi_pkl');
    }

    public function scopeBerdasarkanPendaftaranPKL($query, $pklId)
    {
        return $query->where('pendaftaran_pkl_id', $pklId);
    }

    public function scopeMenungguPenilaian($query)
    {
        return $query->where('status_penilaian', 'menunggu');
    }

    public function scopeDiterima($query)
    {
        return $query->where('status_penilaian', 'diterima');
    }

    // Accessors
    public function getUrlFileAttribute()
    {
        return $this->path_file ? Storage::url($this->path_file) : null;
    }

    public function getUkuranFileFormatAttribute()
    {
        $ukuran = $this->ukuran_file;
        if (!$ukuran) {
            return 'Tidak diketahui';
        }
        
        $satuan = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $ukuran > 1024 && $i < count($satuan) - 1; $i++) {
            $ukuran /= 1024;
        }
        
        return round($ukuran, 2) . ' ' . $satuan[$i];
    }

    // Methods
    public function verifikasi($verifikatorId, $catatan = null)
    {
        return $this->update([
            'terverifikasi' => true,
            'diverifikasi_oleh' => $verifikatorId,
            'tanggal_verifikasi' => now(),
            'catatan' => $catatan
        ]);
    }

    public function tolak($verifikatorId, $catatan)
    {
        return $this->update([
            'terverifikasi' => false,
            'diverifikasi_oleh' => $verifikatorId,
            'tanggal_verifikasi' => now(),
            'catatan' => $catatan
        ]);
    }

    public function delete()
    {
        // Delete physical file
        if ($this->path_file && Storage::exists($this->path_file)) {
            Storage::delete($this->path_file);
        }
        
        return parent::delete();
    }
}
