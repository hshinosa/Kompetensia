import React, { ReactNode } from 'react';
import Navbar from '@/components/client/Navbar';
import Footer from '@/components/client/Footer';
import Sidebar from '@/components/client/Sidebar';

interface Props {
    children: ReactNode;
    header?: ReactNode;
}

export default function ClientAuthenticatedLayout({ children, header }: Readonly<Props>) {
    const currentRoute = route().current();
    const isDashboard = currentRoute === 'client.dashboard';
    const isSertifikasi = currentRoute === 'client.sertifikasi';
    const isPKL = currentRoute === 'client.pkl';
    const isSertifikatSaya = currentRoute === 'client.sertifikat-saya';
    const isPengaturan = currentRoute === 'client.pengaturan';
    const isDetailPKL = currentRoute === 'client.pkl.detail';
    const isDetailSertifikasi = currentRoute === 'client.sertifikasi.detail';
    const hideFooter = isDashboard || isSertifikasi || isPKL || isSertifikatSaya || isPengaturan || isDetailPKL || isDetailSertifikasi;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Sticky Navbar */}
            <Navbar />

            {/* Mobile: Sidebar below navbar, Desktop/Tablet: Sidebar on left */}
            <div className="flex flex-1 relative gap-0 md:gap-4 lg:gap-6">
                {/* Desktop/Tablet Sidebar - Hidden on mobile */}
                <div className="hidden md:block w-52 lg:w-64 flex-shrink-0 md:pl-4 lg:pl-6">
                    <Sidebar currentPath={window.location.pathname} />
                </div>

                {/* Main Content with proper scrolling */}
                <main className="flex-1 min-w-0 px-4 py-4 md:pr-4 lg:pr-6">
                    {/* Mobile Sidebar - Shows below navbar, above content */}
                    <div className="md:hidden mb-4">
                        <Sidebar currentPath={window.location.pathname} />
                    </div>
                    
                    <div className="container mx-auto px-0 py-0">
                        {header && (
                            <div className="mb-6 md:mb-8">
                                {header}
                            </div>
                        )}
                        {children}
                    </div>
                </main>
            </div>

            {/* Conditional Footer - hide for dashboard, sertifikasi, pkl, and sertifikat saya */}
            {!hideFooter && <Footer />}
        </div>
    );
}
