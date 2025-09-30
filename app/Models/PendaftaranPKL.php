<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'motivasi',
        'catatan_admin',
        'tanggal_diproses',
        'berkas_persyaratan',
        'cv_file_path',
        'cv_file_name',
        'portfolio_file_path',
        'portfolio_file_name',
        
        // Data Diri Fields
        'nama_lengkap',
        'tempat_lahir',
        'tanggal_lahir',
        'email_pendaftar',
        'nomor_handphone',
        'alamat',
        'instagram',
        'tiktok',
        'memiliki_laptop',
        'memiliki_kamera_dslr',
        'transportasi_operasional',
        
        // Background Pendidikan Fields
        'asal_sekolah',
        'jurusan',
        'kelas',
        'awal_pkl',
        'akhir_pkl',
        
        // Skill & Minat Fields
        'kemampuan_ditingkatkan',
        'skill_kelebihan',
        'bidang_yang_disukai',
        'pernah_membuat_video',
        
        // Kebijakan & Finalisasi Fields
        'sudah_melihat_profil',
        'tingkat_motivasi',
        'nilai_diri',
        'apakah_merokok',
        'bersedia_ditempatkan',
        'bersedia_masuk_2_kali'
    ];

    protected $casts = [
        'tanggal_pendaftaran' => 'date',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'tanggal_lahir' => 'date',
        'awal_pkl' => 'date',
        'akhir_pkl' => 'date',
        'tanggal_diproses' => 'datetime',
        'semester' => 'integer',
        'ipk' => 'decimal:2',
        'tingkat_motivasi' => 'integer',
        'berkas_persyaratan' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function posisiPKL()
    {
        return $this->belongsTo(PosisiPKL::class, 'posisi_pkl_id');
    }

    public function penilaian()
    {
        return $this->hasOne(PenilaianPKL::class, 'pendaftaran_id');
    }

    public function laporanMingguan()
    {
        // DEPRECATED: Use uploadDokumen() instead
        // return $this->hasMany(LaporanMingguan::class, 'pendaftaran_id');
        return $this->uploadDokumen()->where('jenis_dokumen', 'laporan-mingguan');
    }

    public function submisi()
    {
        // DEPRECATED: Use uploadDokumen() instead
        // return $this->hasMany(UserDocument::class, 'pendaftaran_pkl_id')
        //             ->where('jenis_dokumen', 'submisi_pkl');
        return $this->uploadDokumen();
    }

    public function uploadDokumen()
    {
        return $this->hasMany(UploadDokumenPKL::class, 'pendaftaran_id');
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
