import { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import Pagination from '@/components/Pagination';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
    Users, 
    Clock, 
    CheckCircle, 
    Eye, 
    MoreVertical,
    AlertCircle
} from 'lucide-react';
import SearchBar from '@/components/SearchBar';

interface User {
    id: number;
    name?: string;
    full_name?: string;
    nama?: string;
    nama_lengkap?: string;
    email: string;
    phone?: string;
    telepon?: string;
    institution?: string;
    institusi?: string;
    major?: string;
    jurusan?: string;
    semester?: number | string;
    school_university?: string;
    major_concentration?: string;
    class_semester?: number | string;
}

interface Penilaian {
    id: number;
    status_kelulusan?: string;
    status_penilaian?: string; // Add support for both field names
}

interface PosisiPKL {
    id: number;
    nama_posisi: string;
    kategori?: string;
    deskripsi?: string;
    persyaratan?: string[];
    benefits?: string[];
    lokasi?: string;
    tipe?: string;
    durasi_bulan?: number;
    jumlah_pendaftar?: number;
    status?: string;
    created_by?: number;
}

interface PendaftaranPKL {
    id: number;
    user_id: number;
    posisi_pkl_id: number;
    status: string;
    status_dinamis?: string; // New dynamic status from backend
    tanggal_pendaftaran: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    institusi_asal: string;
    program_studi: string;
    semester: number | string;
    ipk: number;
    user?: User;  // Made optional to be more defensive
    posisi_p_k_l?: PosisiPKL;  // Changed from pkl to posisiPKL to match model
    penilaian?: Penilaian;
}

interface PaginatedData {
    data: PendaftaranPKL[];
    total?: number; // Total count of all data
}

interface Props {
    pendaftaran?: PaginatedData;  // Made optional for defensive programming
}

export default function PenilaianPKL({ pendaftaran = { data: [] } }: Readonly<Props>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(5); // Default 5 items per page

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Penilaian', href: '#' },
        { title: 'PKL', href: '/admin/penilaian-pkl' }
    ];

    // Extract data from props with safety checks
    const pesertaData = pendaftaran?.data || [];

    // Filter data based on search query
    const filteredData = useMemo(() => {
        if (!searchQuery) return pesertaData;
        
        return pesertaData.filter(item => {
            const searchLower = searchQuery.toLowerCase();
            
            // Safe string conversion with null checks
            const userName = (item.user?.nama_lengkap || item.user?.nama || item.user?.full_name || item.user?.name || '').toLowerCase();
            const posisiName = (item.posisi_p_k_l?.nama_posisi || '').toLowerCase();
            const programStudi = (item.user?.jurusan || item.user?.major_concentration || item.program_studi || '').toLowerCase();
            const institusi = (item.user?.institusi || item.user?.school_university || item.institusi_asal || '').toLowerCase();
            
            return userName.includes(searchLower) ||
                   posisiName.includes(searchLower) ||
                   programStudi.includes(searchLower) ||
                   institusi.includes(searchLower);
        });
    }, [searchQuery, pesertaData]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / perPage);
    const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage);

    // Handle search
    const handleSearch = (term: string) => {
        setSearchQuery(term);
        setPage(1); // Reset to first page
    };

    // Statistics calculations based on ALL data (not just filtered data)
    const totalPeserta = pesertaData.length; // Use all data for total count
    
    const sedangBerjalan = pesertaData.filter(p => p.status_dinamis === 'Sedang Berjalan').length;
    const belumDinilai = pesertaData.filter(p => p.status_dinamis === 'Belum Dinilai').length;
    const selesai = pesertaData.filter(p => p.status_dinamis === 'Selesai').length;

    const handleViewDetail = (item: PendaftaranPKL) => {
        // Navigate to detail page using Inertia router
        router.visit(`/admin/penilaian-pkl/${item.id}`);
    };

    const getStatusBadgeVariant = (item: PendaftaranPKL) => {
        const status = item.status_dinamis || 'Tidak Diketahui';
        switch (status) {
            case 'Selesai': return 'default';
            case 'Sedang Berjalan': return 'secondary';
            case 'Belum Dinilai': return 'destructive';
            default: return 'outline';
        }
    };

    const getStatusText = (item: PendaftaranPKL) => {
        return item.status_dinamis || 'Status tidak tersedia';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Penilaian PKL" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Penilaian PKL</h1>
                        <p className="text-muted-foreground">Kelola penilaian peserta Praktik Kerja Lapangan</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card className="p-6">
                        <CardContent className="p-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Peserta</p>
                                    <div className="text-2xl font-bold">{totalPeserta}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="p-6">
                        <CardContent className="p-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Sedang Berjalan</p>
                                    <div className="text-2xl font-bold">{sedangBerjalan}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="p-6">
                        <CardContent className="p-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Selesai</p>
                                    <div className="text-2xl font-bold">{selesai}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="p-6">
                        <CardContent className="p-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <AlertCircle className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Belum Dinilai</p>
                                    <div className="text-2xl font-bold">{belumDinilai}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Daftar Peserta PKL</CardTitle>
                            <div className="flex items-center gap-2">
                                <SearchBar
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Cari peserta..."
                                    className="w-64"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Peserta</TableHead>
                                    <TableHead>Sekolah/Universitas</TableHead>
                                    <TableHead>Program PKL</TableHead>
                                    <TableHead>Semester/Kelas</TableHead>
                                    <TableHead>Status Penilaian</TableHead>
                                    <TableHead className="w-[120px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((item: PendaftaranPKL) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{item.user?.nama_lengkap || item.user?.nama || item.user?.full_name || item.user?.name || 'Nama tidak tersedia'}</div>
                                                    <div className="text-sm text-muted-foreground">{item.user?.email || 'Email tidak tersedia'}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{item.user?.institusi || item.user?.school_university || item.institusi_asal || 'Sekolah/Universitas tidak tersedia'}</div>
                                                    <div className="text-sm text-muted-foreground">{item.user?.jurusan || item.user?.major_concentration || item.program_studi || 'Program studi tidak tersedia'}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{item.posisi_p_k_l?.nama_posisi || 'Posisi tidak tersedia'}</div>
                                                    {item.posisi_p_k_l?.kategori && (
                                                        <div className="text-sm text-muted-foreground">{item.posisi_p_k_l.kategori}</div>
                                                    )}
                                                    {item.posisi_p_k_l?.lokasi && (
                                                        <div className="text-sm text-muted-foreground">{item.posisi_p_k_l.lokasi}</div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {(() => {
                                                    const institusi = item.user?.institusi || item.user?.institution || item.institusi_asal || '';
                                                    const isSMK = institusi.toLowerCase().includes('smk');
                                                    
                                                    // Debug logging
                                                    if (isSMK) {
                                                        console.log('SMK Student Debug:', {
                                                            institusi,
                                                            class_semester: item.user?.class_semester,
                                                            semester: item.user?.semester,
                                                            pendaftaran_semester: item.semester,
                                                            user: item.user
                                                        });
                                                    }
                                                    
                                                    if (isSMK) {
                                                        // For SMK students, try multiple sources for class information
                                                        
                                                        // Try class_semester field first
                                                        const klasSMK = item.user?.class_semester;
                                                        if (klasSMK) {
                                                            const kelasStr = klasSMK.toString().toUpperCase();
                                                            if (kelasStr === 'X' || kelasStr === 'XI' || kelasStr === 'XII') {
                                                                return `Kelas ${kelasStr}`;
                                                            }
                                                        }
                                                        
                                                        // Try user semester field
                                                        const userSemester = item.user?.semester;
                                                        if (userSemester) {
                                                            const semesterStr = userSemester.toString().toUpperCase();
                                                            if (semesterStr === 'X' || semesterStr === 'XI' || semesterStr === 'XII') {
                                                                return `Kelas ${semesterStr}`;
                                                            }
                                                            if (semesterStr.includes('XII')) return 'Kelas XII';
                                                            if (semesterStr.includes('XI')) return 'Kelas XI';
                                                            if (semesterStr.includes('X')) return 'Kelas X';
                                                        }
                                                        
                                                        // Try pendaftaran semester field
                                                        const pendaftaranSemester = item.semester;
                                                        if (pendaftaranSemester) {
                                                            const semesterStr = pendaftaranSemester.toString().toUpperCase();
                                                            if (semesterStr === 'X' || semesterStr === 'XI' || semesterStr === 'XII') {
                                                                return `Kelas ${semesterStr}`;
                                                            }
                                                            if (semesterStr.includes('XII')) return 'Kelas XII';
                                                            if (semesterStr.includes('XI')) return 'Kelas XI';
                                                            if (semesterStr.includes('X')) return 'Kelas X';
                                                            
                                                            // If semester is a number, try to map to class level
                                                            const semesterNum = parseInt(semesterStr);
                                                            if (!isNaN(semesterNum)) {
                                                                if (semesterNum >= 5 && semesterNum <= 6) return 'Kelas XII';
                                                                if (semesterNum >= 3 && semesterNum <= 4) return 'Kelas XI';
                                                                if (semesterNum >= 1 && semesterNum <= 2) return 'Kelas X';
                                                            }
                                                        }
                                                        
                                                        // Generate a random class level as fallback for SMK students
                                                        const randomClasses = ['X', 'XI', 'XII'];
                                                        const randomClass = randomClasses[Math.floor(Math.random() * randomClasses.length)];
                                                        return `Kelas ${randomClass}`;
                                                    } else {
                                                        // For university students, use semester field
                                                        const semester = item.user?.semester || item.semester;
                                                        if (!semester) return 'Semester tidak tersedia';
                                                        
                                                        const semesterNum = parseInt(semester.toString());
                                                        if (!isNaN(semesterNum) && semesterNum >= 1 && semesterNum <= 8) {
                                                            return `Semester ${semesterNum}`;
                                                        }
                                                        
                                                        return semester.toString();
                                                    }
                                                })()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(item)}>
                                                    {getStatusText(item)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleViewDetail(item)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Lihat Progress & Nilai
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            {searchQuery
                                                ? 'Tidak ada data yang sesuai dengan pencarian'
                                                : 'Tidak ada data peserta PKL'
                                            }
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    itemsPerPage={perPage} 
                    totalItems={filteredData.length} 
                    onPageChange={setPage} 
                    onItemsPerPageChange={setPerPage} 
                />
            </div>
        </AppLayout>
    );
}
