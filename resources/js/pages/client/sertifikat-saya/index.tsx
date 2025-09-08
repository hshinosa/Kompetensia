import { Head } from '@inertiajs/react';
import ClientAuthenticatedLayout from '@/layouts/ClientAuthenticatedLayout';

export default function ClientSertifikatSaya() {
    // Sample data sementara
    const sampleCertificates = [
        {
            id: 1,
            nama: 'Sertifikat Web Developer',
            jenis: 'Sertifikasi',
            tanggal_selesai: '2024-08-15',
            status: 'Selesai',
            badge_color: 'bg-purple-100 text-purple-800',
            file_url: '#'
        },
        {
            id: 2,
            nama: 'Sertifikat Mobile App Development',
            jenis: 'Sertifikasi',
            tanggal_selesai: '2024-07-20',
            status: 'Selesai',
            badge_color: 'bg-purple-100 text-purple-800',
            file_url: '#'
        },
        {
            id: 3,
            nama: 'Sertifikat PKL - PT Teknologi Maju',
            jenis: 'PKL',
            tanggal_selesai: '2024-06-30',
            status: 'Selesai',
            badge_color: 'bg-orange-100 text-orange-800',
            file_url: '#'
        }
    ];

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sampleCertificates.map((certificate) => (
                        <div key={certificate.id} className="bg-white rounded-xl border-2 border-purple-200 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${certificate.badge_color}`}>
                                    {certificate.jenis}
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{certificate.nama}</h3>
                            <p className="text-sm text-gray-600 mb-4">Tanggal Selesai: {new Date(certificate.tanggal_selesai).toLocaleDateString('id-ID')}</p>
                            
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {certificate.status}
                                </span>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                        Lihat
                                    </button>
                                    <button className="px-3 py-1.5 text-sm border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Summary */}
                <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Sertifikat</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">{sampleCertificates.filter(c => c.jenis === 'Sertifikasi').length}</p>
                            <p className="text-sm text-gray-600">Sertifikasi</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <p className="text-2xl font-bold text-orange-600">{sampleCertificates.filter(c => c.jenis === 'PKL').length}</p>
                            <p className="text-sm text-gray-600">PKL</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{sampleCertificates.length}</p>
                            <p className="text-sm text-gray-600">Total</p>
                        </div>
                    </div>
                </div>
            </div>
        </ClientAuthenticatedLayout>
    );
}