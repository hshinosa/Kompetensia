<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePenilaianPKLRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'status_penilaian' => 'required|in:Diterima,Ditolak',
            'catatan_penilai' => 'nullable|string'
        ];
    }
    
    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Handle legacy field names for backward compatibility
        if ($this->has('status_kelulusan') && !$this->has('status_penilaian')) {
            $this->merge([
                'status_penilaian' => $this->input('status_kelulusan')
            ]);
        }
        
        if ($this->has('catatan_pembimbing') && !$this->has('catatan_penilai')) {
            $this->merge([
                'catatan_penilai' => $this->input('catatan_pembimbing')
            ]);
        }
    }
}
