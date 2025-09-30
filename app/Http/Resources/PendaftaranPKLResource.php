<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class PendaftaranPKLResource extends JsonResource
{
    /**
     * Helper function to safely format dates
     */
    private function formatDate($date, $format = 'Y-m-d')
    {
        if (!$date) return null;
        
        if (is_string($date)) {
            try {
                return Carbon::parse($date)->format($format);
            } catch (\Exception $e) {
                return $date; // Return original if can't parse
            }
        }
        
        return $date->format($format);
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'posisi_pkl_id' => $this->posisi_pkl_id,
            'status' => $this->status,
            'tanggal_pendaftaran' => $this->formatDate($this->tanggal_pendaftaran),
            'tanggal_mulai' => $this->formatDate($this->tanggal_mulai),
            'tanggal_selesai' => $this->formatDate($this->tanggal_selesai),
            'tanggal_diproses' => $this->formatDate($this->tanggal_diproses, 'Y-m-d H:i:s'),
            
            // Data Diri
            'nama_lengkap' => $this->nama_lengkap,
            'tempat_lahir' => $this->tempat_lahir,
            'tanggal_lahir' => $this->formatDate($this->tanggal_lahir),
            'email_pendaftar' => $this->email_pendaftar,
            'nomor_handphone' => $this->nomor_handphone,
            'alamat' => $this->alamat,
            'instagram' => $this->instagram,
            'tiktok' => $this->tiktok,
            'memiliki_laptop' => $this->memiliki_laptop,
            'memiliki_kamera_dslr' => $this->memiliki_kamera_dslr,
            'transportasi_operasional' => $this->transportasi_operasional,
            
            // Background Pendidikan
            'institusi_asal' => $this->institusi_asal,
            'asal_sekolah' => $this->asal_sekolah,
            'program_studi' => $this->program_studi,
            'jurusan' => $this->jurusan,
            'kelas' => $this->kelas,
            'semester' => $this->semester,
            'awal_pkl' => $this->formatDate($this->awal_pkl),
            'akhir_pkl' => $this->formatDate($this->akhir_pkl),
            
            // Skill & Minat
            'kemampuan_ditingkatkan' => $this->kemampuan_ditingkatkan,
            'skill_kelebihan' => $this->skill_kelebihan,
            'bidang_yang_disukai' => $this->bidang_yang_disukai,
            'pernah_membuat_video' => $this->pernah_membuat_video,
            
            // Kebijakan & Finalisasi
            'sudah_melihat_profil' => $this->sudah_melihat_profil,
            'tingkat_motivasi' => $this->tingkat_motivasi,
            'nilai_diri' => $this->nilai_diri,
            'apakah_merokok' => $this->apakah_merokok,
            'bersedia_ditempatkan' => $this->bersedia_ditempatkan,
            'bersedia_masuk_2_kali' => $this->bersedia_masuk_2_kali,
            
            // Additional
            'motivasi' => $this->motivasi,
            'berkas_persyaratan' => $this->berkas_persyaratan,
            'cv_file_path' => $this->cv_file_path,
            'cv_file_name' => $this->cv_file_name,
            'portfolio_file_path' => $this->portfolio_file_path,
            'portfolio_file_name' => $this->portfolio_file_name,
            'catatan_admin' => $this->catatan_admin,
            'created_at' => $this->formatDate($this->created_at, 'Y-m-d H:i:s'),
            'updated_at' => $this->formatDate($this->updated_at, 'Y-m-d H:i:s'),
            
            // Relations
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'nama' => $this->user->nama,
                    'nama_lengkap' => $this->user->nama_lengkap,
                    'email' => $this->user->email,
                    'no_telp' => $this->user->no_telp,
                ];
            }),
            
            'posisi_pkl' => $this->whenLoaded('posisiPKL', function () {
                return [
                    'id' => $this->posisiPKL->id,
                    'nama_posisi' => $this->posisiPKL->nama_posisi,
                    'kategori' => $this->posisiPKL->kategori,
                    'deskripsi' => $this->posisiPKL->deskripsi,
                    'persyaratan' => $this->posisiPKL->persyaratan,
                    'durasi_bulan' => $this->posisiPKL->durasi_bulan,
                    'kapasitas' => $this->posisiPKL->kapasitas,
                    'status' => $this->posisiPKL->status,
                ];
            }),
            
            'penilaian_pkl' => $this->whenLoaded('penilaian', function () {
                return $this->penilaian ? [
                    'id' => $this->penilaian->id,
                    'status_penilaian' => $this->penilaian->status_penilaian,
                    'nilai_akhir' => $this->penilaian->nilai_akhir,
                    'catatan_pembimbing' => $this->penilaian->catatan_pembimbing,
                    'tanggal_penilaian' => $this->formatDate($this->penilaian->tanggal_penilaian),
                ] : null;
            }),
            
            'laporan_mingguan' => $this->whenLoaded('uploadDokumen', function () {
                return $this->uploadDokumen->where('jenis_dokumen', 'laporan-mingguan')->map(function ($upload) {
                    return [
                        'id' => $upload->id,
                        'jenis_dokumen' => $upload->jenis_dokumen_text,
                        'tanggal_upload' => $upload->tanggal_upload ? $upload->tanggal_upload->format('d M Y') : null,
                        'file_name' => $upload->file_name,
                        'status' => $upload->status_text,
                        'feedback' => $upload->feedback,
                        'assessor' => $upload->assessor,
                    ];
                });
            }),
        ];
    }
}
