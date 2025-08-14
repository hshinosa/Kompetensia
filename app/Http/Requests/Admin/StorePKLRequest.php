<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePKLRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'nama_program' => 'required|string|max:255',
            'kategori' => 'required|in:Developer,Kreatif,Marketing,Data Analyst,Quality Assurance,Lainnya',
            'posisi' => 'nullable|string|max:255',
            'tipe_kerja' => 'required|in:Full-time,Part-time,Remote,Hybrid',
            'deskripsi' => 'nullable|string',
            'durasi' => 'required|in:1 Bulan,2 Bulan,3 Bulan,4 Bulan,5 Bulan,6 Bulan',
            'status' => 'required|in:Draft,Aktif,Selesai,Ditutup',
            'lokasi' => 'nullable|string|max:255',
            'persyaratan' => 'nullable|array',
            'benefit' => 'nullable|array',
        ];
    }
}
