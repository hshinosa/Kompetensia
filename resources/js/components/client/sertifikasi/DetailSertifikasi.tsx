import React from 'react';
import MateriCollapsible from './MateriCollapsible';
import Batches from './Batches';
import AssessorDetail from './AssessorDetail';
import ReviewList from './ReviewList';

interface SertifikasiData {
  readonly id: number;
  readonly nama_sertifikasi: string;
  readonly jenis_sertifikasi: string;
  readonly deskripsi: string;
  readonly batch?: {
    readonly id: number;
    readonly nama_batch: string;
    readonly tanggal_mulai: string;
    readonly tanggal_selesai: string;
    readonly jumlah_pendaftar: number;
    readonly status: string;
    readonly instruktur: string;
    readonly catatan?: string;
  };
  readonly moduls: Array<{
    readonly id: number;
    readonly judul: string;
    readonly deskripsi: string;
    readonly poin_pembelajaran: string[];
    readonly urutan: number;
  }>;
  readonly asesor?: {
    readonly nama: string;
    readonly keahlian: string;
    readonly pengalaman: string;
    readonly kontak: string;
    readonly foto?: string;
  };
}

interface Props {
  readonly sertifikasi?: SertifikasiData;
  readonly onBatchSelect?: (batch: {id: number; nama_batch: string; tanggal_mulai: string; tanggal_selesai: string}) => void;
}

export default function DetailSertifikasi({ sertifikasi, onBatchSelect }: Props) {
  const defaultDescription = 'Sertifikasi Digital Marketing adalah program yang dirancang untuk membekali kamu dengan pengetahuan dan keterampilan praktis dalam mengelola strategi pemasaran di dunia digital...';
  
  return (
    <article>
      <div id="detail" className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Detail Sertifikasi</h2>
        <p className="text-sm text-gray-700 mt-3">{sertifikasi?.deskripsi || defaultDescription}</p>
        {sertifikasi?.jenis_sertifikasi && (
          <div className="mt-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
              {sertifikasi.jenis_sertifikasi}
            </span>
          </div>
        )}
      </div>

      <div className="mt-16">
        <MateriCollapsible moduls={sertifikasi?.moduls} />
      </div>

      <div className="mt-16">
        <Batches batch={sertifikasi?.batch} onBatchSelect={onBatchSelect} />
      </div>

      <div className="mt-16">
        <AssessorDetail asesor={sertifikasi?.asesor} />
      </div>

      <div className="mt-16">
        <ReviewList />
      </div>
    </article>
  );
}
