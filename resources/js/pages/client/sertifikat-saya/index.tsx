import React from 'react';
import { Head } from '@inertiajs/react';
import ClientAuthenticatedLayout from '@/layouts/ClientAuthenticatedLayout';

interface Certificate {
    id: number;
    nama_program: string;
    jenis_program: 'Sertifikasi' | 'PKL';
    tanggal_selesai: string;
    badge_color: string;
    link_sertifikat: string;
    catatan_admin?: string;
    penerbit: {
        name: string;
    };
}

interface Props {
    certificates: Certificate[];
}

export default function ClientSertifikatSaya({ certificates }: Props) {
    const handleViewCertificate = (link: string) => {
        window.open(link, '_blank');
    };

    // Debug: Log received data
    React.useEffect(() => {
        }, [certificates]);

    return (
        <ClientAuthenticatedLayout>
            <Head title="Sertifikat Saya" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Sertifikat Saya</h1>
                        <p className="text-gray-600 mt-1">Lihat semua sertifikat yang telah Anda peroleh</p>
                    </div>
                </div>

                {/* Certificates Grid */}
                {certificates.length === 0 ? (
                    <div className="bg-white rounded-xl border-2 border-purple-200 p-12 text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Sertifikat</h3>
                        <p className="text-gray-600">Anda belum memiliki sertifikat yang diterbitkan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map((certificate) => (
                            <div key={certificate.id} className="bg-white rounded-xl border-2 border-purple-200 p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${certificate.badge_color}`}>
                                        {certificate.jenis_program}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{certificate.nama_program}</h3>
                                <p className="text-sm text-gray-600 mb-1">Tanggal Selesai: {new Date(certificate.tanggal_selesai).toLocaleDateString('id-ID')}</p>
                                <p className="text-xs text-gray-500 mb-4">Diterbitkan oleh: {certificate.penerbit.name}</p>
                                {certificate.catatan_admin && (
                                    <p className="text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded italic">"{certificate.catatan_admin}"</p>
                                )}
                                
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Selesai
                                    </span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleViewCertificate(certificate.link_sertifikat)}
                                            className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                        >
                                            Lihat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ClientAuthenticatedLayout>
    );
}