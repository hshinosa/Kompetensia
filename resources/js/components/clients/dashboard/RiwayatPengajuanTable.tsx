import React from 'react';

export interface PengajuanItem {
  id: number;
  tanggal: string;
  jenis_pengajuan: string;
  nama: string;
  status: string;
}

interface RiwayatPengajuanTableProps {
  pengajuanItems: PengajuanItem[];
  onDetailClick: (item: PengajuanItem) => void;
}

const RiwayatPengajuanTable: React.FC<RiwayatPengajuanTableProps> = ({ pengajuanItems, onDetailClick }) => {
  return (
    <div className="overflow-x-auto">
      {pengajuanItems.length > 0 ? (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Jenis Pengajuan</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pengajuanItems.map((item, index) => {
              let statusClasses = 'bg-gray-100 text-gray-800';
              if (item.status === 'Disetujui') statusClasses = 'bg-green-100 text-green-800';
              else if (item.status === 'Sedang Diverifikasi') statusClasses = 'bg-yellow-100 text-yellow-800';
              else if (item.status === 'Ditolak') statusClasses = 'bg-red-100 text-red-800';

              return (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tanggal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {item.jenis_pengajuan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses}`}>{item.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => onDetailClick(item)}
                      className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Belum ada riwayat pengajuan</h3>
          <p className="text-gray-600 mb-6">Mulai daftarkan diri Anda ke program sertifikasi atau PKL</p>
          <div className="flex gap-4 justify-center">
            <a
              href="/sertifikasi"
              className="px-6 py-3 rounded-xl bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors"
            >
              Lihat Sertifikasi
            </a>
            <a
              href="/pkl"
              className="px-6 py-3 rounded-xl border-2 border-orange-400 text-orange-700 font-semibold hover:bg-orange-50 transition-colors"
            >
              Lihat PKL
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatPengajuanTable;
