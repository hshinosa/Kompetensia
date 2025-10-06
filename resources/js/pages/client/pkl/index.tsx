import { Head } from '@inertiajs/react';
import ClientAuthenticatedLayout from '@/layouts/ClientAuthenticatedLayout';

interface PosisiPKL {
    id: number;
    nama_posisi: string;
    kategori: string;
    deskripsi: string;
    persyaratan: string[] | string;
    benefits: string[] | string;
    tipe: string;
    durasi_bulan: number;
    jumlah_pendaftar: number;
    status: string;
    created_by?: number;
    created_at?: string;
    updated_at?: string;
    // Additional registration fields
    registration_id?: number;
    registration_status?: string;
    tanggal_pendaftaran?: string;
}

interface ClientPKLProps {
    pklPrograms: PosisiPKL[];
}

export default function ClientPKL({ pklPrograms = [] }: ClientPKLProps) {
    // Debug: Log the pklPrograms data
    // Ensure pklPrograms is an array
    const programsArray = Array.isArray(pklPrograms) ? pklPrograms : [];

    return (
        <ClientAuthenticatedLayout>
            <Head title="PKL" />
            
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Program PKL Saya</h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">Program PKL yang telah disetujui dan sedang Anda ikuti</p>
                    </div>
                    <a 
                        href="/pkl/tersedia" 
                        className="px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 text-white rounded-lg sm:rounded-xl hover:bg-purple-700 transition-colors font-semibold text-sm sm:text-base lg:text-lg text-center whitespace-nowrap"
                    >
                        Cari Program Baru
                    </a>
                </div>

                {/* PKL Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {programsArray.map((program: PosisiPKL) => (
                        <div 
                            key={program.id}
                            className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Card Content */}
                            <div className="p-3 sm:p-4">
                                <div className="bg-gradient-to-tl from-purple-400 to-purple-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white relative overflow-hidden min-h-[240px] sm:min-h-[280px] flex flex-col">
                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* Header */}
                                        <div className="mb-3 sm:mb-4">
                                            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{program.nama_posisi}</h3>
                                            <p className="text-purple-100 text-xs sm:text-sm leading-relaxed line-clamp-3">
                                                {program.deskripsi || 'Tidak ada deskripsi tersedia.'}
                                            </p>
                                        </div>

                                        {/* Category and Type Chips */}
                                        <div className="flex-grow">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <span className="px-3 py-1 border border-orange-400 text-white text-xs rounded-full bg-white/10 backdrop-blur-sm">
                                                    {program.kategori}
                                                </span>
                                                <span className="px-3 py-1 border border-orange-400 text-white text-xs rounded-full bg-white/10 backdrop-blur-sm">
                                                    {program.tipe}
                                                </span>
                                                <span className="px-3 py-1 border border-orange-400 text-white text-xs rounded-full bg-white/10 backdrop-blur-sm">
                                                    {program.durasi_bulan} bulan
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Button Section */}
                            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                                <a 
                                    href={`/client/pkl/${program.id}`}
                                    className="block w-full py-2.5 sm:py-3 bg-purple-600 text-white text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl hover:bg-purple-700 transition-colors text-center"
                                >
                                    Kelola Dokumen
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Empty State */}
                {pklPrograms.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Program PKL yang Disetujui</h3>
                        <p className="text-gray-500 mb-4">Anda belum memiliki pendaftaran PKL yang disetujui oleh admin.</p>
                        <a 
                            href="/pkl/tersedia" 
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Cari Program PKL
                        </a>
                    </div>
                )}
            </div>
        </ClientAuthenticatedLayout>
    );
}
