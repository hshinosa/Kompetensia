<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePKLRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'nama_posisi' => 'required|string|max:255',
            'kategori' => 'required|in:Developer,Kreatif,Marketing,Data Analyst,Quality Assurance,Lainnya',
            'deskripsi' => 'required|string',
            'persyaratan' => 'required|array',
            'benefits' => 'required|array',
            'tipe' => 'required|in:Full-time,Part-time,Remote,Hybrid',
            'durasi_bulan' => 'required|in:1 Bulan,2 Bulan,3 Bulan,4 Bulan,5 Bulan,6 Bulan',
            'status' => 'required|in:Draft,Aktif,Selesai,Ditutup',
        ];
    }
}
