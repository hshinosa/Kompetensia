<?php

namespace App\Repositories\Contracts;

use App\Models\PenilaianSertifikasi;

interface PenilaianSertifikasiRepositoryInterface
{
    public function upsert(array $data): PenilaianSertifikasi; // keyed by pendaftaran_id
    public function find(int $id): PenilaianSertifikasi;
}
