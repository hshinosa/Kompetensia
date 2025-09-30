<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PendaftaranPKLRequest extends FormRequest
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
        $rules = [
            // Required fields
            'posisi_pkl_id' => ['required', 'integer', 'exists:posisi_pkl,id'],
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'email_pendaftar' => ['required', 'email', 'max:255'],
            'nomor_handphone' => ['required', 'string', 'max:20'],
            'institusi_asal' => ['required', 'in:Sekolah,Universitas'],
            'asal_sekolah' => ['required', 'string', 'max:255'],
            'awal_pkl' => ['required', 'date'],
            'akhir_pkl' => ['required', 'date', 'after:awal_pkl'],
            
            // Data Diri Fields
            'tempat_lahir' => ['nullable', 'string', 'max:255'],
            'tanggal_lahir' => ['nullable', 'date'],
            'alamat' => ['nullable', 'string', 'max:500'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'tiktok' => ['nullable', 'string', 'max:255'],
            'memiliki_laptop' => ['nullable', 'in:ya,tidak'],
            'memiliki_kamera_dslr' => ['nullable', 'in:ya,tidak'],
            'transportasi_operasional' => ['nullable', 'string', 'max:255'],
            
            // Background Pendidikan Fields - conditional validation will be added below
            'program_studi' => ['nullable', 'string', 'max:255'],
            'kelas' => ['nullable', 'string', 'max:50'],
            'semester' => ['nullable', 'integer', 'between:1,8'],
            'jurusan' => ['nullable', 'string', 'max:255'], // Made nullable, will be required conditionally
            
            // Skill & Minat Fields
            'kemampuan_ditingkatkan' => ['nullable', 'string', 'max:1000'],
            'skill_kelebihan' => ['nullable', 'string', 'max:1000'],
            'pernah_membuat_video' => ['nullable', 'in:ya,tidak'],
            
            // Kebijakan & Finalisasi Fields
            'sudah_melihat_profil' => ['nullable', 'in:ya,tidak'],
            'tingkat_motivasi' => ['nullable', 'integer', 'between:1,10'],
            'nilai_diri' => ['nullable', 'string', 'max:1000'],
            'apakah_merokok' => ['nullable', 'in:ya,tidak'],
            'bersedia_ditempatkan' => ['nullable', 'in:ya,tidak'],
            'bersedia_masuk_2_kali' => ['nullable', 'in:ya,tidak'],
            
            // Optional fields
            'tanggal_mulai' => ['nullable', 'date'],
            'tanggal_selesai' => ['nullable', 'date', 'after:tanggal_mulai'],
            'motivasi' => ['nullable', 'string', 'max:1000'],
            'berkas_persyaratan' => ['nullable', 'array'],
            'berkas_persyaratan.*' => ['nullable', 'file', 'max:10240'], // 10MB max
            
            // Berkas fields
            'cv_file_path' => ['nullable', 'string', 'max:500'],
            'cv_file_name' => ['nullable', 'string', 'max:255'],
            'portfolio_file_path' => ['nullable', 'string', 'max:500'],
            'portfolio_file_name' => ['nullable', 'string', 'max:255'],
        ];

        // Add conditional validation based on institution type
        if ($this->institusi_asal === 'Sekolah') {
            $rules['jurusan'] = ['required', 'string', 'max:255'];
            $rules['kelas'] = ['required', 'string', 'max:50'];
        } elseif ($this->institusi_asal === 'Universitas') {
            $rules['program_studi'] = ['required', 'string', 'max:255'];
            $rules['semester'] = ['required', 'integer', 'between:1,8'];
        } else {
            // For other institution types, jurusan is still required
            $rules['jurusan'] = ['required', 'string', 'max:255'];
        }

        return $rules;
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'posisi_pkl_id.required' => 'Posisi PKL harus dipilih.',
            'posisi_pkl_id.exists' => 'Posisi PKL yang dipilih tidak valid.',
            'nama_lengkap.required' => 'Nama lengkap harus diisi.',
            'nama_lengkap.max' => 'Nama lengkap maksimal 255 karakter.',
            'email_pendaftar.required' => 'Email harus diisi.',
            'email_pendaftar.email' => 'Format email tidak valid.',
            'email_pendaftar.max' => 'Email maksimal 255 karakter.',
            'nomor_handphone.required' => 'Nomor handphone harus diisi.',
            'nomor_handphone.max' => 'Nomor handphone maksimal 20 karakter.',
            'institusi_asal.required' => 'Institusi asal harus diisi.',
            'institusi_asal.in' => 'Institusi asal harus Sekolah atau Universitas.',
            'asal_sekolah.required' => 'Asal sekolah harus diisi.',
            'asal_sekolah.max' => 'Asal sekolah maksimal 255 karakter.',
            'jurusan.required' => 'Jurusan harus diisi.',
            'jurusan.max' => 'Jurusan maksimal 255 karakter.',
            'awal_pkl.required' => 'Tanggal awal PKL harus diisi.',
            'akhir_pkl.required' => 'Tanggal akhir PKL harus diisi.',
            'semester.between' => 'Semester harus antara 1-8.',
            'tanggal_lahir.date' => 'Format tanggal lahir tidak valid.',
            'alamat.max' => 'Alamat maksimal 500 karakter.',
            'memiliki_laptop.in' => 'Pilihan memiliki laptop harus ya atau tidak.',
            'memiliki_kamera_dslr.in' => 'Pilihan memiliki kamera DSLR harus ya atau tidak.',
            'awal_pkl.date' => 'Format tanggal awal PKL tidak valid.',
            'akhir_pkl.date' => 'Format tanggal akhir PKL tidak valid.',
            'akhir_pkl.after' => 'Tanggal akhir PKL harus setelah tanggal awal PKL.',
            'kemampuan_ditingkatkan.max' => 'Kemampuan yang ingin ditingkatkan maksimal 1000 karakter.',
            'skill_kelebihan.max' => 'Skill kelebihan maksimal 1000 karakter.',
            'bidang_yang_disukai.required' => 'Bidang yang disukai harus dipilih.',
            'bidang_yang_disukai.exists' => 'Posisi PKL yang dipilih tidak valid.',
            'pernah_membuat_video.in' => 'Pilihan pernah membuat video harus ya atau tidak.',
            'sudah_melihat_profil.in' => 'Pilihan sudah melihat profil harus ya atau tidak.',
            'tingkat_motivasi.between' => 'Tingkat motivasi harus antara 1-10.',
            'nilai_diri.max' => 'Nilai diri maksimal 1000 karakter.',
            'apakah_merokok.in' => 'Pilihan apakah merokok harus ya atau tidak.',
            'bersedia_ditempatkan.in' => 'Pilihan bersedia ditempatkan harus ya atau tidak.',
            'bersedia_masuk_2_kali.in' => 'Pilihan bersedia masuk 2 kali harus ya atau tidak.',
            'tanggal_mulai.date' => 'Format tanggal mulai tidak valid.',
            'tanggal_selesai.date' => 'Format tanggal selesai tidak valid.',
            'tanggal_selesai.after' => 'Tanggal selesai harus setelah tanggal mulai.',
            'motivasi.max' => 'Motivasi maksimal 1000 karakter.',
            'berkas_persyaratan.*.file' => 'Berkas harus berupa file.',
            'berkas_persyaratan.*.max' => 'Ukuran berkas maksimal 10MB.',
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
            'posisi_pkl_id' => 'posisi PKL',
            'nama_lengkap' => 'nama lengkap',
            'email_pendaftar' => 'email',
            'nomor_handphone' => 'nomor handphone',
            'institusi_asal' => 'institusi asal',
            'program_studi' => 'program studi',
            'semester' => 'semester',
            'tempat_lahir' => 'tempat lahir',
            'tanggal_lahir' => 'tanggal lahir',
            'alamat' => 'alamat',
            'instagram' => 'Instagram',
            'tiktok' => 'TikTok',
            'memiliki_laptop' => 'memiliki laptop',
            'memiliki_kamera_dslr' => 'memiliki kamera DSLR',
            'transportasi_operasional' => 'transportasi operasional',
            'asal_sekolah' => 'asal sekolah',
            'jurusan' => 'jurusan',
            'kelas' => 'kelas',
            'awal_pkl' => 'awal PKL',
            'akhir_pkl' => 'akhir PKL',
            'kemampuan_ditingkatkan' => 'kemampuan yang ingin ditingkatkan',
            'skill_kelebihan' => 'skill kelebihan',
            'bidang_yang_disukai' => 'bidang yang disukai',
            'pernah_membuat_video' => 'pernah membuat video',
            'sudah_melihat_profil' => 'sudah melihat profil',
            'tingkat_motivasi' => 'tingkat motivasi',
            'nilai_diri' => 'nilai diri',
            'apakah_merokok' => 'apakah merokok',
            'bersedia_ditempatkan' => 'bersedia ditempatkan',
            'bersedia_masuk_2_kali' => 'bersedia masuk 2 kali',
            'tanggal_mulai' => 'tanggal mulai',
            'tanggal_selesai' => 'tanggal selesai',
            'motivasi' => 'motivasi',
            'berkas_persyaratan' => 'berkas persyaratan',
        ];
    }
}