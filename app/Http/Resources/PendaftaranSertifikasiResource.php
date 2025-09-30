<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PendaftaranSertifikasiResource extends JsonResource
{
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
            'sertifikasi_id' => $this->sertifikasi_id,
            'batch_id' => $this->batch_id,
            'status' => $this->status,
            'tanggal_pendaftaran' => $this->tanggal_pendaftaran?->format('Y-m-d'),
            'tanggal_diproses' => $this->tanggal_diproses?->format('Y-m-d H:i:s'),
            'motivasi' => $this->motivasi,
            'berkas_persyaratan' => $this->berkas_persyaratan,
            'catatan_admin' => $this->catatan_admin,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            
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
            
            'sertifikasi' => $this->whenLoaded('sertifikasi', function () {
                return [
                    'id' => $this->sertifikasi->id,
                    'nama_sertifikasi' => $this->sertifikasi->nama_sertifikasi,
                    'jenis_sertifikasi' => $this->sertifikasi->jenis_sertifikasi,
                    'deskripsi' => $this->sertifikasi->deskripsi,
                    'status' => $this->sertifikasi->status,
                ];
            }),
            
            'batch_sertifikasi' => $this->whenLoaded('batch', function () {
                return [
                    'id' => $this->batch->id,
                    'nama_batch' => $this->batch->nama_batch,
                    'tanggal_mulai' => $this->batch->tanggal_mulai?->format('Y-m-d'),
                    'tanggal_selesai' => $this->batch->tanggal_selesai?->format('Y-m-d'),
                    'jumlah_pendaftar' => $this->batch->jumlah_pendaftar,
                    'status' => $this->batch->status,
                    'instruktur' => $this->batch->instruktur,
                ];
            }),
            
            'penilaian_sertifikasi' => $this->whenLoaded('penilaian', function () {
                return $this->penilaian ? [
                    'id' => $this->penilaian->id,
                    'status_penilaian' => $this->penilaian->status_penilaian,
                    'nilai_teori' => $this->penilaian->nilai_teori,
                    'nilai_praktek' => $this->penilaian->nilai_praktek,
                    'catatan_asesor' => $this->penilaian->catatan_asesor,
                    'tanggal_penilaian' => $this->penilaian->tanggal_penilaian?->format('Y-m-d'),
                ] : null;
            }),
        ];
    }
}