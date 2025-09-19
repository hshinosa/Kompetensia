<?php

namespace App\Services;

use App\Repositories\Contracts\PenilaianSertifikasiRepositoryInterface;
use App\Models\PendaftaranSertifikasi;
use Illuminate\Support\Facades\DB;

class PenilaianSertifikasiService
{
    public function __construct(private readonly PenilaianSertifikasiRepositoryInterface $repo) {}

    public function nilaiIndividu(array $payload, int $pendaftaranId, int $asesorId): void
    {
        $pendaftaran = PendaftaranSertifikasi::findOrFail($pendaftaranId);
        $data = $this->compute($payload, $pendaftaran->sertifikasi_id, $pendaftaran->batch_id, $pendaftaranId, $asesorId);
        DB::transaction(fn () => $this->repo->upsert($data));
    }

    public function nilaiBatch(array $list, int $sertifikasiId, int $batchId, int $asesorId): void
    {
        DB::transaction(function () use ($list, $sertifikasiId, $batchId, $asesorId) {
            foreach ($list as $row) {
                PendaftaranSertifikasi::findOrFail($row['pendaftaran_id']); // ensure exists
                $data = $this->compute($row, $sertifikasiId, $batchId, $row['pendaftaran_id'], $asesorId);
                $this->repo->upsert($data);
            }
        });
    }

    private function compute(array $data, int $sertifikasiId, int $batchId, int $pendaftaranId, int $asesorId): array
    {
        return [
            'status_penilaian' => $data['status_kelulusan'], // Map status_kelulusan to status_penilaian
            'catatan_asesor' => $data['catatan_asesor'] ?? null,
            'tanggal_penilaian' => now(),
            'asesor_id' => $asesorId,
            'sertifikasi_id' => $sertifikasiId,
            'batch_id' => $batchId,
            'pendaftaran_id' => $pendaftaranId
        ];
    }
}
