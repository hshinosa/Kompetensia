<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePenilaianPKLRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'status_kelulusan' => 'required|in:Diterima,Ditolak',
            'catatan_pembimbing' => 'nullable|string'
        ];
    }
}
