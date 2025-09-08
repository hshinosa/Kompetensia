import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff, X } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsClosing(false);
        } else {
            document.body.style.overflow = 'unset';
        }

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

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/client/login', {
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: () => {
                // Errors akan ditampilkan otomatis
            }
        });
    };

    return (
        <div 
            className={`fixed inset-0 backdrop-blur-xs backdrop-brightness-90 flex items-center justify-center z-[9999] p-4 transition-all duration-200 ${
                isClosing ? 'animate-out fade-out' : 'animate-in fade-in'
            }`}
            onClick={handleBackdropClick}
        >
            <div 
                className={`bg-white rounded-2xl shadow-2xl p-8 pt-6 w-[400px] max-w-full relative border border-purple-700 transition-all duration-200 ${
                    isClosing ? 'animate-out zoom-out-95' : 'animate-in zoom-in-95'
                }`}
            >
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 bg-orange-200 rounded-lg p-2 hover:bg-orange-300 transition-colors"
                    onClick={handleClose}
                    aria-label="Tutup Modal"
                >
                    <X className="w-5 h-5 text-gray-700" />
                </button>

                <h2 className="text-4xl font-bold mb-6 mt-2">Masuk</h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email" className="block text-lg font-semibold mb-2">
                            Alamat Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="cth. giga23@yahoo.com"
                            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none text-base mb-1 ${
                                errors.email 
                                    ? 'border-red-400 focus:border-red-700' 
                                    : 'border-purple-400 focus:border-purple-700'
                            }`}
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-lg font-semibold mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="minimal 8 karakter"
                                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none text-base pr-10 ${
                                    errors.password 
                                        ? 'border-red-400 focus:border-red-700' 
                                        : 'border-purple-400 focus:border-purple-700'
                                }`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                        <div className="flex justify-end mt-1">
                            <a href="/forgot-password" className="text-xs text-gray-700 underline hover:text-gray-900">
                                Lupa Kata Sandi
                            </a>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full py-3 rounded-lg bg-purple-700 text-white font-semibold text-lg mt-2 mb-2 hover:bg-purple-800 disabled:opacity-50 transition-colors"
                    >
                        {processing ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>

                <div className="flex items-center my-4">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="mx-2 text-gray-500 text-sm">atau masuk dengan</span>
                    <div className="flex-1 h-px bg-gray-300" />
                </div>

                <button className="w-full py-3 rounded-lg border-2 border-orange-300 bg-white text-black font-semibold flex items-center justify-center gap-2 mb-2 hover:bg-orange-50 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <g>
                            <path fill="#EA4335" d="M12 10.8v2.4h6.7c-.3 1.4-1.7 4.1-6.7 4.1-4 0-7.3-3.3-7.3-7.3s3.3-7.3 7.3-7.3c2.3 0 3.8.9 4.7 1.7l-1.9 1.9c-.6-.5-1.6-1.2-2.8-1.2-2.4 0-4.3 2-4.3 4.4s1.9 4.4 4.3 4.4c2.8 0 3.7-1.1 4.1-1.7h-4.1z"/>
                            <path fill="#34A853" d="M21.6 12.2c0-.8-.1-1.6-.2-2.4H12v4.1h5.3c-.2 1.1-.9 2.1-1.9 2.7v2.2h3c1.7-1.6 2.7-4 2.7-6.7z"/>
                            <path fill="#FBBC05" d="M4.7 14.3c-.3-.8-.5-1.7-.5-2.7s.2-1.9.5-2.7V6.7H1.6C.6 8.5 0 10.6 0 12.6s.6 4.1 1.6 5.9l3.1-2.2z"/>
                            <path fill="#4285F4" d="M12 22c2.4 0 4.4-.8 5.9-2.2l-3-2.2c-.8.5-1.8.8-2.9.8-2.2 0-4.1-1.5-4.8-3.5H1.6v2.2C3.1 20.2 7.2 22 12 22z"/>
                        </g>
                    </svg>
                    Masuk Dengan Google
                </button>

                <div className="text-center mt-2 text-base">
                    Belum punya akun?{' '}
                    <a 
                        href="/client/register" 
                        className="font-semibold text-purple-700 underline hover:text-purple-800"
                        onClick={onClose}
                    >
                        Daftar
                    </a>
                </div>
            </div>
        </div>
    );
}
