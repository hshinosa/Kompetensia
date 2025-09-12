import React from 'react';
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

    return (
        <aside className="w-64 bg-white rounded-2xl border border-gray-200 h-fit sticky top-28 z-40 shadow-sm">
            <div className="p-6">
                {/* User Profile */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-purple-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                        <span className="text-purple-700 text-2xl font-bold">
                            {auth?.client?.nama_lengkap?.charAt(0) || auth?.client?.nama?.charAt(0) || 'U'}
                        </span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {auth?.client?.nama_lengkap || auth?.client?.nama || 'User'}
                    </h2>
                    <p className="text-sm text-gray-600">{auth?.client?.email}</p>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                    <Link
                        href="/dashboard"
                        className={`flex items-center space-x-3 w-full text-left px-4 py-3 font-medium rounded-xl transition-colors ${
                            currentRoute === 'client.dashboard'
                                ? 'bg-purple-700 text-white'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                        }`}
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
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <span>Sertifikat Saya</span>
                    </Link>
                </nav>
            </div>
        </aside>
    );
}
