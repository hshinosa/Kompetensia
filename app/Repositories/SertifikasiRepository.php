<?php

namespace App\Repositories;

use App\Repositories\Contracts\SertifikasiRepositoryInterface;
use App\Models\Sertifikasi;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class SertifikasiRepository implements SertifikasiRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = Sertifikasi::with(['modul', 'batch']);
        if (!empty($filters['search'])) {
            $query->where('nama_sertifikasi', 'like', '%'.$filters['search'].'%');
        }
        if (!empty($filters['jenis'])) {
            $query->where('jenis_sertifikasi', $filters['jenis']);
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        return $query->latest()->paginate($perPage);
    }

    public function findWithRelations(int $id): Sertifikasi
    {
        return Sertifikasi::with(['modul.ordered', 'batch'])->findOrFail($id);
    }

    public function createWithRelations(array $data): Sertifikasi
    {
        if (isset($data['thumbnail']) && $data['thumbnail']) {
            $data['thumbnail'] = $data['thumbnail']->store('sertifikasi/thumbnails', 'public');
        }
        if (isset($data['foto_asesor']) && $data['foto_asesor']) {
            $data['foto_asesor'] = $data['foto_asesor']->store('sertifikasi/asesor', 'public');
        }
        $data['created_by'] = auth()->id();
        $data['status'] = 'Aktif';
        if (isset($data['kapasitas_peserta'])) {
            // ensure consistent attribute naming if variant keys provided
            $data['kapasitas_peserta'] = (int)$data['kapasitas_peserta'];
        }
        $modul = $data['modul'];
        $batch = $data['batch'];
        unset($data['modul'], $data['batch']);
        $sertifikasi = Sertifikasi::create($data);
        foreach ($modul as $index => $mod) {
            $sertifikasi->modul()->create([
                'judul' => $mod['judul'],
                'deskripsi' => $mod['deskripsi'],
                'poin_pembelajaran' => $mod['poin_pembelajaran'] ?? [],
                'urutan' => $index
            ]);
        }
        foreach ($batch as $b) {
            $sertifikasi->batch()->create($b);
        }
        return $sertifikasi;
    }

    public function updateWithRelations(Sertifikasi $sertifikasi, array $data): Sertifikasi
    {
        if (isset($data['thumbnail']) && $data['thumbnail']) {
            if ($sertifikasi->thumbnail) { Storage::disk('public')->delete($sertifikasi->thumbnail); }
            $data['thumbnail'] = $data['thumbnail']->store('sertifikasi/thumbnails', 'public');
        }
        if (isset($data['foto_asesor']) && $data['foto_asesor']) {
            if ($sertifikasi->foto_asesor) { Storage::disk('public')->delete($sertifikasi->foto_asesor); }
            $data['foto_asesor'] = $data['foto_asesor']->store('sertifikasi/asesor', 'public');
        }
        $data['updated_by'] = auth()->id();
        if (isset($data['kapasitas_peserta'])) {
            $data['kapasitas_peserta'] = (int)$data['kapasitas_peserta'];
        }
        $modul = $data['modul'];
        $batch = $data['batch'];
        unset($data['modul'], $data['batch']);
        $sertifikasi->update($data);
        $sertifikasi->modul()->delete();
        foreach ($modul as $index => $mod) {
            $sertifikasi->modul()->create([
                'judul' => $mod['judul'],
                'deskripsi' => $mod['deskripsi'],
                'poin_pembelajaran' => $mod['poin_pembelajaran'] ?? [],
                'urutan' => $index
            ]);
        }
        $sertifikasi->batch()->delete();
        foreach ($batch as $b) {
            $sertifikasi->batch()->create($b);
        }
        return $sertifikasi;
    }

    public function delete(Sertifikasi $sertifikasi): void
    {
        if ($sertifikasi->thumbnail) { Storage::disk('public')->delete($sertifikasi->thumbnail); }
        if ($sertifikasi->foto_asesor) { Storage::disk('public')->delete($sertifikasi->foto_asesor); }
        $sertifikasi->delete();
    }
}
