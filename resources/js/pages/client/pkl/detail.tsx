import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ClientAuthenticatedLayout from '@/layouts/ClientAuthenticatedLayout';

interface PKLDetailProps {
    readonly pkl?: {
        id: number;
        nama: string;
        deskripsi: string;
    };
}

interface RiwayatItem {
    no: number;
    tanggal: string;
    jenis_dokumen: string;
    dokumen: string;
    disetujui: boolean;
    keterangan: string;
    feedback?: string;
    assessor?: string;
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

    const getStatusInfo = (disetujui: boolean) => {
        if (disetujui) {
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
        } else {
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

export default function PKLDetail({ pkl }: PKLDetailProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [jenisDocument, setJenisDocument] = useState<string>('');
    const [selectedDocument, setSelectedDocument] = useState<RiwayatItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Sample data untuk riwayat dokumen
    const sampleRiwayat: RiwayatItem[] = [
        {
            no: 1,
            tanggal: '2024-08-15',
            jenis_dokumen: 'Proposal PKL',
            dokumen: 'proposal_pkl.pdf',
            disetujui: true,
            keterangan: 'Dokumen disetujui',
            feedback: 'Proposal PKL sudah sesuai dengan format yang diminta. Rencana kegiatan dan timeline jelas.',
            assessor: 'Dr. Budi Santoso, M.T'
        },
        {
            no: 2,
            tanggal: '2024-08-20',
            jenis_dokumen: 'Laporan Mingguan',
            dokumen: 'laporan_minggu_1.pdf',
            disetujui: true,
            keterangan: 'Laporan lengkap',
            feedback: 'Laporan mingguan sudah detail dan sesuai dengan format. Progress kegiatan tercatat dengan baik.',
            assessor: 'Dr. Budi Santoso, M.T'
        },
        {
            no: 3,
            tanggal: '2024-08-27',
            jenis_dokumen: 'Laporan Mingguan',
            dokumen: 'laporan_minggu_2.pdf',
            disetujui: false,
            keterangan: 'Perlu revisi format',
            feedback: 'Format laporan perlu diperbaiki. Mohon tambahkan detail aktivitas harian dan kendala yang dihadapi.',
            assessor: 'Dr. Budi Santoso, M.T'
        }
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = () => {
        if (selectedFile && jenisDocument) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('jenis_dokumen', jenisDocument);
            
            // For now, just log the data - in a real app you'd submit to the server
            console.log('Uploading file:', selectedFile.name, 'Type:', jenisDocument);
            
            // Reset after upload
            setSelectedFile(null);
            setJenisDocument('');
            
            // In a real app, you would use Inertia's router.post() here
            // router.post(`/client/pkl/${pkl?.id}/upload`, formData);
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

    return (
        <ClientAuthenticatedLayout>
            <Head title={`${pkl?.nama || 'Detail'}`} />
            
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <a 
                        href="/client/pkl" 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </a>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {pkl?.nama || 'PKL lorem ipsum dolor sit amet'}
                        </h1>
                    </div>
                </div>

                {/* Upload Dokumen Section */}
                <div className="flex gap-6">
                    {/* Upload Form - Left Side */}
                    <div className="max-w-2xl flex-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
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
                                        onChange={(e) => setJenisDocument(e.target.value)}
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
                                                        onChange={handleFileChange}
                                                        accept=".pdf,.doc,.docx,.zip,.rar"
                                                        required
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PDF, DOC, ZIP up to 10MB</p>
                                            {selectedFile && (
                                                <p className="text-sm text-purple-600 font-medium">{selectedFile.name}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={!selectedFile || !jenisDocument}
                                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        Unggah Dokumen
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Review Card - Right Side */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 opacity-60 h-full">
                            <div className="space-y-6 h-full">
                                {/* Row 1: Thumbnail and PKL Title */}
                                <div className="flex items-center space-x-4">
                                    {/* Thumbnail */}
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    {/* PKL Title */}
                                    <div className="flex-1">
                                        <h3 className="text-gray-500 font-medium text-sm">PKL lorem ipsum dolor sit amet</h3>
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
                                    <label htmlFor="pkl-review-description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Deskripsi Review
                                    </label>
                                    <textarea
                                        id="pkl-review-description"
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

                {/* Riwayat Section */}
                <div className="bg-white rounded-xl border-2 border-purple-300 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Riwayat</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        {sampleRiwayat.length > 0 ? (
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
                                    {sampleRiwayat.map((item) => (
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
                                                    item.disetujui 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {item.disetujui ? 'Disetujui' : 'Ditolak'}
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
