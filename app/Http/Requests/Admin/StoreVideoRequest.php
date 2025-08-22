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
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'thumbnail' => 'nullable|image|max:2048',
            'link_video' => 'required|url',
            'status' => 'required|in:Draft,Publish',
            'penulis' => 'required|string|max:255',
            'featured' => 'boolean'
        ];
    }
}
