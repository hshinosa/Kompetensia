import React, { useState, useEffect } from 'react';

type ModalView = 'main' | 'change-email' | 'change-password';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: Readonly<Props>) {
    const [currentView, setCurrentView] = useState<ModalView>('main');
    const [isClosing, setIsClosing] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Handle animated view changes
    const handleViewChange = (newView: ModalView) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentView(newView);
            setIsTransitioning(false);
        }, 150);
    };
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        username: '',
        email: '',
        nomor_telepon: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        alamat: '',
        current_password: '',
        new_password: '',
        confirm_password: '',
        new_email: ''
    });

    // Lock body scroll when dialog is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsClosing(false);
            setCurrentView('main'); // Reset to main view when opening
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
            setCurrentView('main');
        }, 200);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle main settings save
        console.log('Saving main settings:', formData);
        handleClose();
    };

    const handleChangeEmail = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle email change
        console.log('Changing email:', formData.new_email);
        handleViewChange('main');
    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle password change
        console.log('Changing password');
        handleViewChange('main');
    };

    if (!isOpen) return null;

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
                    
                    <div className="flex items-center gap-3">
                        {currentView !== 'main' && (
                            <button
                                onClick={() => handleViewChange('main')}
                                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold">
                                {currentView === 'main' && 'Pengaturan'}
                                {currentView === 'change-email' && 'Ubah Email'}
                                {currentView === 'change-password' && 'Ubah Kata Sandi'}
                            </h2>
                            <p className="text-purple-100 text-sm">
                                {currentView === 'main' && 'Kelola informasi akun Anda'}
                                {currentView === 'change-email' && 'Perbarui alamat email Anda'}
                                {currentView === 'change-password' && 'Perbarui kata sandi akun Anda'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-hidden">
                    <div className={`transition-all duration-300 ease-in-out ${
                        isTransitioning ? 'opacity-0 transform translate-x-2' : 'opacity-100 transform translate-x-0'
                    }`}>
                        {currentView === 'main' && (
                        <form onSubmit={handleSaveChanges} className="space-y-6">
                            {/* Profile Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Profil</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="nama_lengkap" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            id="nama_lengkap"
                                            name="nama_lengkap"
                                            value={formData.nama_lengkap}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Masukkan username"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="nomor_telepon" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nomor Telepon
                                        </label>
                                        <input
                                            type="tel"
                                            id="nomor_telepon"
                                            name="nomor_telepon"
                                            value={formData.nomor_telepon}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="08xxxxxxxxxx"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="tanggal_lahir" className="block text-sm font-medium text-gray-700 mb-2">
                                            Tanggal Lahir
                                        </label>
                                        <input
                                            type="date"
                                            id="tanggal_lahir"
                                            name="tanggal_lahir"
                                            value={formData.tanggal_lahir}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="jenis_kelamin" className="block text-sm font-medium text-gray-700 mb-2">
                                            Jenis Kelamin
                                        </label>
                                        <select
                                            id="jenis_kelamin"
                                            name="jenis_kelamin"
                                            value={formData.jenis_kelamin}
                                            onChange={(e) => setFormData(prev => ({ ...prev, jenis_kelamin: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        >
                                            <option value="">Pilih jenis kelamin</option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-2">
                                            Alamat Rumah
                                        </label>
                                        <textarea
                                            id="alamat"
                                            name="alamat"
                                            value={formData.alamat}
                                            onChange={(e) => setFormData(prev => ({ ...prev, alamat: e.target.value }))}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                                            placeholder="Masukkan alamat lengkap"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Security Settings */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Keamanan</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleViewChange('change-email')}
                                        className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                    >
                                        Ubah Email
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleViewChange('change-password')}
                                        className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                    >
                                        Ubah Kata Sandi
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    )}

                    {currentView === 'change-email' && (
                        <form onSubmit={handleChangeEmail} className="space-y-6">
                            <div>
                                <label htmlFor="new_email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Baru
                                </label>
                                <input
                                    type="email"
                                    id="new_email"
                                    name="new_email"
                                    value={formData.new_email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="email-baru@domain.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Kata Sandi Saat Ini
                                </label>
                                <input
                                    type="password"
                                    id="current_password"
                                    name="current_password"
                                    value={formData.current_password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Masukkan kata sandi saat ini"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => handleViewChange('main')}
                                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Kembali ke Pengaturan
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Ubah Email
                                </button>
                            </div>
                        </form>
                    )}

                    {currentView === 'change-password' && (
                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div>
                                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Kata Sandi Saat Ini
                                </label>
                                <input
                                    type="password"
                                    id="current_password"
                                    name="current_password"
                                    value={formData.current_password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Masukkan kata sandi saat ini"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Kata Sandi Baru
                                </label>
                                <input
                                    type="password"
                                    id="new_password"
                                    name="new_password"
                                    value={formData.new_password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Masukkan kata sandi baru"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Konfirmasi Kata Sandi Baru
                                </label>
                                <input
                                    type="password"
                                    id="confirm_password"
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Konfirmasi kata sandi baru"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => handleViewChange('main')}
                                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Kembali ke Pengaturan
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Ubah Kata Sandi
                                </button>
                            </div>
                        </form>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
}
