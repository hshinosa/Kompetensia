<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAsesorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_asesor' => 'required|string|max:255',
            'jabatan_asesor' => 'required|string|max:255',
            'instansi_asesor' => 'required|string|max:255',
            'foto_asesor' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:Aktif,Tidak Aktif',
        ];
    }

    public function messages(): array
    {
        return [
            'nama_asesor.required' => 'Nama asesor wajib diisi.',
            'jabatan_asesor.required' => 'Jabatan asesor wajib diisi.',
            'instansi_asesor.required' => 'Instansi asesor wajib diisi.',
            'foto_asesor.image' => 'File harus berupa gambar.',
            'foto_asesor.mimes' => 'Foto harus berformat: jpeg, png, jpg, atau gif.',
            'foto_asesor.max' => 'Ukuran foto maksimal 2MB.',
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status harus berupa Aktif atau Tidak Aktif.',
        ];
    }
}
