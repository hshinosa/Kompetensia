import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/client/register');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl border-4 border-purple-600 shadow-xl overflow-hidden">
                {/* Left side - Form */}
                <div className="p-8 lg:p-12 flex items-center justify-center">
                    <div className="w-full max-w-sm">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-black mb-8">Daftar</h1>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="nama" className="block text-base font-medium text-black mb-2">
                                    Nama Lengkap
                                </label>
                                <input
                                    id="nama"
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    placeholder="e.g Bagia Janur"
                                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-600 text-base ${
                                        errors.nama ? 'border-red-400' : ''
                                    }`}
                                    required
                                />
                                {errors.nama && (
                                    <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-base font-medium text-black mb-2">
                                    Alamat Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="admin@kompetensia.com"
                                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-600 text-base ${
                                        errors.email ? 'border-red-400' : ''
                                    }`}
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-base font-medium text-black mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="........"
                                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-600 text-base pr-12 ${
                                            errors.password ? 'border-red-400' : ''
                                        }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-base font-medium text-black mb-2">
                                    Konfirmasi Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Masukkan ulang password"
                                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-600 text-base pr-12 ${
                                            errors.password_confirmation ? 'border-red-400' : ''
                                        }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                                )}
                            </div>

                            <button 
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 rounded-lg bg-purple-600 text-white font-semibold text-base hover:bg-purple-700 disabled:opacity-50 transition-colors"
                            >
                                {processing ? 'Memproses...' : 'Daftar'}
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-base">
                                    <span className="px-4 bg-white text-gray-500">atau daftar dengan</span>
                                </div>
                            </div>

                            <button className="w-full mt-4 py-3 px-4 rounded-lg border border-orange-300 bg-white text-black font-medium text-base hover:bg-orange-50 transition-all flex items-center justify-center gap-3">
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <g>
                                        <path fill="#EA4335" d="M12 10.8v2.4h6.7c-.3 1.4-1.7 4.1-6.7 4.1-4 0-7.3-3.3-7.3-7.3s3.3-7.3 7.3-7.3c2.3 0 3.8.9 4.7 1.7l-1.9 1.9c-.6-.5-1.6-1.2-2.8-1.2-2.4 0-4.3 2-4.3 4.4s1.9 4.4 4.3 4.4c2.8 0 3.7-1.1 4.1-1.7h-4.1z"/>
                                        <path fill="#34A853" d="M21.6 12.2c0-.8-.1-1.6-.2-2.4H12v4.1h5.3c-.2 1.1-.9 2.1-1.9 2.7v2.2h3c1.7-1.6 2.7-4 2.7-6.7z"/>
                                        <path fill="#FBBC05" d="M4.7 14.3c-.3-.8-.5-1.7-.5-2.7s.2-1.9.5-2.7V6.7H1.6C.6 8.5 0 10.6 0 12.6s.6 4.1 1.6 5.9l3.1-2.2z"/>
                                        <path fill="#4285F4" d="M12 22c2.4 0 4.4-.8 5.9-2.2l-3-2.2c-.8.5-1.8.8-2.9.8-2.2 0-4.1-1.5-4.8-3.5H1.6v2.2C3.1 20.2 7.2 22 12 22z"/>
                                    </g>
                                </svg>
                                Daftar Dengan Google
                            </button>

                            <div className="text-center mt-6">
                                <span className="text-base text-gray-600">Sudah memiliki akun? </span>
                                <Link 
                                    href="/client/login" 
                                    className="text-base font-semibold text-purple-600 hover:text-purple-800 underline transition-colors"
                                >
                                    Masuk
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Image */}
                <div className="hidden lg:block relative">
                    <div 
                        className="w-full h-full bg-cover bg-center" 
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')"
                        }}
                    >
                    </div>
                </div>
            </div>
        </div>
    );
}
