import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ClientAuthenticatedLayout from '@/layouts/ClientAuthenticatedLayout';
import ChangeEmailModal from '@/components/client/pengaturan/ChangeEmailModal';
import ChangePasswordModal from '@/components/client/pengaturan/ChangePasswordModal';

export default function ClientPengaturan() {
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    return (
        <ClientAuthenticatedLayout>
            <Head title="Pengaturan" />
            
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nama Lengkap */}
                        <div>
                            <label htmlFor="namaLengkap" className="block text-sm font-medium text-gray-900 mb-2">
                                Nama Lengkap
                            </label>
                            <input
                                id="namaLengkap"
                                type="text"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-colors"
                                placeholder="Masukkan nama lengkap"
                            />
                        </div>

                        {/* Empty space for grid alignment */}
                        <div></div>

                        {/* Tanggal Lahir */}
                        <div>
                            <label htmlFor="tanggalLahir" className="block text-sm font-medium text-gray-900 mb-2">
                                Tanggal Lahir
                            </label>
                            <input
                                id="tanggalLahir"
                                type="date"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Jenis Kelamin */}
                        <div>
                            <label htmlFor="jenisKelamin" className="block text-sm font-medium text-gray-900 mb-2">
                                Jenis Kelamin
                            </label>
                            <select id="jenisKelamin" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-colors">
                                <option value="">Pilih jenis kelamin</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>

                        {/* No Telepon */}
                        <div>
                            <label htmlFor="noTelepon" className="block text-sm font-medium text-gray-900 mb-2">
                                No Telepon
                            </label>
                            <input
                                id="noTelepon"
                                type="tel"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-colors"
                                placeholder="Masukkan nomor telepon"
                            />
                        </div>

                        {/* Domisili */}
                        <div>
                            <label htmlFor="domisili" className="block text-sm font-medium text-gray-900 mb-2">
                                Domisili
                            </label>
                            <input
                                id="domisili"
                                type="text"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-colors"
                                placeholder="Masukkan domisili"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="px-6 py-3 bg-white border-2 border-orange-400 text-black rounded-xl hover:bg-orange-50 hover:border-orange-500 transition-colors font-semibold"
                        >
                            Ubah Kata Sandi
                        </button>
                        <button
                            onClick={() => setIsEmailModalOpen(true)}
                            className="px-6 py-3 bg-white border-2 border-orange-400 text-black rounded-xl hover:bg-orange-50 hover:border-orange-500 transition-colors font-semibold"
                        >
                            Ubah Email
                        </button>
                        <div className="flex-1"></div>
                        <button className="px-8 py-3 bg-purple-700 text-white rounded-xl hover:bg-purple-800 transition-colors font-semibold">
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ChangeEmailModal 
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
            />
            <ChangePasswordModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </ClientAuthenticatedLayout>
    );
}
