import { Head, router } from '@inertiajs/react';
import ClientAuthenticatedLayout from '@/layouts/ClientAuthenticatedLayout';
import { useState, useEffect } from 'react';

interface SertifikasiData {
    id: number;
    nama: string;
    deskripsi: string;
    batch: string;
    tanggal: string;
    peserta: number;
    progress: number;
}

interface UploadHistory {
    id: number;
    judul_tugas: string;
    link_url: string;
    nama_file: string;
    tanggal_upload: string;
    status: 'pending' | 'approved' | 'rejected';
    feedback?: string;
    assessor?: string;
}

interface UploadDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    uploadData: UploadHistory | null;
}

// Upload Detail Modal Component
function UploadDetailModal({ isOpen, onClose, uploadData }: UploadDetailModalProps) {
    const [isClosing, setIsClosing] = useState(false);

    // Lock body scroll when dialog is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsClosing(false);
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    // Handle animated close
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 200); // Match animation duration
    };

    if (!isOpen || !uploadData) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'approved':
                return {
                    text: 'Disetujui',
                    color: 'text-green-800',
                    bgColor: 'bg-green-100',
                    icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )
                };
            case 'rejected':
                return {
                    text: 'Ditolak',
                    color: 'text-red-800',
                    bgColor: 'bg-red-100',
                    icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    )
                };
            default:
                return {
                    text: 'Menunggu Review',
                    color: 'text-yellow-800',
                    bgColor: 'bg-yellow-100',
                    icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                    )
                };
        }
    };

    const statusInfo = getStatusInfo(uploadData.status);

    return (
        <div 
            className={`fixed inset-0 backdrop-blur-xs backdrop-brightness-90 flex items-center justify-center z-[9999] p-4 transition-all duration-200 ${
                isClosing ? 'animate-out fade-out' : 'animate-in fade-in'
            }`}
            onClick={handleBackdropClick}
        >
            <div className={`bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transition-all duration-200 ${
                isClosing ? 'animate-out zoom-out-95' : 'animate-in zoom-in-95'
            }`}>
                {/* Header */}
                <div className="bg-purple-600 text-white p-6 rounded-t-2xl relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <h2 className="text-2xl font-bold mb-2">Detail Submisi</h2>
                    <p className="text-purple-100">{uploadData.judul_tugas}</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status Section */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${statusInfo.bgColor} rounded-full flex items-center justify-center ${statusInfo.color}`}>
                                {statusInfo.icon}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Status Submisi</p>
                                <p className={`text-sm ${statusInfo.color}`}>{statusInfo.text}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Tanggal Upload</p>
                            <p className="font-medium text-gray-900">
                                {new Date(uploadData.tanggal_upload).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Submission Details */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Judul Tugas</label>
                            <p className="bg-gray-50 p-3 rounded-lg text-gray-900">{uploadData.judul_tugas}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <a 
                                    href={uploadData.link_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:text-purple-800 underline break-all flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    {uploadData.link_url}
                                </a>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">File Dokumen</label>
                            <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-gray-900">{uploadData.nama_file}</p>
                                        <p className="text-sm text-gray-500">Dokumen submisi</p>
                                    </div>
                                </div>
                                <button className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Section */}
                    {(uploadData.status === 'approved' || uploadData.status === 'rejected') && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {uploadData.status === 'approved' ? 'Feedback Persetujuan' : 'Feedback Penolakan'}
                            </h3>
                            <div className="space-y-3">
                                {uploadData.assessor && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer</label>
                                        <p className="text-gray-900">{uploadData.assessor}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Feedback</label>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-900">{uploadData.feedback || 'Tidak ada catatan feedback.'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SertifikasiDetail({ sertifikasi }: { readonly sertifikasi?: SertifikasiData }) {
    const [formData, setFormData] = useState({
        judul_tugas: '',
        link_url: '',
        file: null as File | null
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedUpload, setSelectedUpload] = useState<UploadHistory | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sample data sementara
    const sampleSertifikasi: SertifikasiData = sertifikasi || {
        id: 1,
        nama: 'Lorem ipsum dolor sit amet, consectetur adipiscing...',
        deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        batch: 'Batch 1',
        tanggal: '24 Juli 2025',
        peserta: 25,
        progress: 45
    };

    const uploadHistory: UploadHistory[] = [
        {
            id: 1,
            judul_tugas: 'Implementasi Authentication System',
            link_url: 'https://github.com/user/auth-system',
            nama_file: 'auth_documentation.pdf',
            tanggal_upload: '2024-12-15',
            status: 'approved',
            feedback: 'Implementasi authentication sudah sangat baik. Kode clean dan dokumentasi lengkap. Penerapan JWT token dan middleware sudah sesuai best practice.',
            assessor: 'Dr. Ahmad Suryana, M.Kom'
        },
        {
            id: 2,
            judul_tugas: 'Database Design dan ERD',
            link_url: 'https://github.com/user/database-design',
            nama_file: 'database_design.pdf',
            tanggal_upload: '2024-12-10',
            status: 'pending'
        },
        {
            id: 3,
            judul_tugas: 'UI/UX Design Prototype',
            link_url: 'https://figma.com/design/prototype',
            nama_file: 'ui_prototype.fig',
            tanggal_upload: '2024-12-05',
            status: 'rejected',
            feedback: 'Design prototype perlu perbaikan pada bagian user flow dan konsistensi visual. Silakan perbaiki color scheme dan typography untuk lebih sesuai dengan brand guidelines.',
            assessor: 'Sarah Wijaya, S.Des'
        }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.judul_tugas.trim() || !formData.link_url.trim() || !formData.file) {
            alert('Semua field harus diisi');
            return;
        }

        setIsSubmitting(true);

        const submitData = new FormData();
        submitData.append('judul_tugas', formData.judul_tugas);
        submitData.append('link_url', formData.link_url);
        submitData.append('file', formData.file);

        try {
            router.post(`/client/sertifikasi/${sampleSertifikasi.id}/upload`, submitData, {
                onSuccess: () => {
                    setFormData({
                        judul_tugas: '',
                        link_url: '',
                        file: null
                    });
                    // Reset file input
                    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                },
                onError: (errors) => {
                    console.error('Upload failed:', errors);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                }
            });
        } catch (error) {
            console.error('Error uploading:', error);
            setIsSubmitting(false);
        }
    };

    const handleStatusClick = (upload: UploadHistory) => {
        setSelectedUpload(upload);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUpload(null);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Disetujui
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Ditolak
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Menunggu
                    </span>
                );
        }
    };

    return (
        <ClientAuthenticatedLayout>
            <Head title={`${sampleSertifikasi.nama}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => router.visit('/client/sertifikasi')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{sampleSertifikasi.nama}</h1>
                        <p className="text-gray-600 mt-1">{sampleSertifikasi.batch} • {sampleSertifikasi.tanggal}</p>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="flex gap-6">
                    {/* Upload Form - Left Side */}
                    <div className="max-w-2xl flex-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Unggah Tugas</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Judul Tugas */}
                                <div>
                                    <label htmlFor="judul-tugas" className="block text-sm font-medium text-gray-700 mb-2">
                                        Judul Tugas *
                                    </label>
                                    <input
                                        type="text"
                                        id="judul-tugas"
                                        value={formData.judul_tugas}
                                        onChange={(e) => setFormData(prev => ({ ...prev, judul_tugas: e.target.value }))}
                                        placeholder="Masukkan judul tugas"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Link URL */}
                                <div>
                                    <label htmlFor="link-url" className="block text-sm font-medium text-gray-700 mb-2">
                                        Link URL *
                                    </label>
                                    <input
                                        type="url"
                                        id="link-url"
                                        value={formData.link_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                                        placeholder="https://github.com/username/repository"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Masukkan link GitHub, portfolio, atau dokumentasi proyek
                                    </p>
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                                        Unggah File *
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-400 transition-colors">
                                        <div className="space-y-1 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                                                    <span>Upload a file</span>
                                                    <input 
                                                        id="file-upload" 
                                                        name="file-upload" 
                                                        type="file" 
                                                        className="sr-only"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0] || null;
                                                            setFormData(prev => ({ ...prev, file }));
                                                        }}
                                                        accept=".pdf,.doc,.docx,.zip,.rar"
                                                        required
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PDF, DOC, ZIP up to 10MB</p>
                                            {formData.file && (
                                                <p className="text-sm text-purple-600 font-medium">{formData.file.name}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        {isSubmitting ? 'Mengunggah...' : 'Unggah Tugas'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Review Card - Right Side */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 opacity-60 h-full">
                            <div className="space-y-6 h-full">
                                {/* Row 1: Thumbnail and Sertifikasi Title */}
                                <div className="flex items-center space-x-4">
                                    {/* Thumbnail */}
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    {/* Sertifikasi Title */}
                                    <div className="flex-1">
                                        <h3 className="text-gray-500 font-medium text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing...</h3>
                                    </div>
                                </div>

                                {/* Row 2: Rating */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rating
                                    </label>
                                    <div className="flex items-center space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className="w-6 h-6 text-gray-300 cursor-not-allowed"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>

                                {/* Row 3: Review Description */}
                                <div>
                                    <label htmlFor="review-description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Deskripsi Review
                                    </label>
                                    <textarea
                                        id="review-description"
                                        rows={4}
                                        placeholder="Lorem ipsum dolor sit amet"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed resize-none"
                                        disabled
                                    />
                                </div>

                                {/* Row 4: Submit Button */}
                                <div className="flex justify-end mt-auto">
                                    <button
                                        disabled
                                        className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium"
                                    >
                                        Kirimkan Ulasan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upload History */}
                <div className="bg-white rounded-xl border-2 border-purple-300 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Riwayat Upload</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        No
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Judul Tugas
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Tanggal Upload
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {uploadHistory.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.judul_tugas}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(item.tanggal_upload).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleStatusClick(item)}
                                                className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                            >
                                                Lihat Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {uploadHistory.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada tugas yang diunggah</h3>
                                <p className="mt-1 text-sm text-gray-500">Mulai unggah tugas Anda menggunakan form di atas.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Detail Modal */}
            <UploadDetailModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                uploadData={selectedUpload}
            />
        </ClientAuthenticatedLayout>
    );
}
