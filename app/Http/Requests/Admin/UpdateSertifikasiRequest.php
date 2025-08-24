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
            'nama_asesor' => $reqString255,
            'jabatan_asesor' => $reqString255,
            'instansi_asesor' => $reqString255,
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
}
