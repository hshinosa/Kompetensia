import { useState, useMemo } from 'react';
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
import Pagination from '@/components/Pagination';

interface User {
    id: number;
    name: string;
    full_name?: string;
    email: string;
    phone?: string;
    institution?: string;
    major?: string;
    semester?: number;
    school_university?: string;
    major_concentration?: string;
    class_semester?: number;
}

interface Penilaian {
    id: number;
    status_kelulusan: string;
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
    tanggal_pendaftaran: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    institusi_asal: string;
    program_studi: string;
    semester: number;
    ipk: number;
    user: User;
    posisi_p_k_l?: PosisiPKL;  // Changed from pkl to posisiPKL to match model
    penilaian?: Penilaian;
}

interface PaginatedData {
    data: PendaftaranPKL[];
    meta?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface Props {
    pendaftaran: PaginatedData;
}

export default function PenilaianPKL({ pendaftaran }: Readonly<Props>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Penilaian', href: '#' },
        { title: 'PKL', href: '/admin/penilaian-pkl' }
    ];

    // Extract data from props
    const pesertaData = pendaftaran.data || [];

    // Convert to display format and filter
    const filteredData = useMemo(() => {
        return pesertaData.filter(item =>
            (item.user.full_name || item.user.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.posisi_p_k_l?.nama_posisi || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.user.major_concentration || item.program_studi || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.user.school_university || item.institusi_asal || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, pesertaData]);

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Statistics calculations based on actual data
    const totalPeserta = pesertaData.length;
    const getStatusPenilaian = (item: PendaftaranPKL) => {
        if (!item.penilaian) return 'Belum Dinilai';
        return item.penilaian.status_kelulusan;
    };
    
    const sedangBerjalan = pesertaData.filter(p => p.status === 'Disetujui' && !p.penilaian).length;
    const lulus = pesertaData.filter(p => p.penilaian?.status_kelulusan === 'Lulus').length;
    const belumDinilai = pesertaData.filter(p => !p.penilaian).length;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    const handleViewDetail = (item: PendaftaranPKL) => {
        // Navigate to detail page using Inertia router
        router.visit(`/admin/penilaian-pkl/${item.id}`);
    };

    const getStatusBadgeVariant = (item: PendaftaranPKL) => {
        const status = getStatusPenilaian(item);
        switch (status) {
            case 'Lulus': return 'default';
            case 'Tidak Lulus': return 'destructive';
            case 'Belum Dinilai': 
                return item.status === 'Disetujui' ? 'secondary' : 'outline';
            default: return 'outline';
        }
    };

    const getStatusText = (item: PendaftaranPKL) => {
        if (!item.penilaian) {
            return item.status === 'Disetujui' ? 'Sedang Berjalan' : 'Belum Dinilai';
        }
        return item.penilaian.status_kelulusan;
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
                                    <p className="text-sm text-muted-foreground">Lulus</p>
                                    <div className="text-2xl font-bold">{lulus}</div>
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
                                    onChange={setSearchQuery}
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
                                    <TableHead>Institusi/Program Studi</TableHead>
                                    <TableHead>Program PKL</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Status Penilaian</TableHead>
                                    <TableHead className="w-[120px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{item.user.full_name || item.user.name}</div>
                                                    <div className="text-sm text-muted-foreground">{item.user.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{item.user.school_university || item.institusi_asal || 'Institusi tidak tersedia'}</div>
                                                    <div className="text-sm text-muted-foreground">{item.user.major_concentration || item.program_studi || 'Program studi tidak tersedia'}</div>
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
                                                    const semester = item.user.class_semester || item.semester;
                                                    if (!semester) return 'N/A';
                                                    
                                                    const semesterStr = semester.toString();
                                                    
                                                    // Jika mengandung "XII", "XI", atau "X" (SMK)
                                                    if (semesterStr.includes('XII')) return 'XII';
                                                    if (semesterStr.includes('XI')) return 'XI';
                                                    if (semesterStr.includes('X')) return 'X';
                                                    
                                                    // Jika berupa angka 1-8 (kuliah)
                                                    const semesterNum = parseInt(semesterStr);
                                                    if (semesterNum >= 1 && semesterNum <= 8) {
                                                        return `Semester ${semesterNum}`;
                                                    }
                                                    
                                                    // Default fallback
                                                    return semesterStr;
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
                    <div className="p-4">
                        {/* Pagination */}
                        {totalItems > 0 && (
                            <div className="border-t">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    itemsPerPage={itemsPerPage}
                                    totalItems={totalItems}
                                    onPageChange={handlePageChange}
                                    onItemsPerPageChange={handleItemsPerPageChange}
                                />
                            </div>
                        )}
                    </div>
                    
                </Card>
            </div>
        </AppLayout>
    );
}
