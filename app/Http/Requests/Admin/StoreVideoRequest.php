<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreVideoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_video' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'thumbnail' => 'nullable|image|max:2048',
            'video_url' => 'required|url',
            'durasi' => 'required|integer|min:1',
            // konsistensi dengan enum migrasi video (Draft)
            'status' => 'required|in:Draft,Publish',
            'uploader' => 'required|string|max:255',
            'featured' => 'boolean'
        ];
    }
}
