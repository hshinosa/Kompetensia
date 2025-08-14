<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_artikel' => 'required|string|max:255',
            'jenis_konten' => 'required|in:Blog,News,Tutorial',
            'deskripsi' => 'required|string|max:500',
            'thumbnail' => 'nullable|image|max:2048',
            'konten' => 'required|string',
            // Konsistensi: gunakan 'Draft' (bukan 'Draf') agar cocok dengan enum migrasi & frontend
            'status' => 'required|in:Draft,Publish',
            'penulis' => 'required|string|max:255',
            'featured' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500'
        ];
    }
}
