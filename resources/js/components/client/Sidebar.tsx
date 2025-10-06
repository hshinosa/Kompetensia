import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

interface SidebarProps {
    currentPath?: string;
}

interface User {
    id: number;
    nama: string;
    nama_lengkap?: string;
    email: string;
    role: string;
}

interface PageProps extends Record<string, any> {
    auth: {
        user?: User;
        client?: User;
    };
}

export default function Sidebar({ currentPath = '' }: Readonly<SidebarProps>) {
    const { auth } = usePage<PageProps>().props;
    const currentRoute = route().current();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle Button - Shows below navbar */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-full bg-white rounded-xl border border-gray-200 p-3 mb-4 flex items-center justify-between shadow-sm"
            >
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                        <span className="text-purple-700 text-lg font-bold">
                            {auth?.client?.nama_lengkap?.charAt(0) || auth?.client?.nama?.charAt(0) || 'U'}
                        </span>
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">
                            {auth?.client?.nama_lengkap || auth?.client?.nama || 'User'}
                        </p>
                        <p className="text-xs text-gray-600">Menu</p>
                    </div>
                </div>
                <svg
                    className={`w-5 h-5 text-gray-600 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Mobile Collapsible Menu */}
            <div
                className={`md:hidden bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 mb-4 ${
                    isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="p-4">
                    {/* User Profile - Mobile */}
                    <div className="text-center mb-6 pb-6 border-b border-gray-200">
                        <div className="w-16 h-16 bg-purple-200 rounded-xl mx-auto mb-3 flex items-center justify-center">
                            <span className="text-purple-700 text-xl font-bold">
                                {auth?.client?.nama_lengkap?.charAt(0) || auth?.client?.nama?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <h2 className="text-base font-semibold text-gray-900">
                            {auth?.client?.nama_lengkap || auth?.client?.nama || 'User'}
                        </h2>
                        <p className="text-sm text-gray-600">{auth?.client?.email}</p>
                    </div>

                    {/* Navigation Menu - Mobile */}
                    <nav className="space-y-2">
                        <Link
                            href="/dashboard"
                            className={`flex items-center space-x-3 w-full text-left px-4 py-3 font-medium rounded-xl transition-colors ${
                                currentRoute === 'client.dashboard'
                                    ? 'bg-purple-700 text-white'
                                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            href="/client/sertifikasi"
                            className={`flex items-center space-x-3 w-full text-left px-4 py-3 font-medium rounded-xl transition-colors ${
                                currentRoute?.includes('client.sertifikasi')
                                    ? 'bg-purple-700 text-white'
                                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Kelas Sertifikasi Saya</span>
                        </Link>
                        <Link
                            href="/client/pkl"
                            className={`flex items-center space-x-3 w-full text-left px-4 py-3 font-medium rounded-xl transition-colors ${
                                currentRoute?.includes('client.pkl')
                                    ? 'bg-purple-700 text-white'
                                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2V6" />
                            </svg>
                            <span>Program PKL Saya</span>
                        </Link>
                        <Link
                            href="/client/sertifikat-saya"
                            className={`flex items-center space-x-3 w-full text-left px-4 py-3 font-medium rounded-xl transition-colors ${
                                currentRoute === 'client.sertifikat-saya'
                                    ? 'bg-purple-700 text-white'
                                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <span>Sertifikat Saya</span>
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Desktop/Tablet Sidebar */}
            <aside className="hidden md:block w-52 lg:w-64 bg-white rounded-2xl border border-gray-200 h-fit sticky top-28 z-40 shadow-sm">
                <div className="p-5 lg:p-6">
                    {/* User Profile */}
                    <div className="text-center mb-6 lg:mb-8">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-purple-200 rounded-xl mx-auto mb-3 lg:mb-4 flex items-center justify-center">
                            <span className="text-purple-700 text-xl lg:text-2xl font-bold">
                                {auth?.client?.nama_lengkap?.charAt(0) || auth?.client?.nama?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <h2 className="text-base lg:text-lg font-semibold text-gray-900">
                            {auth?.client?.nama_lengkap || auth?.client?.nama || 'User'}
                        </h2>
                        <p className="text-xs lg:text-sm text-gray-600">{auth?.client?.email}</p>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-2">
                        <Link
                            href="/dashboard"
                            className={`flex items-center space-x-2 lg:space-x-3 w-full text-left px-3 lg:px-4 py-2.5 lg:py-3 font-medium rounded-xl transition-colors ${
                                currentRoute === 'client.dashboard'
                                    ? 'bg-purple-700 text-white'
                                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                        >
                            <svg className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <span className="text-sm lg:text-base">Dashboard</span>
                        </Link>
                        <Link
                            href="/client/sertifikasi"
                            className={`flex items-center space-x-2 lg:space-x-3 w-full text-left px-3 lg:px-4 py-2.5 lg:py-3 font-medium rounded-xl transition-colors ${
                                currentRoute?.includes('client.sertifikasi')
                                    ? 'bg-purple-700 text-white'
                                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                        >
                            <svg className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm lg:text-base">Kelas Sertifikasi Saya</span>
                        </Link>
                        <Link
                            href="/client/pkl"
                            className={`flex items-center space-x-2 lg:space-x-3 w-full text-left px-3 lg:px-4 py-2.5 lg:py-3 font-medium rounded-xl transition-colors ${
                                currentRoute?.includes('client.pkl')
                                    ? 'bg-purple-700 text-white'
                                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                        >
                            <svg className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2V6" />
                            </svg>
                            <span className="text-sm lg:text-base">Program PKL Saya</span>
                        </Link>
                        <Link
                            href="/client/sertifikat-saya"
                            className={`flex items-center space-x-2 lg:space-x-3 w-full text-left px-3 lg:px-4 py-2.5 lg:py-3 font-medium rounded-xl transition-colors ${
                                currentRoute === 'client.sertifikat-saya'
                                    ? 'bg-purple-700 text-white'
                                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                        >
                            <svg className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <span className="text-sm lg:text-base">Sertifikat Saya</span>
                        </Link>
                    </nav>
                </div>
            </aside>
        </>
    );
}
