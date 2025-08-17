<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PendaftaranPKLResource extends JsonResource
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
            'posisi_pkl_id' => $this->posisi_pkl_id,
            'status' => $this->status,
            'tanggal_pendaftaran' => $this->tanggal_pendaftaran->format('Y-m-d'),
            'tanggal_mulai' => $this->tanggal_mulai?->format('Y-m-d'),
            'tanggal_selesai' => $this->tanggal_selesai?->format('Y-m-d'),
            'institusi_asal' => $this->institusi_asal,
            'program_studi' => $this->program_studi,
            'semester' => $this->semester,
            'ipk' => $this->ipk,
            'motivasi' => $this->motivasi,
            'catatan_admin' => $this->catatan_admin,
            'tanggal_diproses' => $this->tanggal_diproses?->format('Y-m-d'),
            'berkas_persyaratan' => $this->berkas_persyaratan,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Relations
            'user' => $this->whenLoaded('user'),
            'posisi_pkl' => $this->whenLoaded('posisiPKL', function () {
                return $this->posisiPKL;
            }),
            'penilaian' => $this->whenLoaded('penilaian'),
        ];
    }
}
