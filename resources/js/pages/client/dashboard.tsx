import { Head } from '@inertiajs/react';
import ClientAuthenticatedLayout from '@/layouts/ClientAuthenticatedLayout';
import { useState, useEffect } from 'react';
import StatCard from '@/components/clients/dashboard/StatCard';
import PengajuanDetailModal, { PengajuanItem, DetailedRegistrationData } from '@/components/clients/dashboard/PengajuanDetailModal';
import RiwayatPengajuanTable from '@/components/clients/dashboard/RiwayatPengajuanTable';

interface DashboardStats {
    sertifikasi_selesai: number;
    program_aktif: number;
    pengajuan_diproses: number;
    total_program: number;
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
    foto_profil?: string;
    profile_completion_percentage: number;
    aktif: boolean;
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
    const [selectedPengajuan, setSelectedPengajuan] = useState<PengajuanItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailedData, setDetailedData] = useState<DetailedRegistrationData | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    // Function to fetch detailed registration data
    const fetchDetailedData = async (pengajuan: PengajuanItem) => {
        setIsLoadingDetail(true);
        setDetailedData(null);
        
        try {
            const isSerifikasi = pengajuan.jenis_pengajuan.toLowerCase().includes('sertifikasi');
            
            const endpoint = isSerifikasi 
                ? `/client/pendaftaran-sertifikasi/${pengajuan.id}/detail`
                : `/client/pendaftaran-pkl/${pengajuan.id}/detail`;
            
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                credentials: 'same-origin',
            });
            
            if (response.ok) {
                const result = await response.json();
                
                if (result.success) {
                    setDetailedData(result.data);
                }
            }
        } catch (error) {
            // Error handled silently
        } finally {
            setIsLoadingDetail(false);
        }
    };

    // Use actual riwayat_pengajuan from props or empty array
    const pengajuanItems: PengajuanItem[] = riwayat_pengajuan ?? [];
    // Compute number of submissions currently being processed
    const processedCount = pengajuanItems.filter(item => item.status === 'Sedang Diverifikasi').length;

    const handleDetailClick = (pengajuan: PengajuanItem) => {
        setSelectedPengajuan(pengajuan);
        setIsModalOpen(true);
        // Fetch detailed data when modal opens
        fetchDetailedData(pengajuan);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPengajuan(null);
        setDetailedData(null);
        setIsLoadingDetail(false);
    };

    return (
        <ClientAuthenticatedLayout>
            <Head title="Dashboard" />
            
            <div className="space-y-6 sm:space-y-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <StatCard
                        href="/client/sertifikasi"
                        label="Sertifikasi Selesai"
                        value={stats?.sertifikasi_selesai || 0}
                        icon={
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        iconBgColor="bg-purple-100"
                    />

                    <StatCard
                        href="/client/sertifikat-saya"
                        label="Sertifikat Saya"
                        value={stats?.sertifikasi_selesai || 0}
                        icon={
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        }
                        iconBgColor="bg-green-100"
                    />

                    <StatCard
                        label="Program Aktif"
                        value={stats?.program_aktif || 0}
                        icon={
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        }
                        iconBgColor="bg-orange-100"
                    />

                    <StatCard
                        label="Pengajuan Diproses"
                        value={processedCount}
                        icon={
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        iconBgColor="bg-blue-100"
                    />
                </div>

                {/* Riwayat Pengajuan Table */}
                <div className="bg-white rounded-lg sm:rounded-xl border-2 border-purple-300 overflow-hidden shadow-sm">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Riwayat Pengajuan</h2>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Lihat status pengajuan sertifikasi dan PKL Anda</p>
                    </div>
                    <RiwayatPengajuanTable 
                        pengajuanItems={pengajuanItems}
                        onDetailClick={handleDetailClick}
                    />
                </div>
            </div>

            {/* Pengajuan Detail Modal */}
            <PengajuanDetailModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                pengajuanData={selectedPengajuan}
                detailedData={detailedData}
                isLoadingDetail={isLoadingDetail}
            />
        </ClientAuthenticatedLayout>
    );
}
