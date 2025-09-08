import { Head } from '@inertiajs/react';
import ClientAuthenticatedLayout from '@/layouts/ClientAuthenticatedLayout';

interface PKLProgram {
    id: number;
    nama: string;
    deskripsi: string;
    image?: string;
}

export default function ClientPKL() {
    // Sample data sementara - sesuai dengan mockup
    const samplePKL: PKLProgram[] = [
        {
            id: 1,
            nama: 'Praktik Kerja Lapangan',
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            id: 2,
            nama: 'Praktik Kerja Lapangan',
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            id: 3,
            nama: 'Praktik Kerja Lapangan',
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            id: 4,
            nama: 'Praktik Kerja Lapangan',
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            id: 5,
            nama: 'Praktik Kerja Lapangan',
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            id: 6,
            nama: 'Praktik Kerja Lapangan',
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ];

    return (
        <ClientAuthenticatedLayout>
            <Head title="PKL" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Praktik Kerja Lapangan</h1>
                        <p className="text-gray-600 mt-1">Kelola program PKL Anda</p>
                    </div>
                    <a 
                        href="/pkl/tersedia" 
                        className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-semibold"
                    >
                        Lihat Program Tersedia
                    </a>
                </div>

                {/* PKL Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {samplePKL.map((pkl) => (
                        <a 
                            key={pkl.id} 
                            href={`/client/pkl/${pkl.id}`}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer block"
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
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">{pkl.nama}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{pkl.deskripsi}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </ClientAuthenticatedLayout>
    );
}
