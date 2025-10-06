import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ClientAuthenticatedLayout from '@/layouts/ClientAuthenticatedLayout';

interface PKLDetailProps {
    readonly pkl?: {
        id: number;
        nama_posisi: string;
        kategori: string;
        deskripsi: string;
        tipe: string;
        durasi_bulan: number;
    };
    readonly pendaftaran?: {
        id: number;
        status: string;
    };
    readonly uploadedDocuments?: RiwayatItem[];
    readonly existingReview?: {
        id: number;
        rating: number;
        review: string;
        created_at: string;
    } | null;
}

interface RiwayatItem {
    no: number;
    tanggal: string;
    jenis_dokumen: string;
    dokumen: string;
    disetujui: boolean | null;
    status: string;
    keterangan: string;
    feedback?: string;
    assessor?: string;
    link_url?: string;
}

interface DocumentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentData: RiwayatItem | null;
}

// Document Detail Modal Component
function DocumentDetailModal({ isOpen, onClose, documentData }: DocumentDetailModalProps) {
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

    if (!isOpen || !documentData) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const getStatusInfo = (disetujui: boolean | null) => {
        if (disetujui === true) {
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
        } else if (disetujui === false) {
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
        } else {
            return {
                text: 'Belum Dinilai',
                color: 'text-gray-800',
                bgColor: 'bg-gray-100',
                icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                )
            };
        }
    };

    const statusInfo = getStatusInfo(documentData.disetujui);

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
                    
                    <h2 className="text-2xl font-bold mb-2">Detail Dokumen</h2>
                    <p className="text-purple-100">{documentData.jenis_dokumen}</p>
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
                                <p className="font-medium text-gray-900">Status Dokumen</p>
                                <p className={`text-sm ${statusInfo.color}`}>{statusInfo.text}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Tanggal Upload</p>
                            <p className="font-medium text-gray-900">
                                {new Date(documentData.tanggal).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Document Details */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Dokumen</label>
                            <p className="bg-gray-50 p-3 rounded-lg text-gray-900">{documentData.jenis_dokumen}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">File Dokumen</label>
                            <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-gray-900">{documentData.dokumen}</p>
                                        <p className="text-sm text-gray-500">Dokumen PKL</p>
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

                        {documentData.link_url && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
                                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                                    <a href={documentData.link_url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 underline break-all">
                                        {documentData.link_url}
                                    </a>
                                    <button 
                                        onClick={() => window.open(documentData.link_url, '_blank')}
                                        className="ml-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Buka
                                    </button>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                            <p className="bg-gray-50 p-3 rounded-lg text-gray-900">{documentData.keterangan}</p>
                        </div>
                    </div>

                    {/* Feedback Section */}
                    {documentData.feedback && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {documentData.disetujui ? 'Feedback Persetujuan' : 'Feedback Penolakan'}
                            </h3>
                            <div className="space-y-3">
                                {documentData.assessor && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer</label>
                                        <p className="text-gray-900">{documentData.assessor}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Feedback</label>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-900">{documentData.feedback}</p>
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

export default function PKLDetail({ pkl, pendaftaran, uploadedDocuments = [], existingReview = null }: PKLDetailProps) {
    const { props } = usePage<any>();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [jenisDocument, setJenisDocument] = useState<string>('');
    const [linkUrl, setLinkUrl] = useState<string>('');
    const [selectedDocument, setSelectedDocument] = useState<RiwayatItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    
    // Review states
    const [rating, setRating] = useState<number>(0);
    const [reviewText, setReviewText] = useState<string>('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    
    // Use actual uploaded documents data
    const riwayatDocuments: RiwayatItem[] = uploadedDocuments;
    
    // Check if user has approved "Laporan Akhir" document to enable review
    // PKL is considered completed when "Laporan Akhir" is approved
    const hasApprovedLaporanAkhir = riwayatDocuments.some(doc => 
        doc.jenis_dokumen === 'Laporan Akhir' && doc.disetujui === true
    );
    const isReviewEnabled = hasApprovedLaporanAkhir && !existingReview;
    const hasExistingReview = !!existingReview;

    // Handle flash messages from Laravel
    useEffect(() => {
        if (props.flash?.success) {
            setSuccessMessage(props.flash.success);
            setErrorMessage('');
            setTimeout(() => setSuccessMessage(''), 5000);
        }
        if (props.flash?.error) {
            setErrorMessage(props.flash.error);
            setSuccessMessage('');
        }
        if (props.errors && Object.keys(props.errors).length > 0) {
            const firstError = Object.values(props.errors)[0];
            if (Array.isArray(firstError)) {
                setErrorMessage(firstError[0]);
            } else if (typeof firstError === 'string') {
                setErrorMessage(firstError);
            }
            setSuccessMessage('');
        }
    }, [props.flash, props.errors]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (errorMessage) setErrorMessage('');
        }
    };

    const handleJenisDocumentChange = (value: string) => {
        setJenisDocument(value);
        if (errorMessage) setErrorMessage('');
    };

    const handleLinkUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLinkUrl(e.target.value);
        if (errorMessage) setErrorMessage('');
    };

    const handleSubmit = () => {
        setErrorMessage('');
        setSuccessMessage('');
        
        if (!jenisDocument) {
            setErrorMessage('Jenis dokumen harus dipilih');
            return;
        }
        
        if (!linkUrl.trim() && !selectedFile) {
            setErrorMessage('Anda harus mengisi link URL atau upload file');
            return;
        }
        
        if (pkl && pendaftaran) {
            setIsUploading(true);
            
            const formData = new FormData();
            if (selectedFile) {
                formData.append('file', selectedFile);
            }
            formData.append('jenis_dokumen', jenisDocument);
            if (linkUrl.trim()) {
                formData.append('link_url', linkUrl);
            }
            
            router.post(`/client/pkl/${pkl.id}/upload`, formData, {
                onSuccess: () => {
                    setSelectedFile(null);
                    setJenisDocument('');
                    setLinkUrl('');
                    setIsUploading(false);
                    setErrorMessage('');
                    setSuccessMessage('Dokumen berhasil diunggah! Dokumen Anda telah tersimpan dan siap untuk dinilai.');
                    
                    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                    
                    setTimeout(() => setSuccessMessage(''), 10000);
                },
                onError: () => {
                    setIsUploading(false);
                },
                onFinish: () => {
                    setIsUploading(false);
                }
            });
        }
    };

    const handleStatusClick = (document: RiwayatItem) => {
        setSelectedDocument(document);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDocument(null);
    };

    const handleRatingClick = (selectedRating: number) => {
        if (isReviewEnabled && !hasExistingReview) {
            setRating(selectedRating);
        }
    };

    const handleSubmitReview = () => {
        if (!isReviewEnabled || !rating || !reviewText.trim()) {
            setErrorMessage('Harap berikan rating dan ulasan sebelum mengirim.');
            return;
        }

        if (pkl) {
            setIsSubmittingReview(true);
            
            router.post(`/client/pkl/${pkl.id}/review`, {
                rating: rating,
                review: reviewText.trim()
            }, {
                onSuccess: () => {
                    setRating(0);
                    setReviewText('');
                    setIsSubmittingReview(false);
                    setErrorMessage('');
                    setSuccessMessage('✅ Ulasan berhasil dikirim! Terima kasih atas feedback Anda.');
                    setTimeout(() => setSuccessMessage(''), 8000);
                },
                onError: () => {
                    setIsSubmittingReview(false);
                    setErrorMessage('Gagal mengirim ulasan. Silakan coba lagi.');
                },
                onFinish: () => {
                    setIsSubmittingReview(false);
                }
            });
        }
    };

    return (
        <ClientAuthenticatedLayout>
            <Head title={`${pkl?.nama_posisi || 'Detail PKL'}`} />
            
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => router.visit('/client/pkl')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {pkl?.nama_posisi || 'PKL Program'}
                            </h1>
                            {hasApprovedLaporanAkhir && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-300">
                                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Lulus
                                </span>
                            )}
                        </div>
                        {pkl && (
                            <p className="text-gray-600 mt-1">
                                {pkl.kategori} • {pkl.tipe} • {pkl.durasi_bulan} bulan
                            </p>
                        )}
                    </div>
                </div>

                {/* Upload Section */}
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                    {/* Upload Form - Left Side (order-2 on mobile if passed, order-1 otherwise) */}
                    <div className={`max-w-2xl flex-1 relative ${hasApprovedLaporanAkhir ? 'order-2 lg:order-1' : 'order-1'}`}>
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            {/* Loading Overlay */}
                            {isUploading && (
                                <div className="absolute inset-0 bg-white bg-opacity-95 rounded-xl flex flex-col items-center justify-center z-10">
                                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-gray-900 mb-1">Mengunggah Dokumen...</p>
                                        <p className="text-sm text-gray-600">Mohon tunggu sebentar</p>
                                    </div>
                                    <div className="w-48 bg-purple-200 rounded-full h-2 mt-4">
                                        <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                                    </div>
                                </div>
                            )}
                            
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Unggah Dokumen</h2>
                            
                            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                                {/* Jenis Dokumen */}
                                <div>
                                    <label htmlFor="jenis-dokumen" className="block text-sm font-medium text-gray-700 mb-2">
                                        Jenis Dokumen *
                                    </label>
                                    <select 
                                        id="jenis-dokumen"
                                        value={jenisDocument}
                                        onChange={(e) => handleJenisDocumentChange(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Pilih jenis dokumen</option>
                                        <option value="proposal">Proposal PKL</option>
                                        <option value="laporan-mingguan">Laporan Mingguan</option>
                                        <option value="laporan-akhir">Laporan Akhir</option>
                                        <option value="evaluasi">Evaluasi</option>
                                    </select>
                                </div>

                                {/* Link URL */}
                                <div>
                                    <label htmlFor="link-url" className="block text-sm font-medium text-gray-700 mb-2">
                                        Link URL (opsional)
                                    </label>
                                    <input
                                        type="url"
                                        id="link-url"
                                        value={linkUrl}
                                        onChange={handleLinkUrlChange}
                                        placeholder="https://github.com/username/repository"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Masukkan link GitHub, portfolio, atau dokumentasi proyek
                                    </p>
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                                        Unggah File (opsional)
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-400 transition-colors">
                                        <div className="space-y-1 text-center">
                                            {!selectedFile ? (
                                                <>
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
                                                                onChange={handleFileChange}
                                                                accept=".pdf,.doc,.docx,.zip,.rar"
                                                            />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PDF, DOC, ZIP up to 10MB</p>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <svg className="mx-auto h-12 w-12 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="text-sm text-purple-600 font-medium mb-2">{selectedFile.name}</p>
                                                    <label htmlFor="file-upload" className="text-sm text-purple-600 hover:text-purple-700 cursor-pointer underline">
                                                        Change file
                                                        <input 
                                                            id="file-upload" 
                                                            name="file-upload" 
                                                            type="file" 
                                                            className="sr-only"
                                                            onChange={handleFileChange}
                                                            accept=".pdf,.doc,.docx,.zip,.rar"
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Helper Text */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-700">
                                        💡 Anda harus mengisi minimal salah satu antara Link URL atau Unggah File.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={!jenisDocument || (!linkUrl.trim() && !selectedFile) || isUploading}
                                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center"
                                    >
                                        {isUploading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Mengunggah...
                                            </>
                                        ) : (
                                            'Unggah Dokumen'
                                        )}
                                    </button>
                                </div>

                                {/* Response Messages */}
                                {errorMessage && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-sm text-red-800">{errorMessage}</p>
                                        </div>
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <div className="flex-1">
                                                <p className="text-sm text-green-800 font-medium">{successMessage}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!pendaftaran && (
                                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-yellow-800 text-sm">
                                            Anda perlu memiliki pendaftaran PKL yang disetujui untuk dapat mengunggah dokumen.
                                        </p>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Review Card - Right Side (order-1 on mobile if passed, order-2 otherwise) */}
                    <div className={`flex-1 ${hasApprovedLaporanAkhir ? 'order-1 lg:order-2' : 'order-2'}`}>
                        <div className={`bg-white rounded-xl border border-gray-200 p-6 h-full transition-all duration-300 ${isReviewEnabled ? 'opacity-100 border-green-300' : hasExistingReview ? 'opacity-100 border-orange-300' : 'opacity-60'}`}>
                            <div className="space-y-6 h-full">
                                {/* Status Indicator */}
                                {hasExistingReview && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm font-medium text-orange-800">Review Sudah Dikirim</span>
                                        </div>
                                        <p className="text-xs text-orange-600 mt-1">Anda telah mengirim ulasan pada {existingReview?.created_at}</p>
                                    </div>
                                )}
                                
                                {isReviewEnabled && !hasExistingReview && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm font-medium text-green-800">PKL Selesai - Review Tersedia</span>
                                        </div>
                                        <p className="text-xs text-green-600 mt-1">Laporan Akhir telah disetujui. Anda dapat memberikan ulasan!</p>
                                    </div>
                                )}
                                
                                {!isReviewEnabled && !hasExistingReview && (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-600">Review Terkunci</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Laporan Akhir harus disetujui terlebih dahulu</p>
                                    </div>
                                )}

                                {/* Row 1: Thumbnail and PKL Title */}
                                <div className="flex items-center space-x-4">
                                    {/* Thumbnail with Category-based Color */}
                                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                        pkl?.kategori === 'Content Creator' 
                                            ? 'bg-gradient-to-br from-purple-400 to-purple-600'
                                            : pkl?.kategori === 'Social Media Management'
                                                ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                                                : pkl?.kategori === 'Video Editor'
                                                    ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                                                    : pkl?.kategori === 'Graphic Designer'
                                                        ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                                                        : pkl?.kategori === 'Web Developer'
                                                            ? 'bg-gradient-to-br from-green-400 to-green-600'
                                                            : isReviewEnabled 
                                                                ? 'bg-green-100' 
                                                                : 'bg-gray-200'
                                    }`}>
                                        <svg className={`w-8 h-8 ${
                                            pkl?.kategori 
                                                ? 'text-white'
                                                : isReviewEnabled 
                                                    ? 'text-green-500' 
                                                    : 'text-gray-400'
                                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    {/* PKL Title with Category Badge */}
                                    <div className="flex-1">
                                        <h3 className={`font-medium text-sm mb-1 ${isReviewEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {pkl?.nama_posisi || 'Program PKL'}
                                        </h3>
                                        {pkl?.kategori && (
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                                pkl?.kategori === 'Content Creator' 
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : pkl?.kategori === 'Social Media Management'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : pkl?.kategori === 'Video Editor'
                                                            ? 'bg-pink-100 text-pink-700'
                                                            : pkl?.kategori === 'Graphic Designer'
                                                                ? 'bg-orange-100 text-orange-700'
                                                                : pkl?.kategori === 'Web Developer'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {pkl?.kategori}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Row 2: Rating */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isReviewEnabled || hasExistingReview ? 'text-gray-700' : 'text-gray-500'}`}>
                                        Rating
                                    </label>
                                    <div className="flex items-center space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className={`w-6 h-6 transition-colors ${
                                                    hasExistingReview 
                                                        ? (star <= (existingReview?.rating || 0) ? 'text-yellow-400' : 'text-gray-300')
                                                        : isReviewEnabled 
                                                            ? (star <= rating ? 'text-yellow-400 cursor-pointer hover:text-yellow-500' : 'text-gray-300 cursor-pointer hover:text-yellow-300')
                                                            : 'text-gray-300 cursor-not-allowed'
                                                }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                onClick={() => !hasExistingReview && handleRatingClick(star)}
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    {hasExistingReview && (
                                        <p className="text-xs text-orange-600 mt-1">Rating yang diberikan: {existingReview?.rating} dari 5 bintang</p>
                                    )}
                                    {rating > 0 && isReviewEnabled && !hasExistingReview && (
                                        <p className="text-xs text-gray-600 mt-1">Rating: {rating} dari 5 bintang</p>
                                    )}
                                </div>

                                {/* Row 3: Review Description */}
                                <div>
                                    <label htmlFor="review-description" className={`block text-sm font-medium mb-2 ${isReviewEnabled || hasExistingReview ? 'text-gray-700' : 'text-gray-500'}`}>
                                        Deskripsi Review
                                    </label>
                                    <textarea
                                        id="review-description"
                                        rows={4}
                                        value={hasExistingReview ? existingReview?.review || '' : reviewText}
                                        onChange={(e) => !hasExistingReview && isReviewEnabled && setReviewText(e.target.value)}
                                        placeholder={
                                            hasExistingReview 
                                                ? "Review Anda telah dikirim" 
                                                : isReviewEnabled 
                                                    ? "Bagikan pengalaman Anda dengan program PKL ini..." 
                                                    : "Lorem ipsum dolor sit amet"
                                        }
                                        className={`w-full px-4 py-3 border rounded-lg resize-none transition-colors ${
                                            hasExistingReview
                                                ? 'border-orange-300 bg-orange-50 text-gray-900 cursor-not-allowed'
                                                : isReviewEnabled 
                                                    ? 'border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent' 
                                                    : 'border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed'
                                        }`}
                                        disabled={!isReviewEnabled || hasExistingReview}
                                    />
                                    {hasExistingReview && (
                                        <p className="text-xs text-orange-600 mt-1">✓ Review telah dikirim dan tidak dapat diubah</p>
                                    )}
                                </div>

                                {/* Row 4: Submit Button */}
                                <div className="flex justify-end mt-auto">
                                    {hasExistingReview ? (
                                        <div className="px-6 py-3 rounded-lg font-medium bg-orange-100 text-orange-800 border border-orange-200 flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Review Sudah Dikirim
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleSubmitReview}
                                            disabled={!isReviewEnabled || !rating || !reviewText.trim() || isSubmittingReview}
                                            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
                                                isReviewEnabled && rating && reviewText.trim() && !isSubmittingReview
                                                    ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-200'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            {isSubmittingReview ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Mengirim...
                                                </>
                                            ) : (
                                                'Kirimkan Ulasan'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Riwayat Section */}
                <div className="bg-white rounded-xl border-2 border-purple-300 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Riwayat</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        {riwayatDocuments.length > 0 ? (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Jenis Dokumen
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
                                    {riwayatDocuments.map((item: RiwayatItem) => (
                                        <tr key={item.no}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.no}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.jenis_dokumen}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {new Date(item.tanggal).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    item.disetujui === true
                                                        ? 'bg-green-100 text-green-800' 
                                                        : item.disetujui === false
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {item.disetujui === true ? 'Disetujui' : item.disetujui === false ? 'Ditolak' : 'Belum Dinilai'}
                                                </span>
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
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-4xl mb-4">📄</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada riwayat dokumen</h3>
                                <p className="text-gray-600">Dokumen yang Anda unggah akan muncul di sini</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Document Detail Modal */}
            <DocumentDetailModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                documentData={selectedDocument}
            />
        </ClientAuthenticatedLayout>
    );
}
