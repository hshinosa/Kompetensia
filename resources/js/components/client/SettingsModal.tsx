import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

type ModalView = 'main' | 'change-email' | 'change-password';

interface User {
    id: number;
    nama: string;
    email: string;
    role: string;
}

interface PageProps extends Record<string, any> {
    auth?: {
        user?: User;
        client?: User;
    };
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    nama_lengkap: string;
    email: string;
    nomor_telepon: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    alamat: string;
    current_password: string;
    new_password: string;
    confirm_password: string;
    new_email: string;
}

export default function SettingsModal({ isOpen, onClose }: Readonly<Props>) {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.client || auth?.user;
    
    // Get user-specific localStorage key
    const getPhotoStorageKey = () => user ? `user_profile_photo_${user.id}` : 'user_profile_photo';
    
    const [currentView, setCurrentView] = useState<ModalView>('main');
    const [isClosing, setIsClosing] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [fotoProfil, setFotoProfil] = useState<string | null>(() => {
        // Initialize from localStorage on component mount using user-specific key
        if (!user) return null;
        const key = `user_profile_photo_${user.id}`;
        const saved = localStorage.getItem(key);
        console.log('Initial fotoProfil from localStorage:', saved);
        return saved || null;
    });
    const [isUploadingFoto, setIsUploadingFoto] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const isUploadingRef = React.useRef(false);

    // Handle animated view changes
    const handleViewChange = (newView: ModalView) => {
        setIsTransitioning(true);
        setError('');
        setSuccess('');
        setTimeout(() => {
            setCurrentView(newView);
            setIsTransitioning(false);
            // Reset password fields when changing view
            if (newView !== 'change-password' && newView !== 'change-email') {
                setFormData(prev => ({
                    ...prev,
                    current_password: '',
                    new_password: '',
                    confirm_password: '',
                    new_email: ''
                }));
            }
        }, 150);
    };
    
    const [formData, setFormData] = useState<FormData>({
        nama_lengkap: '',
        email: '',
        nomor_telepon: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        alamat: '',
        current_password: '',
        new_password: '',
        confirm_password: '',
        new_email: ''
    });

    // Sync fotoProfil with localStorage whenever it changes
    useEffect(() => {
        console.log('fotoProfil changed:', fotoProfil);
        if (fotoProfil && user) {
            const key = getPhotoStorageKey();
            localStorage.setItem(key, fotoProfil);
            console.log('Saved to localStorage:', key, fotoProfil);
            // Dispatch event to notify other components (like Navbar)
            window.dispatchEvent(new Event('profile-photo-updated'));
        }
    }, [fotoProfil, user]);

    // Fetch user profile data when modal opens
    useEffect(() => {
        if (isOpen) {
            console.log('Modal opened, fetching profile...');
            fetchUserProfile();
        }
    }, [isOpen]);

    const fetchUserProfile = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            const response = await axios.get('/api/settings/profile');
            if (response.data.success) {
                const userData = response.data.data;
                setFormData(prev => ({
                    ...prev,
                    nama_lengkap: userData.nama_lengkap || userData.nama || '',
                    email: userData.email || '',
                    nomor_telepon: userData.nomor_telepon || '',
                    tempat_lahir: userData.tempat_lahir || '',
                    tanggal_lahir: userData.tanggal_lahir || '',
                    jenis_kelamin: userData.jenis_kelamin || '',
                    alamat: userData.alamat || '',
                }));
                
                // CRITICAL: Only update photo if current state is null
                // This prevents overwriting newly uploaded photos
                if (!fotoProfil && userData.foto_profil) {
                    setFotoProfil(userData.foto_profil);
                }
            }
        } catch (err: any) {
            console.error('Error fetching profile:', err);
            setError(err.response?.data?.message || 'Gagal memuat data profil');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError('Ukuran file maksimal 2MB');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Validate file type
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            setError('Format file harus JPG, JPEG, atau PNG');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setIsUploadingFoto(true);
        setError('');
        setSuccess('');

        try {
            // Create FormData and upload immediately
            const formData = new FormData();
            formData.append('foto_profil', file);

            const response = await axios.post('/api/settings/upload-foto', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                // Get server URL
                const serverPhotoUrl = response.data.data.foto_profil;
                
                // Update state and localStorage atomically with user-specific key
                setFotoProfil(serverPhotoUrl);
                if (user) {
                    localStorage.setItem(getPhotoStorageKey(), serverPhotoUrl);
                }
                
                setSuccess('Foto profil berhasil diupload');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err: any) {
            console.error('Error uploading photo:', err);
            setError(err.response?.data?.message || 'Gagal mengupload foto profil');
        } finally {
            setIsUploadingFoto(false);
            // Clear file input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeleteFoto = async () => {
        if (!confirm('Apakah Anda yakin ingin menghapus foto profil?')) return;

        setIsUploadingFoto(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.delete('/api/settings/delete-foto');

            if (response.data.success) {
                setFotoProfil(null);
                // Remove from localStorage using user-specific key
                if (user) {
                    localStorage.removeItem(getPhotoStorageKey());
                }
                setSuccess('Foto profil berhasil dihapus');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err: any) {
            console.error('Error deleting photo:', err);
            setError(err.response?.data?.message || 'Gagal menghapus foto profil');
        } finally {
            setIsUploadingFoto(false);
        }
    };

    // Lock body scroll when dialog is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsClosing(false);
            setCurrentView('main'); // Reset to main view when opening
            setError('');
            setSuccess('');
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccess('');
        
        try {
            const response = await axios.put('/api/settings/profile', {
                nama_lengkap: formData.nama_lengkap,
                nomor_telepon: formData.nomor_telepon,
                tempat_lahir: formData.tempat_lahir,
                tanggal_lahir: formData.tanggal_lahir,
                jenis_kelamin: formData.jenis_kelamin,
                alamat: formData.alamat,
            });
            
            if (response.data.success) {
                setSuccess('Profil berhasil diperbarui');
                setTimeout(() => {
                    handleClose();
                }, 1500);
            }
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Gagal memperbarui profil');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangeEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccess('');
        
        try {
            const response = await axios.post('/api/settings/change-email', {
                new_email: formData.new_email,
                current_password: formData.current_password,
            });
            
            if (response.data.success) {
                setSuccess('Email berhasil diubah');
                setFormData(prev => ({
                    ...prev,
                    email: formData.new_email,
                    new_email: '',
                    current_password: ''
                }));
                setTimeout(() => {
                    handleViewChange('main');
                }, 1500);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal mengubah email');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccess('');
        
        // Validate password match
        if (formData.new_password !== formData.confirm_password) {
            setError('Konfirmasi kata sandi tidak cocok');
            setIsSaving(false);
            return;
        }
        
        if (formData.new_password.length < 8) {
            setError('Kata sandi baru minimal 8 karakter');
            setIsSaving(false);
            return;
        }
        
        try {
            const response = await axios.post('/api/settings/change-password', {
                current_password: formData.current_password,
                new_password: formData.new_password,
                new_password_confirmation: formData.confirm_password,
            });
            
            if (response.data.success) {
                setSuccess('Kata sandi berhasil diubah');
                setFormData(prev => ({
                    ...prev,
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                }));
                setTimeout(() => {
                    handleViewChange('main');
                }, 1500);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal mengubah kata sandi');
        } finally {
            setIsSaving(false);
        }
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
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        </div>
                    )}

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Success Alert */}
                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-800">{success}</p>
                            </div>
                        </div>
                    )}

                    <div className={`transition-all duration-300 ease-in-out ${
                        isTransitioning ? 'opacity-0 transform translate-x-2' : 'opacity-100 transform translate-x-0'
                    }`}>
                        {!isLoading && currentView === 'main' && (
                        <form onSubmit={handleSaveChanges} className="space-y-6">
                            {/* Profile Photo */}
                            <div className="flex flex-col items-center pb-6 border-b border-gray-200">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                        {fotoProfil ? (
                                            <img 
                                                src={fotoProfil} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        )}
                                    </div>
                                    {isUploadingFoto && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <label className="cursor-pointer px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png"
                                            onChange={handleFotoUpload}
                                            className="hidden"
                                            disabled={isUploadingFoto}
                                        />
                                        Upload Foto
                                    </label>
                                    {fotoProfil && (
                                        <button
                                            type="button"
                                            onClick={handleDeleteFoto}
                                            disabled={isUploadingFoto}
                                            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                        >
                                            Hapus Foto
                                        </button>
                                    )}
                                </div>
                                <p className="mt-2 text-xs text-gray-500">JPG, JPEG atau PNG. Maksimal 2MB</p>
                            </div>

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
                                        <label htmlFor="tempat_lahir" className="block text-sm font-medium text-gray-700 mb-2">
                                            Tempat Lahir
                                        </label>
                                        <input
                                            type="text"
                                            id="tempat_lahir"
                                            name="tempat_lahir"
                                            value={formData.tempat_lahir}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Masukkan tempat lahir"
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
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-2">
                                        Alamat Lengkap
                                    </label>
                                    <textarea
                                        id="alamat"
                                        name="alamat"
                                        value={formData.alamat}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Masukkan alamat lengkap"
                                    />
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
                                    disabled={isSaving}
                                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSaving && (
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
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
                                    disabled={isSaving}
                                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Kembali ke Pengaturan
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSaving && (
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {isSaving ? 'Mengubah...' : 'Ubah Email'}
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
                                    disabled={isSaving}
                                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Kembali ke Pengaturan
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSaving && (
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {isSaving ? 'Mengubah...' : 'Ubah Kata Sandi'}
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
