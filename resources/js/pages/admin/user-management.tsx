import { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Pagination from '@/components/Pagination';
import { useInitials } from '@/hooks/use-initials';
import { Plus, MoreHorizontal, Eye, Edit, UserCheck, Users, Shield, GraduationCap, Building } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface UserIndonesia {
    id: number;
    nama: string;
    nama_lengkap?: string;
    email: string;
    role: string;
    telepon?: string;
    alamat?: string;
    tanggal_lahir?: string;
    tempat_lahir?: string;
    foto_profil?: string;
    aktif: boolean;
    status_akun?: string;
    created_at: string;
    updated_at: string;
}

interface PenggunaIndexProps {
    pengguna: {
        data: UserIndonesia[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        role?: string;
        status?: string;
        search?: string;
    };
    stats: {
        total: number;
        admin: number;
        mahasiswa: number;
        aktif: number;
        tidak_aktif: number;
    };
}

export default function UserManagement({ pengguna, filters, stats }: Readonly<PenggunaIndexProps>) {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    
    const getInitials = useInitials();

    // Filter and paginate users
    const filteredUsers = useMemo(() => {
        return pengguna.data.filter(user => {
            const matchesSearch = search === '' || 
                user.nama.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase());
            
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const matchesStatus = statusFilter === 'all' || 
                (statusFilter === 'aktif' && user.aktif) ||
                (statusFilter === 'tidak_aktif' && !user.aktif);
            
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [pengguna.data, search, roleFilter, statusFilter]);

    const totalPages = Math.ceil(filteredUsers.length / perPage);
    const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);

    // Handle search
    const handleSearch = (term: string) => {
        setSearch(term);
        setPage(1); // Reset to first page
    };

    // Handle role filter
    const handleRoleFilter = (role: string) => {
        setRoleFilter(role);
        setPage(1); // Reset to first page
    };

    // Handle status filter  
    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        setPage(1); // Reset to first page
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Manajemen Pengguna', href: '/admin/pengguna' }
    ];

    const roleOptions = [
        { value: 'all', label: 'Semua Role' },
        { value: 'admin', label: 'Admin' },
        { value: 'mahasiswa', label: 'Mahasiswa' }
    ];

    const statusOptions = [
        { value: 'all', label: 'Semua Status' },
        { value: 'aktif', label: 'Aktif' },
        { value: 'tidak_aktif', label: 'Tidak Aktif' },
        { value: 'suspended', label: 'Suspended' }
    ];

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'mahasiswa': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusBadgeColor = (status: string, aktif: boolean) => {
        if (!aktif) return 'bg-red-100 text-red-800';
        switch (status) {
            case 'aktif': return 'bg-green-100 text-green-800';
            case 'suspended': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Reset page when filters change
    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [totalPages, page]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pengguna" />
            
            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight font-heading">Manajemen Pengguna</h1>
                        <p className="text-muted-foreground">Kelola data pengguna sistem</p>
                    </div>
                    <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Link href="/admin/pengguna/create" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Pengguna
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <StatsCard 
                        label="Total Pengguna" 
                        value={stats.total} 
                        icon={<Users className="h-5 w-5" />} 
                        iconColor="text-blue-600 bg-blue-100"
                    />
                    <StatsCard 
                        label="Admin" 
                        value={stats.admin} 
                        icon={<Shield className="h-5 w-5" />} 
                        iconColor="text-red-600 bg-red-100"
                    />
                    <StatsCard 
                        label="Mahasiswa" 
                        value={stats.mahasiswa} 
                        icon={<GraduationCap className="h-5 w-5" />} 
                        iconColor="text-purple-600 bg-purple-100"
                    />
                    <StatsCard 
                        label="Aktif" 
                        value={stats.aktif} 
                        icon={<UserCheck className="h-5 w-5" />} 
                        iconColor="text-green-600 bg-green-100"
                    />
                </div>

                {/* Table with integrated search and filters */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <CardTitle className="text-base font-semibold">Daftar Pengguna</CardTitle>
                            <div className="flex gap-2 items-center flex-wrap">
                                <SearchBar 
                                    value={search} 
                                    onChange={handleSearch} 
                                    placeholder="Cari nama, email..." 
                                    className="w-64"
                                />
                                <Select value={roleFilter} onValueChange={handleRoleFilter}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roleOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {(search || roleFilter !== 'all' || statusFilter !== 'all') && (
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                            setSearch('');
                                            setRoleFilter('all');
                                            setStatusFilter('all');
                                            setPage(1);
                                        }}
                                    >
                                        Reset
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto px-4 pb-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pengguna</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Terdaftar</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedUsers.length > 0 ? (
                                        paginatedUsers.map((user: UserIndonesia) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={user.foto_profil} alt={user.nama_lengkap || user.nama} />
                                                            <AvatarFallback>
                                                                {getInitials(user.nama_lengkap || user.nama)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">{user.nama_lengkap || user.nama}</p>
                                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                                            {user.telepon && (
                                                                <p className="text-xs text-muted-foreground">{user.telepon}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getRoleBadgeColor(user.role)}>
                                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={user.aktif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                        {user.aktif ? 'Aktif' : 'Tidak Aktif'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{formatDate(user.created_at)}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/pengguna/${user.id}`} className="flex items-center gap-2">
                                                                    <Eye className="h-4 w-4" />
                                                                    Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/pengguna/${user.id}/edit`} className="flex items-center gap-2">
                                                                    <Edit className="h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Users className="h-8 w-8 text-muted-foreground" />
                                                    <p className="text-muted-foreground">Tidak ada data pengguna</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    itemsPerPage={perPage} 
                    totalItems={filteredUsers.length} 
                    onPageChange={setPage} 
                    onItemsPerPageChange={setPerPage} 
                />
            </div>
        </AppLayout>
    );
}
