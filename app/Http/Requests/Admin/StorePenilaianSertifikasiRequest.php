<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePenilaianSertifikasiRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'pendaftaran_id' => 'required|exists:pendaftaran_sertifikasi,id',
            'status_kelulusan' => 'required|in:Diterima,Ditolak',
            'status_kelulusan' => 'required|in:Belum Dinilai,Diterima,Ditolak',
            'catatan_asesor' => 'nullable|string'
        ];
    }
}
