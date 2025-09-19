import React from 'react';

interface BatchData {
  readonly id: number;
  readonly nama_batch: string;
  readonly tanggal_mulai: string;
  readonly tanggal_selesai: string;
  readonly jumlah_pendaftar: number;
  readonly status: string;
  readonly instruktur: string;
  readonly catatan?: string;
}

interface Props {
  readonly batch?: BatchData;
  readonly onBatchSelect?: (batch: {id: number; nama_batch: string; tanggal_mulai: string; tanggal_selesai: string}) => void;
}

const sampleBatches = [
  { id: 1, name: 'Batch 1', date: '25 April 2025', peserta: 45 },
  { id: 2, name: 'Batch 2', date: '25 Agustus 2025', peserta: 45 },
  { id: 3, name: 'Batch 3', date: '25 Desember 2025', peserta: 45 },
];

export default function Batches({ batch, onBatchSelect }: Props) {
  return (
    <div id="batch">
      <h4 className="text-lg font-semibold mb-4 text-gray-900">Jadwal Batch</h4>
      
      {batch ? (
        <div className="border-2 border-purple-300 rounded-lg p-4 max-w-md">
          <div className="font-semibold text-purple-700">{batch.nama_batch}</div>
          <div className="text-sm text-gray-600 mt-1">
            Mulai: {new Date(batch.tanggal_mulai).toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
          <div className="text-sm text-gray-600">
            Selesai: {new Date(batch.tanggal_selesai).toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
          <div className="text-sm text-gray-600 mt-2">👥 {batch.jumlah_pendaftar} Peserta</div>
          <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 w-fit mt-2">
            {batch.status}
          </div>
          <button 
            onClick={() => onBatchSelect?.({
              id: batch.id,
              nama_batch: batch.nama_batch,
              tanggal_mulai: batch.tanggal_mulai,
              tanggal_selesai: batch.tanggal_selesai
            })}
            className="w-full mt-4 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Daftar Batch
          </button>
        </div>
      ) : (
        <div className="flex gap-4 flex-wrap">
          {sampleBatches.map((b) => (
            <div key={b.id} className="border-2 border-purple-300 rounded-lg p-4 min-w-[160px] flex flex-col">
              <div className="font-semibold">{b.name}</div>
              <div className="text-sm text-gray-600">{b.date}</div>
              <div className="text-sm text-gray-600 mt-2 mb-4">👥 {b.peserta} Peserta</div>
              <button 
                onClick={() => onBatchSelect?.({
                  id: b.id,
                  nama_batch: b.name,
                  tanggal_mulai: b.date,
                  tanggal_selesai: b.date
                })}
                className="mt-auto px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Daftar Batch
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
