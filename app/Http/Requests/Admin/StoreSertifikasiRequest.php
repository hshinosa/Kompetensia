<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreSertifikasiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Adjust authorization as needed
    }

    public function rules(): array
    {
    $reqStr255 = 'required|string|max:255';
    $reqStr = 'required|string';
    $nullableImg = 'nullable|image|max:2048';
    $reqArrayMin1 = 'required|array|min:1';
        return [
            'nama_sertifikasi' => $reqStr255,
            'jenis_sertifikasi' => 'required|in:Industri,BNSP',
            'deskripsi' => $reqStr,
            'thumbnail' => $nullableImg,
            'nama_asesor' => $reqStr255,
            'jabatan_asesor' => $reqStr255,
            'instansi_asesor' => $reqStr255,
            'foto_asesor' => $nullableImg,
            'tipe_sertifikat' => 'required|array|min:1',
            'tipe_sertifikat.*' => 'in:Sertifikat Keahlian,Sertifikat Kompetensi,Sertifikat Pelatihan',
            'modul' => $reqArrayMin1,
            'modul.*.judul' => $reqStr255,
            'modul.*.deskripsi' => $reqStr,
            'modul.*.poin_pembelajaran' => 'nullable|array',
            'batch' => $reqArrayMin1,
            'batch.*.nama_batch' => $reqStr255,
            'batch.*.tanggal_mulai' => 'required|date',
            'batch.*.tanggal_selesai' => 'required|date|after:batch.*.tanggal_mulai',
            'batch.*.status' => 'required|in:Draf,Aktif,Selesai'
        ];
    }
}
