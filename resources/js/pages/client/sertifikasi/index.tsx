import { Head, router } from '@inertiajs/react';
import ClientAuthenticatedLayout from '@/layouts/ClientAuthenticatedLayout';
import SertifikasiTerdaftarCard from '@/components/client/sertifikasi/SertifikasiTerdaftarCard';

interface SertifikasiTerdaftar {
    id: number;
    nama_sertifikasi: string;
    jenis_sertifikasi: string;
    deskripsi?: string;
    batch: string;
    tanggal_mulai?: string;
    status_pendaftaran: string;
    can_upload: boolean;
}

interface ClientSertifikasiProps {
    sertifikasiTerdaftar: SertifikasiTerdaftar[];
}

export default function ClientSertifikasi({ sertifikasiTerdaftar = [] }: ClientSertifikasiProps) {
    const handleDetailClick = (sertifikasi: SertifikasiTerdaftar) => {
        // Navigate to detail page for the selected certification with fallbacks
        try {
            router.visit(`/client/sertifikasi/${sertifikasi.id}`);
        } catch (error) {
            console.error('Router visit failed:', error);
            // Fallback to window.location
            window.location.href = `/client/sertifikasi/${sertifikasi.id}`;
        }
    };

    return (
        <ClientAuthenticatedLayout>
            <Head title="Kelas Sertifikasi Saya" />
            
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Kelas Sertifikasi Saya</h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">Kelola program sertifikasi yang telah Anda daftarkan dan disetujui</p>
                    </div>
                    <a 
                        href="/sertifikasi" 
                        className="px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 text-white rounded-lg sm:rounded-xl hover:bg-purple-700 transition-colors font-semibold text-sm sm:text-base lg:text-lg text-center whitespace-nowrap"
                    >
                        Lihat Program Tersedia
                    </a>
                </div>

                {/* Sertifikasi Cards Grid */}
                {sertifikasiTerdaftar.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {sertifikasiTerdaftar.map((sertifikasi) => (
                            <SertifikasiTerdaftarCard
                                key={sertifikasi.id}
                                sertifikasi={sertifikasi}
                                onDetailClick={handleDetailClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 sm:py-12 px-4">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Belum ada kelas sertifikasi yang disetujui</h3>
                        <p className="text-sm sm:text-base text-gray-500 mb-4">Daftar ke program sertifikasi terlebih dahulu dan tunggu persetujuan admin</p>
                        <a 
                            href="/sertifikasi" 
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Lihat Program Sertifikasi
                        </a>
                    </div>
                )}
            </div>
        </ClientAuthenticatedLayout>
    );
}
