<?php

namespace App\Http\Requests\Admin;

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
            'status' => 'required|in:Aktif,Non-Aktif'
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'nama_asesor.required' => 'Nama asesor wajib diisi',
            'nama_asesor.max' => 'Nama asesor maksimal 255 karakter',
            'jabatan_asesor.required' => 'Jabatan asesor wajib diisi',
            'jabatan_asesor.max' => 'Jabatan asesor maksimal 255 karakter',
            'instansi_asesor.required' => 'Instansi asesor wajib diisi',
            'instansi_asesor.max' => 'Instansi asesor maksimal 255 karakter',
            'foto_asesor.image' => 'File harus berupa gambar',
            'foto_asesor.mimes' => 'Format gambar harus jpeg, png, jpg, atau gif',
            'foto_asesor.max' => 'Ukuran gambar maksimal 2MB',
            'status.required' => 'Status wajib dipilih',
            'status.in' => 'Status harus Aktif atau Non-Aktif'
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes(): array
    {
        return [
            'nama_asesor' => 'nama asesor',
            'jabatan_asesor' => 'jabatan asesor',
            'instansi_asesor' => 'instansi asesor',
            'foto_asesor' => 'foto asesor'
        ];
    }
}
