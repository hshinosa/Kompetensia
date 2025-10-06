import React from 'react';
import { router, Link } from '@inertiajs/react';

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

interface Props {
    sertifikasi: SertifikasiTerdaftar;
    onDetailClick?: (sertifikasi: SertifikasiTerdaftar) => void;
}

export default function SertifikasiTerdaftarCard({ sertifikasi, onDetailClick }: Props) {
    // Placeholder images berdasarkan kategori
    const getPlaceholderImage = (kategori: string) => {
        const placeholders = {
            'Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
            'Digital Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
            'Programming': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
            'Design': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
            'BNSP': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
            'Industri': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
            'default': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80'
        };
        
        return placeholders[kategori as keyof typeof placeholders] || placeholders.default;
    };

    const imageUrl = getPlaceholderImage(sertifikasi.jenis_sertifikasi);

    const handleDetailClick = () => {
        if (onDetailClick) {
            onDetailClick(sertifikasi);
        } else {
            // Navigate to detail page with multiple fallback methods
            try {
                router.visit(`/client/sertifikasi/${sertifikasi.id}`);
            } catch (error) {
                // Fallback to window.location
                window.location.href = `/client/sertifikasi/${sertifikasi.id}`;
            }
        }
    };

    // Determine mentor name based on certification type
    const getMentorName = (jenisSertifikasi: string) => {
        const mentors = {
            'Digital Marketing': 'Alyssa',
            'Marketing': 'Alyssa',
            'Programming': 'Dr. Budi Santoso',
            'Design': 'Sarah Designer',
            'BNSP': 'Prof. Ahmad',
            'Industri': 'Rizki Pratama'
        };
        
        return mentors[jenisSertifikasi as keyof typeof mentors] || 'Instruktur Profesional';
    };

    const mentorName = getMentorName(sertifikasi.jenis_sertifikasi);

    return (
        <article className="border-2 border-purple-400 rounded-xl overflow-hidden bg-white flex flex-col hover:shadow-lg hover:border-purple-600 transition-all duration-300 h-[420px]">
            <div className="relative">
                <img 
                    src={imageUrl} 
                    alt={sertifikasi.nama_sertifikasi} 
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                        e.currentTarget.src = getPlaceholderImage('default');
                    }}
                />
                <span className="absolute left-3 top-3 text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-semibold">
                    {sertifikasi.jenis_sertifikasi}
                </span>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem] text-gray-900">
                    {sertifikasi.nama_sertifikasi}
                </h3>
                
                <div className="text-sm text-gray-600 mb-3 min-h-[2.5rem] flex items-start">
                    {sertifikasi.batch} • {sertifikasi.tanggal_mulai || '25 April 2025'}
                </div>

                <div className="flex items-center gap-3 mb-4 mt-auto">
                    <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}&background=8B5CF6&color=fff`} 
                        alt="mentor" 
                        className="w-8 h-8 rounded-full border-2 border-white" 
                    />
                    <div className="text-sm font-medium line-clamp-1 text-gray-900">{mentorName}</div>
                </div>

                <div className="flex gap-3">
                    {/* Simple direct link */}
                    <a
                        href={`/client/sertifikasi/${sertifikasi.id}`}
                        className="flex-1 px-3 py-2 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors text-center no-underline"
                    >
                        Detail Skema
                    </a>
                </div>
            </div>
        </article>
    );
}