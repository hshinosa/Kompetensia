<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PendaftaranSertifikasiRequest extends FormRequest
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
            'sertifikasi_id' => ['required', 'integer', 'exists:sertifikasi,id'],
            'batch_id' => ['required', 'integer', 'exists:batch_sertifikasi,id'],
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'no_telp' => ['required', 'string', 'max:20'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'sertifikasi_id.required' => 'Sertifikasi harus dipilih.',
            'sertifikasi_id.exists' => 'Sertifikasi yang dipilih tidak valid.',
            'batch_id.required' => 'Batch harus dipilih.',
            'batch_id.exists' => 'Batch yang dipilih tidak valid.',
            'nama_lengkap.required' => 'Nama lengkap harus diisi.',
            'nama_lengkap.max' => 'Nama lengkap maksimal 255 karakter.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email maksimal 255 karakter.',
            'no_telp.required' => 'Nomor telepon harus diisi.',
            'no_telp.max' => 'Nomor telepon maksimal 20 karakter.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'sertifikasi_id' => 'sertifikasi',
            'batch_id' => 'batch',
            'nama_lengkap' => 'nama lengkap',
            'email' => 'email',
            'no_telp' => 'nomor telepon',
        ];
    }
}