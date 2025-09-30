<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSertifikasiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $reqString255 = 'required|string|max:255';
        $reqString = 'required|string';
        $nullableImage = 'nullable|image|max:2048';
        $reqArrayMin1 = 'required|array|min:1';
        return [
            'nama_sertifikasi' => $reqString255,
            'jenis_sertifikasi' => 'required|in:Industri,BNSP',
            'deskripsi' => $reqString,
            'thumbnail' => $nullableImage,
            
            // Asesor - bisa pilih existing atau buat baru
            'asesor_id' => 'nullable|exists:asesors,id',
            'nama_asesor' => 'nullable|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'instansi' => 'nullable|string|max:255',
            'foto_asesor' => $nullableImage,
            
            'tipe_sertifikat' => 'required|array|min:1',
            'tipe_sertifikat.*' => 'in:Sertifikat Keahlian,Sertifikat Kompetensi,Sertifikat Pelatihan',
            'modul' => $reqArrayMin1,
            'modul.*.judul' => $reqString255,
            'modul.*.deskripsi' => $reqString,
            'modul.*.poin_pembelajaran' => 'nullable|array',
            'batch' => $reqArrayMin1,
            'batch.*.nama_batch' => $reqString255,
            'batch.*.tanggal_mulai' => 'required|date',
            'batch.*.tanggal_selesai' => 'required|date|after:batch.*.tanggal_mulai',
            'batch.*.status' => 'required|in:Draf,Aktif,Selesai'
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Pastikan ada asesor_id atau data asesor baru
            if (!$this->asesor_id && !$this->nama_asesor) {
                $validator->errors()->add('asesor_id', 'Pilih asesor yang ada atau buat asesor baru.');
            }
            
            // Jika buat asesor baru, pastikan data lengkap
            if ($this->nama_asesor && (!$this->jabatan_asesor || !$this->instansi_asesor)) {
                if (!$this->jabatan_asesor) {
                    $validator->errors()->add('jabatan_asesor', 'Jabatan asesor wajib diisi untuk asesor baru.');
                }
                if (!$this->instansi_asesor) {
                    $validator->errors()->add('instansi_asesor', 'Instansi asesor wajib diisi untuk asesor baru.');
                }
            }
        });
    }
}
