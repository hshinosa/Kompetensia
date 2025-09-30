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
    tanggal_mulai?: string;
    tanggal_selesai?: string;
}

interface ClientPKLProps {
    pklPrograms: PosisiPKL[];
}

export default function ClientPKL({ pklPrograms = [] }: ClientPKLProps) {
    // Debug: Log the pklPrograms data
    console.log('ClientPKL - pklPrograms:', pklPrograms);
    console.log('ClientPKL - pklPrograms type:', typeof pklPrograms);
    console.log('ClientPKL - is array:', Array.isArray(pklPrograms));

    // Ensure pklPrograms is an array
    const programsArray = Array.isArray(pklPrograms) ? pklPrograms : [];

    return (
        <ClientAuthenticatedLayout>
            <Head title="PKL" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Program PKL Saya</h1>
                        <p className="text-gray-600 mt-1">Program PKL yang telah disetujui dan sedang Anda ikuti</p>
                    </div>
                    <a 
                        href="/pkl/tersedia" 
                        className="px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold text-lg"
                    >
                        Cari Program Baru
                    </a>
                </div>

                {/* PKL Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programsArray.map((program: PosisiPKL) => (
                        <div 
                            key={program.id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-purple-300 transition-all"
                        >
                            {/* Image Placeholder */}
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                <div className="text-gray-400 text-center">
                                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm">Image Placeholder</p>
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.nama_posisi}</h3>
                                <p className="text-sm text-purple-600 mb-2">{program.kategori}</p>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    {program.deskripsi || 'Tidak ada deskripsi tersedia.'}
                                </p>
                                <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                                    <span>Durasi: {program.durasi_bulan} bulan</span>
                                    <span>Status: {program.registration_status}</span>
                                </div>
                                
                                {/* Registration Info */}
                                {program.tanggal_mulai && program.tanggal_selesai && (
                                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-xs text-green-800 font-medium mb-1">Periode PKL:</p>
                                        <p className="text-xs text-green-700">
                                            {new Date(program.tanggal_mulai).toLocaleDateString('id-ID')} - {new Date(program.tanggal_selesai).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                )}
                                
                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <a 
                                        href={`/client/pkl/${program.id}`}
                                        className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center text-sm"
                                    >
                                        Kelola Dokumen
                                    </a>
                                </div>
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
