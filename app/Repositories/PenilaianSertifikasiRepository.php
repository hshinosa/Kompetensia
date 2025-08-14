<?php

namespace App\Repositories;

use App\Models\PenilaianSertifikasi;
use App\Repositories\Contracts\PenilaianSertifikasiRepositoryInterface;

class PenilaianSertifikasiRepository implements PenilaianSertifikasiRepositoryInterface
{
    public function upsert(array $data): PenilaianSertifikasi
    {
        return PenilaianSertifikasi::updateOrCreate(
            ['pendaftaran_id' => $data['pendaftaran_id']],
            $data
        );
    }

    public function find(int $id): PenilaianSertifikasi
    {
        return PenilaianSertifikasi::findOrFail($id);
    }
}
