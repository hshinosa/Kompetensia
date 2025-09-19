import { Head } from '@inertiajs/react';
import ClientAuthenticatedLayout from '@/layouts/ClientAuthenticatedLayout';
import SertifikasiCard from '@/components/client/landing-page/SertifikasiCard';

interface SertifikasiProgram {
    id: number;
    title: string;
    batch: string;
    date: string;
    rating: string;
    peserta: number;
    kategori: string;
    img?: string;
    mentor: string;
    slug?: string;
    progress?: number;
}

export default function ClientSertifikasi() {
    // Sample data sementara - sesuai dengan format landing page
    const sampleSertifikasi: SertifikasiProgram[] = [
        {
            id: 1,
            title: 'Digital Marketing',
            batch: 'Batch 1',
            date: '24 Juli 2025',
            rating: '4.7',
            peserta: 25,
            kategori: 'Marketing',
            mentor: 'Alyssa Rahman',
            slug: 'digital-marketing',
            progress: 0
        },
        {
            id: 2,
            title: 'Junior Programmer',
            batch: 'Batch 2',
            date: '15 Agustus 2025',
            rating: '4.8',
            peserta: 30,
            kategori: 'Programming',
            mentor: 'Budi Santoso',
            slug: 'junior-programmer',
            progress: 45
        },
        {
            id: 3,
            title: 'UI/UX Designer',
            batch: 'Batch 3',
            date: '10 September 2025',
            rating: '4.6',
            peserta: 20,
            kategori: 'Design',
            mentor: 'Sarah Wijaya',
            slug: 'ui-ux-designer',
            progress: 80
        },
        {
            id: 4,
            title: 'Data Science',
            batch: 'Batch 4',
            date: '05 Oktober 2025',
            rating: '4.9',
            peserta: 28,
            kategori: 'Data Science',
            mentor: 'Dr. Ahmad Surya',
            slug: 'data-science',
            progress: 0
        },
        {
            id: 5,
            title: 'Content Creator',
            batch: 'Batch 5',
            date: '20 Oktober 2025',
            rating: '4.5',
            peserta: 35,
            kategori: 'Marketing',
            mentor: 'Maya Sari',
            slug: 'content-creator',
            progress: 25
        },
        {
            id: 6,
            title: 'Cyber Security',
            batch: 'Batch 6',
            date: '15 November 2025',
            rating: '4.8',
            peserta: 22,
            kategori: 'Technology',
            mentor: 'Rizki Pratama',
            slug: 'cyber-security',
            progress: 0
        }
    ];

    return (
        <ClientAuthenticatedLayout>
            <Head title="Sertifikasi" />
            
            <div className="container mx-auto px-4 py-10">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sampleSertifikasi.map((sertifikasi) => (
                            <SertifikasiCard
                                key={sertifikasi.id}
                                sertifikasi={sertifikasi}
                                onDetailClick={(sertifikasi) => {
                                    window.location.href = `/client/sertifikasi/${sertifikasi.id}`;
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </ClientAuthenticatedLayout>
    );
}
