import { Head } from '@inertiajs/react';
import ClientAuthenticatedLayout from '@/layouts/ClientAuthenticatedLayout';
import { useState, useEffect } from 'react';

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
    deskripsi?: string;
    institusi?: string;
    periode?: string;
    catatan?: string;
}

interface PengajuanDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    pengajuanData: PengajuanItem | null;
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

// Pengajuan Detail Modal Component
function PengajuanDetailModal({ isOpen, onClose, pengajuanData }: PengajuanDetailModalProps) {
    const [isClosing, setIsClosing] = useState(false);

    // Lock body scroll when dialog is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsClosing(false);
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    // Handle animated close
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 200); // Match animation duration
    };

    if (!isOpen || !pengajuanData) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'Disetujui':
                return {
                    text: 'Disetujui',
                    color: 'text-green-800',
                    bgColor: 'bg-green-100',
                    icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )
                };
            case 'Ditolak':
                return {
                    text: 'Ditolak',
                    color: 'text-red-800',
                    bgColor: 'bg-red-100',
                    icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    )
                };
            default:
                return {
                    text: 'Sedang Diverifikasi',
                    color: 'text-yellow-800',
                    bgColor: 'bg-yellow-100',
                    icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                    )
                };
        }
    };

    const statusInfo = getStatusInfo(pengajuanData.status);

    return (
        <div 
            className={`fixed inset-0 backdrop-blur-xs backdrop-brightness-90 flex items-center justify-center z-[9999] p-4 transition-all duration-200 ${
                isClosing ? 'animate-out fade-out' : 'animate-in fade-in'
            }`}
            onClick={handleBackdropClick}
        >
            <div className={`bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transition-all duration-200 ${
                isClosing ? 'animate-out zoom-out-95' : 'animate-in zoom-in-95'
            }`}>
                {/* Header */}
                <div className="bg-purple-600 text-white p-6 rounded-t-2xl relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <h2 className="text-2xl font-bold mb-2">Detail Pengajuan</h2>
                    <p className="text-purple-100">{pengajuanData.jenis_pengajuan}</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status Section */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${statusInfo.bgColor} rounded-full flex items-center justify-center ${statusInfo.color}`}>
                                {statusInfo.icon}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Status Pengajuan</p>
                                <p className={`text-sm ${statusInfo.color}`}>{statusInfo.text}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Tanggal Pengajuan</p>
                            <p className="font-medium text-gray-900">{pengajuanData.tanggal}</p>
                        </div>
                    </div>

                    {/* Pengajuan Details */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Pengajuan</label>
                            <p className="bg-gray-50 p-3 rounded-lg text-gray-900">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {pengajuanData.jenis_pengajuan}
                                </span>
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Program</label>
                            <p className="bg-gray-50 p-3 rounded-lg text-gray-900">{pengajuanData.nama}</p>
                        </div>

                        {pengajuanData.deskripsi && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                                <p className="bg-gray-50 p-3 rounded-lg text-gray-900">{pengajuanData.deskripsi}</p>
                            </div>
                        )}

                        {pengajuanData.institusi && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Institusi</label>
                                <p className="bg-gray-50 p-3 rounded-lg text-gray-900">{pengajuanData.institusi}</p>
                            </div>
                        )}

                        {pengajuanData.periode && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Periode Program</label>
                                <p className="bg-gray-50 p-3 rounded-lg text-gray-900">{pengajuanData.periode}</p>
                            </div>
                        )}
                    </div>

                    {/* Catatan Section */}
                    {pengajuanData.catatan && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {pengajuanData.status === 'Disetujui' ? 'Catatan Persetujuan' : pengajuanData.status === 'Ditolak' ? 'Catatan Penolakan' : 'Catatan Verifikasi'}
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-900">{pengajuanData.catatan}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ClientDashboard({ 
    user, 
    stats, 
    riwayat_pengajuan, 
    program_saya 
}: Readonly<ClientDashboardProps>) {
    const [selectedPengajuan, setSelectedPengajuan] = useState<PengajuanItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sample data untuk riwayat pengajuan jika tidak ada data dari server
    const sampleRiwayatPengajuan: PengajuanItem[] = riwayat_pengajuan && riwayat_pengajuan.length > 0 ? riwayat_pengajuan : [
        {
            id: 1,
            tanggal: '15 Agustus 2024',
            jenis_pengajuan: 'Sertifikasi',
            nama: 'Sertifikasi Web Developer Professional',
            status: 'Disetujui',
            deskripsi: 'Program sertifikasi untuk mengembangkan keahlian dalam pembuatan aplikasi web modern menggunakan teknologi terkini.',
            institusi: 'Lembaga Sertifikasi Teknologi Indonesia',
            periode: '15 Agustus 2024 - 15 November 2024',
            catatan: 'Selamat! Pengajuan Anda telah disetujui. Silakan cek email untuk informasi lebih lanjut mengenai jadwal dan materi pembelajaran.'
        },
        {
            id: 2,
            tanggal: '10 Agustus 2024',
            jenis_pengajuan: 'PKL',
            nama: 'PKL Frontend Development - PT Teknologi Maju',
            status: 'Sedang Diverifikasi',
            deskripsi: 'Program magang untuk mengembangkan keahlian frontend development di perusahaan teknologi terkemuka.',
            institusi: 'PT Teknologi Maju',
            periode: '1 September 2024 - 30 November 2024',
            catatan: 'Pengajuan sedang dalam tahap verifikasi oleh tim akademik. Estimasi proses 3-5 hari kerja.'
        },
        {
            id: 3,
            tanggal: '05 Agustus 2024',
            jenis_pengajuan: 'Sertifikasi',
            nama: 'Sertifikasi Mobile App Development',
            status: 'Disetujui',
            deskripsi: 'Sertifikasi pengembangan aplikasi mobile untuk platform Android dan iOS.',
            institusi: 'Lembaga Sertifikasi Teknologi Indonesia',
            periode: '5 Agustus 2024 - 5 November 2024',
            catatan: 'Pengajuan disetujui. Silakan bergabung dengan grup WhatsApp untuk koordinasi lebih lanjut.'
        },
        {
            id: 4,
            tanggal: '28 Juli 2024',
            jenis_pengajuan: 'PKL',
            nama: 'PKL UI/UX Design - PT Digital Creative',
            status: 'Ditolak',
            deskripsi: 'Program magang di bidang UI/UX Design untuk mengembangkan keahlian desain interface.',
            institusi: 'PT Digital Creative',
            periode: '1 Agustus 2024 - 31 Oktober 2024',
            catatan: 'Mohon maaf, pengajuan tidak dapat disetujui karena kuota peserta sudah penuh. Silakan ajukan kembali untuk periode berikutnya.'
        },
        {
            id: 5,
            tanggal: '20 Juli 2024',
            jenis_pengajuan: 'Sertifikasi',
            nama: 'Sertifikasi Database Administrator',
            status: 'Sedang Diverifikasi',
            deskripsi: 'Program sertifikasi untuk menguasai administrasi dan manajemen database.',
            institusi: 'Lembaga Sertifikasi Database Indonesia',
            periode: '1 Agustus 2024 - 1 November 2024',
            catatan: 'Dokumen persyaratan masih dalam tahap review. Mohon bersabar menunggu konfirmasi lebih lanjut.'
        }
    ];

    const handleDetailClick = (pengajuan: PengajuanItem) => {
        setSelectedPengajuan(pengajuan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPengajuan(null);
    };

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
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Riwayat Pengajuan</h2>
                        <p className="text-sm text-gray-600 mt-1">Lihat status pengajuan sertifikasi dan PKL Anda</p>
                    </div>
                    <div className="overflow-x-auto">
                        {sampleRiwayatPengajuan && sampleRiwayatPengajuan.length > 0 ? (
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
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sampleRiwayatPengajuan.map((item, index) => {
                                        let statusClasses = 'bg-gray-100 text-gray-800';
                                        if (item.status === 'Disetujui') {
                                            statusClasses = 'bg-green-100 text-green-800';
                                        } else if (item.status === 'Sedang Diverifikasi') {
                                            statusClasses = 'bg-yellow-100 text-yellow-800';
                                        } else if (item.status === 'Ditolak') {
                                            statusClasses = 'bg-red-100 text-red-800';
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => handleDetailClick(item)}
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
                </div>
            </div>

            {/* Pengajuan Detail Modal */}
            <PengajuanDetailModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                pengajuanData={selectedPengajuan}
            />
        </ClientAuthenticatedLayout>
    );
}
