<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class BatchStorePenilaianSertifikasiRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'penilaian' => 'required|array',
            'penilaian.*.pendaftaran_id' => 'required|exists:pendaftaran_sertifikasi,id',
            'penilaian.*.status_kelulusan' => 'required|in:Diterima,Ditolak',
            'penilaian.*.catatan_asesor' => 'nullable|string'
        ];
    }
}
