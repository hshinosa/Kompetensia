import { Head } from '@inertiajs/react';
import ClientAuthenticatedLayout from '@/layouts/ClientAuthenticatedLayout';

interface DashboardStats {
    sertifikasi_selesai: number;
    program_aktif: number;
    pengajuan_diproses: number;
    total_program: number;
}

interface PengajuanItem {
    id: number;
    tanggal: string;
    jenis_pengajuan: string;
    nama: string;
    status: string;
}

interface ProgramItem {
    id: number;
    nama: string;
    jenis: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status: string;
    deskripsi?: string;
}

interface UserData {
    id: number;
    nama: string;
    nama_lengkap: string;
    email: string;
    institusi?: string;
    jurusan?: string;
    semester?: number;
    foto_profil?: string;
    profile_completion_percentage: number;
    status_akun: string;
    role: string;
}

interface ClientDashboardProps {
    user: UserData;
    stats: DashboardStats;
    riwayat_pengajuan: PengajuanItem[];
    program_saya: ProgramItem[];
}

export default function ClientDashboard({ 
    user, 
    stats, 
    riwayat_pengajuan, 
    program_saya 
}: Readonly<ClientDashboardProps>) {
    return (
        <ClientAuthenticatedLayout>
            <Head title="Dashboard" />
            
            <div className="space-y-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Sertifikasi Selesai */}
                    <a href="/client/sertifikasi" className="bg-white rounded-xl border-2 border-purple-300 p-6 hover:shadow-lg hover:border-purple-400 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-right">
                                <h3 className="text-sm font-medium text-gray-600 mb-1">Sertifikasi Selesai</h3>
                                <p className="text-3xl font-bold text-gray-900">{stats?.sertifikasi_selesai || 0}</p>
                            </div>
                        </div>
                    </a>

                    {/* Sertifikat Saya */}
                    <a href="/client/sertifikat-saya" className="bg-white rounded-xl border-2 border-purple-300 p-6 hover:shadow-lg hover:border-purple-400 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="text-right">
                                <h3 className="text-sm font-medium text-gray-600 mb-1">Sertifikat Saya</h3>
                                <p className="text-3xl font-bold text-gray-900">{stats?.sertifikasi_selesai || 0}</p>
                            </div>
                        </div>
                    </a>

                    {/* Program Aktif */}
                    <a href="/client/pkl" className="bg-white rounded-xl border-2 border-purple-300 p-6 hover:shadow-lg hover:border-purple-400 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div className="text-right">
                                <h3 className="text-sm font-medium text-gray-600 mb-1">Program Aktif</h3>
                                <p className="text-3xl font-bold text-gray-900">{stats?.program_aktif || 0}</p>
                            </div>
                        </div>
                    </a>

                    {/* Pengajuan Diproses */}
                    <div className="bg-white rounded-xl border-2 border-purple-300 p-6">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-right">
                                <h3 className="text-sm font-medium text-gray-600 mb-1">Pengajuan Diproses</h3>
                                <p className="text-3xl font-bold text-gray-900">{stats?.pengajuan_diproses || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Riwayat Pengajuan Table */}
                <div className="bg-white rounded-xl border-2 border-purple-300 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200 bg-purple-50">
                        <h2 className="text-xl font-semibold text-gray-900">Riwayat Pengajuan</h2>
                        <p className="text-sm text-gray-600 mt-1">Lihat status pengajuan sertifikasi dan PKL Anda</p>
                    </div>
                    <div className="overflow-x-auto">
                        {riwayat_pengajuan && riwayat_pengajuan.length > 0 ? (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Jenis Pengajuan
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Nama
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {riwayat_pengajuan.map((item, index) => {
                                        let statusClasses = 'bg-gray-100 text-gray-800';
                                        if (item.status === 'Disetujui') {
                                            statusClasses = 'bg-green-100 text-green-800';
                                        } else if (item.status === 'Sedang Diverifikasi') {
                                            statusClasses = 'bg-yellow-100 text-yellow-800';
                                        }

                                        return (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {item.tanggal}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        {item.jenis_pengajuan}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.nama}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses}`}>
                                                        {item.status}
                                                    </span>
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
                </div>
            </div>
        </ClientAuthenticatedLayout>
    );
}
