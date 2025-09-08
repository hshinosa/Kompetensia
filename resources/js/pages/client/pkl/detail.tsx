import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ClientAuthenticatedLayout from '@/layouts/ClientAuthenticatedLayout';

interface PKLDetailProps {
    readonly pkl?: {
        id: number;
        nama: string;
        deskripsi: string;
    };
}

export default function PKLDetail({ pkl }: PKLDetailProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [jenisDocument, setJenisDocument] = useState<string>('');
    
    // Sample data untuk riwayat dokumen
    const sampleRiwayat = [
        {
            no: 1,
            tanggal: '2024-08-15',
            jenis_dokumen: 'Proposal PKL',
            dokumen: 'proposal_pkl.pdf',
            disetujui: true,
            keterangan: 'Dokumen disetujui'
        },
        {
            no: 2,
            tanggal: '2024-08-20',
            jenis_dokumen: 'Laporan Mingguan',
            dokumen: 'laporan_minggu_1.pdf',
            disetujui: true,
            keterangan: 'Laporan lengkap'
        },
        {
            no: 3,
            tanggal: '2024-08-27',
            jenis_dokumen: 'Laporan Mingguan',
            dokumen: 'laporan_minggu_2.pdf',
            disetujui: false,
            keterangan: 'Perlu revisi format'
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-orange-400 transition-colors">
                                        <div className="space-y-1 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500">
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
                                                <p className="text-sm text-orange-600 font-medium">{selectedFile.name}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={!selectedFile || !jenisDocument}
                                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-4 focus:ring-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Riwayat</h2>
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
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Jenis Dokumen
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Dokumen
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Disetujui
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Keterangan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sampleRiwayat.map((item) => (
                                        <tr key={item.no}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.no}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {new Date(item.tanggal).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {item.jenis_dokumen}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                <button className="text-orange-600 hover:text-orange-800 hover:underline">
                                                    {item.dokumen}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    item.disetujui 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {item.disetujui ? 'Ya' : 'Tidak'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {item.keterangan}
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
        </ClientAuthenticatedLayout>
    );
}
