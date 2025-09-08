import { Head } from '@inertiajs/react';
import ClientAuthenticatedLayout from '@/layouts/ClientAuthenticatedLayout';

interface SertifikasiProgram {
    id: number;
    nama: string;
    deskripsi: string;
    batch: string;
    tanggal: string;
    peserta: number;
    progress: number;
    image?: string;
}

export default function ClientSertifikasi() {
    // Sample data sementara - sesuai dengan mockup
    const sampleSertifikasi: SertifikasiProgram[] = [
        {
            id: 1,
            nama: 'Lorem ipsum dolor sit amet, consectetur adipiscing...',
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            batch: 'Batch 1',
            tanggal: '24 Juli 2025',
            peserta: 25,
            progress: 0
        },
        {
            id: 2,
            nama: 'Lorem ipsum dolor sit amet, consectetur adipiscing...',
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            batch: 'Batch 2',
            tanggal: '15 Agustus 2025',
            peserta: 30,
            progress: 45
        },
        {
            id: 3,
            nama: 'Lorem ipsum dolor sit amet, consectetur adipiscing...',
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            batch: 'Batch 3',
            tanggal: '10 September 2025',
            peserta: 20,
            progress: 80
        },
        {
            id: 4,
            nama: 'Lorem ipsum dolor sit amet, consectetur adipiscing...',
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            batch: 'Batch 4',
            tanggal: '05 Oktober 2025',
            peserta: 28,
            progress: 0
        },
        {
            id: 5,
            nama: 'Lorem ipsum dolor sit amet, consectetur adipiscing...',
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            batch: 'Batch 5',
            tanggal: '20 Oktober 2025',
            peserta: 35,
            progress: 25
        },
        {
            id: 6,
            nama: 'Lorem ipsum dolor sit amet, consectetur adipiscing...',
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            batch: 'Batch 6',
            tanggal: '15 November 2025',
            peserta: 22,
            progress: 0
        }
    ];

    return (
        <ClientAuthenticatedLayout>
            <Head title="Sertifikasi" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Sertifikasi</h1>
                        <p className="text-gray-600 mt-1">Kelola program sertifikasi Anda</p>
                    </div>
                    <a 
                        href="/sertifikasi" 
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold"
                    >
                        Lihat Program Tersedia
                    </a>
                </div>

                {/* Sertifikasi Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sampleSertifikasi.map((sertifikasi) => (
                        <a 
                            key={sertifikasi.id} 
                            href={`/client/sertifikasi/${sertifikasi.id}`}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer block"
                        >
                            {/* Image Placeholder */}
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                <div className="text-gray-400 text-center">
                                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm">Image Placeholder</p>
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">{sertifikasi.deskripsi}</p>
                                
                                {/* Batch, Date, and Participants */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span className="ml-1">{sertifikasi.batch}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="ml-1">{sertifikasi.tanggal}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="ml-1">{sertifikasi.peserta}</span>
                                    </div>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="flex justify-between items-center">
                                    <div className="flex-1 mr-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-purple-600 h-2 rounded-full transition-all" 
                                                style={{ width: `${sertifikasi.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium">{sertifikasi.progress}%</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </ClientAuthenticatedLayout>
    );
}
